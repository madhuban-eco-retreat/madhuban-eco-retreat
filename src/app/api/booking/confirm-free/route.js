import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { BOOKING_NOTIFICATION_EMAILS } from "@/lib/admin/constants";
import { sendEmail } from "@/lib/resend";
import { bookingConfirmationGuestEmail } from "@/lib/resend/templates/booking-confirmation-guest";
import { bookingConfirmationAdminEmail } from "@/lib/resend/templates/booking-confirmation-admin";
import { createNotification } from "@/lib/admin/notifications";
import { checkRateLimit } from "@/lib/ratelimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Matches create-order, so a stale booking cannot be confirmed hours later. */
const BOOKING_WINDOW_MINUTES = 60;

/**
 * Confirms a booking that costs nothing, without going near Razorpay.
 *
 * Razorpay rejects orders below ₹1, so a coupon covering the whole stay left
 * checkout dead: the order call failed and the guest could not complete a
 * booking the discount had already paid for. There is nothing to charge, so
 * there is no payment gateway in this path at all.
 *
 * That makes this the one endpoint that can confirm a booking without money
 * changing hands, and it is therefore the one that has to be certain the
 * booking really is free. It re-reads total_amount from the row rather than
 * trusting anything in the request — the caller supplies an id and nothing
 * else, so the only way through is a booking the server itself priced at zero.
 */
export async function POST(req) {
    // Same public-endpoint ceiling the price API uses: this one writes, so
    // leaving it unthrottled would invite a booking-id enumeration sweep.
    const limit = await checkRateLimit(req, "price");
    if (limit.limited) {
        return NextResponse.json({ error: "Too many requests. Please try again shortly." }, { status: 429, headers: { "Retry-After": String(limit.retryAfter ?? 600) } });
    }

    let body;
    try {
        body = await req.json();
    }
    catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }
    const bookingId = typeof body?.bookingId === "string" ? body.bookingId : "";
    if (!bookingId) {
        return NextResponse.json({ error: "bookingId required" }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { data: booking, error: bookingError } = await supabase
        .from("bookings")
        .select(`
      id, booking_ref, status, total_amount, base_amount, gst_amount,
      discount_amount, coupon_code, created_at,
      checkin, checkout, num_adults, num_children, source, special_requests,
      guests!guest_id ( name, email, mobile ),
      rooms!room_id ( name, slug )
    `)
        .eq("id", bookingId)
        .single();
    if (bookingError || !booking) {
        return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Idempotent: a double-submit or a retried request returns the same
    // reference rather than confirming twice and sending a second email.
    if (booking.status === "CONFIRMED") {
        return NextResponse.json({ ok: true, bookingRef: booking.booking_ref });
    }
    if (booking.status !== "PENDING_PAYMENT") {
        return NextResponse.json({ error: `Booking is already ${booking.status.toLowerCase()}` }, { status: 409 });
    }

    const ageMinutes = (Date.now() - new Date(booking.created_at).getTime()) / 60000;
    if (ageMinutes > BOOKING_WINDOW_MINUTES) {
        return NextResponse.json({ error: "This booking has expired. Please start a new booking." }, { status: 410 });
    }

    // The security check. Anything payable must go through Razorpay, so a
    // request naming a booking with a balance is refused outright — this is
    // what stops the endpoint being used to confirm a paid stay for free.
    const totalAmount = Number(booking.total_amount);
    if (!Number.isFinite(totalAmount) || totalAmount > 0) {
        console.warn(`[confirm-free] refused: booking ${bookingId} has a balance of ${totalAmount}`);
        return NextResponse.json({ error: "This booking requires payment." }, { status: 400 });
    }

    const { error: updateError } = await supabase
        .from("bookings")
        .update({ status: "CONFIRMED", payment_status: "paid" })
        .eq("id", bookingId)
        // Only flip a row still awaiting payment. Two requests racing means the
        // loser matches nothing rather than both proceeding to send email.
        .eq("status", "PENDING_PAYMENT");
    if (updateError) {
        console.error("[confirm-free] status update failed:", updateError);
        return NextResponse.json({ error: "Could not confirm booking." }, { status: 500 });
    }

    // A zero-value payment row, so the booking reconciles like any other rather
    // than appearing to have been confirmed with no record of settlement.
    await supabase.from("payments").insert({
        booking_id: booking.id,
        amount: 0,
        status: "captured",
        payment_type: "full",
        // Column is `method`, matching the offline-payment route — free text,
        // not an enum, so "coupon" reads plainly in the admin payment list.
        method: "coupon",
        notes: booking.coupon_code ? `Fully covered by coupon ${booking.coupon_code}` : "Fully discounted booking",
        captured_at: new Date().toISOString(),
    });

    await supabase.from("audit_log").insert({
        admin_user_id: "system",
        actor_email: "system",
        action: "booking_confirmed_free",
        entity_type: "booking",
        entity_id: bookingId,
        details: {
            booking_ref: booking.booking_ref,
            coupon_code: booking.coupon_code ?? null,
            discount_amount: booking.discount_amount ?? null,
            total_amount: totalAmount,
        },
    });

    const guest = Array.isArray(booking.guests) ? booking.guests[0] : booking.guests;
    const room = Array.isArray(booking.rooms) ? booking.rooms[0] : booking.rooms;

    if (guest && room) {
        const nights = Math.round((new Date(booking.checkout).getTime() - new Date(booking.checkin).getTime()) / 86400000);
        const baseAmount = booking.base_amount != null ? Number(booking.base_amount) : null;
        const gstAmount = booking.gst_amount != null ? Number(booking.gst_amount) : null;
        const confirmationData = {
            bookingRef: booking.booking_ref,
            guestName: guest.name,
            roomName: room.name,
            checkIn: booking.checkin,
            checkOut: booking.checkout,
            nights,
            adults: booking.num_adults,
            children: booking.num_children,
            baseAmount,
            gstAmount,
            gstRate: baseAmount && gstAmount != null && baseAmount > 0
                ? Math.round((gstAmount / baseAmount) * 100)
                : null,
            totalAmount,
            specialRequests: booking.special_requests,
        };
        // Email failures are logged, never fatal. The booking is already
        // confirmed at this point and answering with an error would send the
        // guest back to a payment screen for a stay they have secured.
        try {
            await sendEmail({ to: guest.email, ...bookingConfirmationGuestEmail(confirmationData) });
        }
        catch (err) {
            console.error("[confirm-free] guest email failed:", err);
        }
        try {
            await sendEmail({
                to: BOOKING_NOTIFICATION_EMAILS,
                ...bookingConfirmationAdminEmail({
                    ...confirmationData,
                    bookingId,
                    discountAmount: booking.discount_amount != null ? Number(booking.discount_amount) : null,
                    couponCode: booking.coupon_code ?? null,
                    guestEmail: guest.email,
                    guestMobile: guest.mobile ?? "",
                    source: booking.source,
                    paidAmount: 0,
                }),
            });
        }
        catch (err) {
            console.error("[confirm-free] admin email failed:", err);
        }
        try {
            await createNotification({
                type: "booking_created",
                title: `Fully discounted booking — ${booking.booking_ref}`,
                body: `${guest.name} · ${room.name} · ₹0 payable${booking.coupon_code ? ` (coupon ${booking.coupon_code})` : ""}`,
                linkUrl: `/admin/bookings/${bookingId}`,
            });
        }
        catch (err) {
            console.error("[confirm-free] notification failed:", err);
        }
    }

    return NextResponse.json({ ok: true, bookingRef: booking.booking_ref });
}
