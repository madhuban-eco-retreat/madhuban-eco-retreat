import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { computeRoomGstRate, isInterStateGuest, computeTaxBreakdown, getFinancialYear, HSN_ACCOMMODATION } from "@/lib/gst";
import { extraGuestCharges } from "@/lib/booking/occupancy";
import { calculateMultiNightDiscount, MULTI_NIGHT_DISCOUNT_RATE } from "@/lib/booking/pricing";
import { assertAdmin } from "@/lib/admin/auth";
const roundTo2 = (n) => Math.round(n * 100) / 100;
const ISSUER = {
    legal_name: "Somaiya Properties And Investments Private Limited",
    trade_name: "Madhuban Eco Retreat",
    gstin: "23AAACT5004A1Z9",
    address: "Narmada Farm Kheri, Rehti, Sehore, Madhya Pradesh, 466446",
    state: "Madhya Pradesh",
};
/** Checks if "Madhya Pradesh" or common abbreviations appear in an address string. */
function extractStateFromAddress(address) {
    if (!address)
        return null;
    const lower = address.toLowerCase();
    if (lower.includes("madhya pradesh") || lower.includes("m.p."))
        return "Madhya Pradesh";
    return null;
}
export async function POST(req) {
    const user = await assertAdmin();
    if (!user)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    let body;
    try {
        body = await req.json();
    }
    catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }
    const { booking_id } = body;
    if (!booking_id)
        return NextResponse.json({ error: "booking_id required" }, { status: 400 });
    const supabase = createAdminClient();
    // Check if invoice already exists for this booking
    const { data: existing } = await supabase
        .from("invoices")
        .select("id, invoice_number")
        .eq("booking_id", booking_id)
        .maybeSingle();
    if (existing) {
        return NextResponse.json({ error: "Invoice already exists for this booking", invoice_id: existing.id, invoice_number: existing.invoice_number }, { status: 409 });
    }
    // Fetch booking + guest + room
    const { data: bookingRaw, error: bookingErr } = await supabase
        .from("bookings")
        .select(`
      *,
      guests!guest_id ( id, name, mobile, email, address, gstin ),
      rooms!room_id ( id, name, slug, base_price_per_night )
    `)
        .eq("id", booking_id)
        .single();
    if (bookingErr || !bookingRaw) {
        return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }
    const booking = bookingRaw;
    const guest = Array.isArray(booking.guests) ? booking.guests[0] ?? null : booking.guests;
    const room = Array.isArray(booking.rooms) ? booking.rooms[0] ?? null : booking.rooms;
    if (booking.status === "CANCELLED") {
        return NextResponse.json({ error: "Cannot invoice a cancelled booking" }, { status: 400 });
    }
    if (!room) {
        return NextResponse.json({ error: "Room data missing" }, { status: 500 });
    }
    // Compute nights
    const checkinDate = new Date(booking.checkin + "T00:00:00");
    const checkoutDate = new Date(booking.checkout + "T00:00:00");
    const nights = Math.max(1, Math.round((checkoutDate.getTime() - checkinDate.getTime()) / 86400000));
    // Format dates for description
    const checkinLabel = checkinDate.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
    const checkoutLabel = checkoutDate.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
    // Build line items — amounts are pre-GST, matching how rooms are tariffed.
    const addons = (Array.isArray(booking.addons) ? booking.addons : []);
    // Extra occupants are charged on the booking but are not addon rows, so they
    // are reconstructed from the stored headcount. Without these the invoice
    // total would fall short of what the guest actually paid.
    // roomSlug matters: the Pool Side Villa's tariff covers four adults, so
    // without it the invoice would bill a surcharge for the third and fourth
    // that the guest was never charged, and overshoot what they actually paid.
    const extras = extraGuestCharges({
        adults: booking.num_adults ?? 0,
        children: booking.num_children ?? 0,
        nights,
        roomSlug: room.slug,
    });
    // The booking row, not the room catalogue, is what the guest was actually
    // charged. base_amount is stored NET of discount_amount, so the gross room
    // rent is the two added back together with the extra-occupant surcharges
    // taken out again. Reading room.base_price_per_night instead — as this route
    // used to — ignored the multi-night discount entirely and billed the full
    // tariff, and would also reprint an old invoice at today's rate if the
    // tariff moved. A booking predating the stored-figures model, or one whose
    // columns do not add up, falls back to the catalogue rate.
    const storedBase = Number(booking.base_amount ?? 0);
    const storedDiscount = Math.max(0, Number(booking.discount_amount ?? 0));
    const derivedRoomTotal = roundTo2(storedBase + storedDiscount - extras.total);
    const roomTotal = Number.isFinite(derivedRoomTotal) && derivedRoomTotal > 0
        ? derivedRoomTotal
        : roundTo2(room.base_price_per_night * nights);
    const nightlyRate = roundTo2(roomTotal / nights);
    // A single stored discount_amount covers both reductions, so the two are
    // separated back out for the invoice: staff and guests both read "20% off"
    // and a coupon code as different things. calculateMultiNightDiscount is the
    // same function checkout priced with, so the blackout dates are honoured
    // here too. When the split does not reconcile — a peak-season booking, say,
    // where the multiplier that suppressed the discount is not stored — the
    // reduction is shown as one combined line rather than a guess.
    const multiNight = calculateMultiNightDiscount({
        baseNightlyTotal: roomTotal,
        nights,
        checkIn: booking.checkin,
        checkOut: booking.checkout,
    });
    const couponPortion = roundTo2(storedDiscount - multiNight.amount);
    const splitReconciles = multiNight.applied && multiNight.amount > 0 && couponPortion >= 0;
    const discountLines = [];
    if (storedDiscount > 0) {
        if (splitReconciles) {
            discountLines.push({
                description: `Less: ${Math.round(MULTI_NIGHT_DISCOUNT_RATE * 100)}% multi-night stay discount on room rent`,
                hsn: HSN_ACCOMMODATION,
                qty: 1,
                rate: -multiNight.amount,
                amount: -multiNight.amount,
            });
            if (couponPortion > 0) {
                discountLines.push({
                    description: `Less: Coupon discount${booking.coupon_code ? ` (${booking.coupon_code})` : ""}`,
                    hsn: HSN_ACCOMMODATION,
                    qty: 1,
                    rate: -couponPortion,
                    amount: -couponPortion,
                });
            }
        }
        else {
            discountLines.push({
                description: `Less: Discount${booking.coupon_code ? ` (coupon ${booking.coupon_code})` : ""}`,
                hsn: HSN_ACCOMMODATION,
                qty: 1,
                rate: -storedDiscount,
                amount: -storedDiscount,
            });
        }
    }
    const lineItems = [
        {
            description: `${room.name} · ${nights} Night${nights > 1 ? "s" : ""} · ${checkinLabel} to ${checkoutLabel}`,
            hsn: HSN_ACCOMMODATION,
            qty: nights,
            rate: nightlyRate,
            amount: roomTotal,
        },
        ...extras.lines.map((l) => ({
            description: `${l.label} × ${l.qty} · ${nights} night${nights > 1 ? "s" : ""}`,
            hsn: HSN_ACCOMMODATION,
            qty: l.qty * nights,
            rate: l.ratePerNight,
            amount: l.amount,
        })),
        ...addons.map((a) => ({
            description: `${a.label} × ${a.qty}`,
            hsn: HSN_ACCOMMODATION,
            qty: a.qty,
            rate: a.price,
            amount: Math.round(a.price * a.qty * 100) / 100,
        })),
        // Last, so the table reads as charges then deductions. Carried as a
        // negative line rather than its own column because the invoices table
        // has no discount field — this way the stored taxable_amount is the sum
        // of the lines either way, and every existing invoice still renders.
        ...discountLines,
    ];
    // GST rate always computed from base price — never read stored column
    const gstRatePct = computeRoomGstRate(room.base_price_per_night);
    // Line amounts exclude GST, so their sum IS the taxable value; the tax is
    // added on top by computeTaxBreakdown below. With the discount carried as a
    // negative line, that sum is the DISCOUNTED base — which is what GST is
    // charged on, and what the admin folio already shows as the subtotal.
    const taxableAmount = Math.round(lineItems.reduce((s, i) => s + i.amount, 0) * 100) / 100;
    // Determine guest state for intra/inter-state split
    const isCorporate = !!booking.corporate_gstin;
    const rawAddress = isCorporate ? booking.corporate_address : guest?.address ?? null;
    const detectedState = extractStateFromAddress(rawAddress);
    const interState = isInterStateGuest(detectedState);
    const tax = computeTaxBreakdown(taxableAmount, gstRatePct, interState);
    // Bill-to details
    const billTo = {
        name: isCorporate ? (booking.corporate_company_name ?? guest?.name ?? "Guest") : (guest?.name ?? "Guest"),
        phone: guest?.mobile ?? null,
        email: guest?.email ?? null,
        address: rawAddress ?? null,
        state: detectedState ?? (interState ? null : "Madhya Pradesh"),
        gstin: isCorporate ? booking.corporate_gstin : (guest?.gstin ?? null),
        company_name: isCorporate ? booking.corporate_company_name : null,
    };
    const fy = getFinancialYear();
    // Call atomic create function
    const { data: result, error: rpcErr } = await supabase.rpc("create_invoice_atomic", {
        p_booking_id: booking_id,
        p_issuer: ISSUER,
        p_bill_to: billTo,
        p_service: {
            fy,
            from: booking.checkin,
            to: booking.checkout,
            place_of_supply_state: "Madhya Pradesh",
        },
        p_tax: {
            is_inter_state: tax.isInterState,
            gst_rate: tax.gstRate,
            taxable: tax.taxableAmount,
            cgst_rate: tax.cgstRate ?? "",
            cgst_amount: tax.cgstAmount ?? "",
            sgst_rate: tax.sgstRate ?? "",
            sgst_amount: tax.sgstAmount ?? "",
            igst_rate: tax.igstRate ?? "",
            igst_amount: tax.igstAmount ?? "",
            total_gst: tax.totalGst,
            total: tax.totalAmount,
        },
        p_line_items: lineItems,
        p_generated_by: user.email,
    });
    if (rpcErr) {
        console.error("create_invoice_atomic error:", rpcErr);
        return NextResponse.json({ error: "Invoice creation failed", detail: rpcErr.message }, { status: 500 });
    }
    const { invoice_id, invoice_number } = result;
    // Audit log
    await supabase.from("audit_log").insert({
        admin_user_id: user.id,
        actor_email: user.email ?? null,
        action: "invoice_generated",
        entity_type: "invoice",
        entity_id: invoice_id,
        details: { invoice_number, booking_id, generated_by: user.email },
    });
    return NextResponse.json({ invoice_id, invoice_number }, { status: 200 });
}
