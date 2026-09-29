import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { BOOKING_NOTIFICATION_EMAILS } from "@/lib/admin/constants";
import { sendEmail } from "@/lib/resend";
import { bookingConfirmationGuestEmail } from "@/lib/resend/templates/booking-confirmation-guest";
import { bookingConfirmationAdminEmail } from "@/lib/resend/templates/booking-confirmation-admin";
import { createNotification } from "@/lib/admin/notifications";
import { mealPlanFacts } from "@/lib/booking/meal-plan";

/**
 * Fetches one booking fresh and sends its guest + admin confirmation emails
 * plus the staff notification — the same three sends /api/booking/verify-payment
 * does for a single booking, factored out so a multi-room group can call it
 * once per booking without duplicating that block.
 */
export async function sendBookingConfirmationEmails(bookingId) {
  const supabase = createAdminClient();
  const { data: booking } = await supabase
    .from("bookings")
    .select(`
      id, booking_ref, total_amount, base_amount, gst_amount, discount_amount, coupon_code,
      checkin, checkout, num_adults, num_children, source, special_requests, internal_notes, meal_plan,
      guests!guest_id ( name, email, mobile ),
      rooms!room_id ( name, slug )
    `)
    .eq("id", bookingId)
    .single();
  if (!booking) return;

  const guest = Array.isArray(booking.guests) ? booking.guests[0] : booking.guests;
  const room = Array.isArray(booking.rooms) ? booking.rooms[0] : booking.rooms;
  if (!guest || !room) return;

  const totalAmount = Number(booking.total_amount);
  const nights = Math.round(
    (new Date(booking.checkout).getTime() - new Date(booking.checkin).getTime()) / 86400000,
  );
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
    gstRate: baseAmount && gstAmount != null && baseAmount > 0 ? Math.round((gstAmount / baseAmount) * 100) : null,
    totalAmount,
    specialRequests: booking.special_requests,
    ...mealPlanFacts(booking),
  };

  try {
    await sendEmail({ to: guest.email, ...bookingConfirmationGuestEmail(confirmationData) });
  } catch (err) {
    console.error("[send-confirmation] guest email failed:", err);
  }
  try {
    await sendEmail({
      to: BOOKING_NOTIFICATION_EMAILS,
      ...bookingConfirmationAdminEmail({
        ...confirmationData,
        bookingId: booking.id,
        discountAmount: booking.discount_amount != null ? Number(booking.discount_amount) : null,
        couponCode: booking.coupon_code ?? null,
        guestEmail: guest.email,
        guestMobile: guest.mobile ?? "",
        source: booking.source,
        paidAmount: totalAmount,
      }),
    });
  } catch (err) {
    console.error("[send-confirmation] admin email failed:", err);
  }
  try {
    await createNotification({
      type: "payment_received",
      title: `Payment received — ${booking.booking_ref}`,
      body: `${guest.name} · ${room.name} · ₹${totalAmount.toLocaleString("en-IN")}`,
      linkUrl: `/admin/bookings/${booking.id}`,
    });
  } catch (err) {
    console.error("[send-confirmation] notification failed:", err);
  }
}
