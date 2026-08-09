// @ts-check
import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { computeRoomGstRate, computeGst } from "@/lib/gst";
import { extraGuestCharges, adultsIncludedFor, maxAdultsFor } from "@/lib/booking/occupancy";
function diffDays(a, b) {
    const msPerDay = 86400000;
    return Math.round((new Date(b).getTime() - new Date(a).getTime()) / msPerDay);
}
export async function calculatePricing(params) {
    const { roomSlug, checkIn, checkOut, adults, children, infants = 0, couponCode } = params;
    const supabase = createAdminClient();
    // Fetch room
    const { data: room, error: roomError } = await supabase
        .from("rooms")
        .select("id, name, slug, base_price_per_night, min_nights")
        .eq("slug", roomSlug)
        .eq("is_active", true)
        .single();
    if (roomError || !room)
        throw new Error("Room not found");
    const nights = diffDays(checkIn, checkOut);
    if (nights < 1)
        throw new Error("Check-out must be after check-in");
    const minNights = room.min_nights ?? 1;
    if (nights < minNights)
        throw new Error(`Minimum stay is ${minNights} night${minNights > 1 ? "s" : ""}`);
    // The request schema can only bound adults by the largest figure any room
    // allows, because it has no room in hand. The authoritative per-room cap is
    // here, where the slug is known — without it a hand-crafted request could
    // put six adults in a Safari Tent at the double-occupancy rate.
    const maxAdults = maxAdultsFor(room.slug);
    if (adults > maxAdults)
        throw new Error(`This room takes up to ${maxAdults} adult${maxAdults > 1 ? "s" : ""}`);
    // Apply pricing rules — take the highest multiplier that applies to the date range.
    // pricing_rules has: rule_type, date_from, date_to, multiplier (no is_active/priority columns).
    const { data: rules } = await supabase
        .from("pricing_rules")
        .select("rule_type, date_from, date_to, multiplier")
        .or(`room_id.eq.${room.id},room_id.is.null`);
    let multiplier = 1;
    for (const rule of rules ?? []) {
        if (rule.date_from && rule.date_to) {
            const applies = checkIn < rule.date_to && checkOut > rule.date_from;
            if (applies && rule.multiplier > multiplier) {
                multiplier = rule.multiplier;
            }
        }
    }
    const baseNightlyRate = Number(room.base_price_per_night);
    const effectiveNightlyRate = +(baseNightlyRate * multiplier).toFixed(2);
    // Slab is keyed to the room's own nightly tariff, not the post-extras total,
    // so adding a guest never silently moves a room into a higher bracket.
    const gstRatePct = computeRoomGstRate(baseNightlyRate);
    const baseNightlyTotal = +(effectiveNightlyRate * nights).toFixed(2);
    // Extra occupants are taxable base, so they are added before GST — not
    // after, and not inside the room line.
    const extras = extraGuestCharges({ adults, children, nights, roomSlug: room.slug });
    // Apply coupon
    let discountAmount = 0;
    let appliedCouponCode = null;
    if (couponCode) {
        const code = couponCode.trim().toUpperCase();
        const { data: coupon } = await supabase
            .from("coupons")
            .select("*")
            .eq("code", code)
            .eq("is_active", true)
            .single();
        if (coupon) {
            const today = new Date().toISOString().slice(0, 10);
            // DB columns: valid_to (not valid_until), usage_limit (not max_uses), min_booking_value (not min_amount)
            const notExpired = !coupon.valid_to || coupon.valid_to >= today;
            const notBeforeStart = !coupon.valid_from || coupon.valid_from <= today;
            const notExhausted = coupon.usage_limit == null || coupon.used_count < coupon.usage_limit;
            const meetsMinAmount = baseNightlyTotal >= Number(coupon.min_booking_value);
            if (notExpired && notBeforeStart && notExhausted && meetsMinAmount) {
                if (coupon.discount_type === "percentage") {
                    discountAmount = +(baseNightlyTotal * Number(coupon.discount_value) / 100).toFixed(2);
                }
                else {
                    discountAmount = Math.min(Number(coupon.discount_value), baseNightlyTotal);
                }
                appliedCouponCode = code;
            }
        }
    }
    // Taxable base = room nights + extra occupants − discount. GST is then
    // charged on top of that, so the guest pays base + GST rather than the
    // tariff having the tax carved out of it.
    const subtotalBeforeGst = +(baseNightlyTotal + extras.total - discountAmount).toFixed(2);
    // Split into CGST and SGST here rather than letting each surface halve the
    // total itself — one rounding decision, taken once, so checkout, review,
    // confirmation and the invoice cannot drift a paisa apart.
    const gst = computeGst(subtotalBeforeGst, gstRatePct);
    return {
        roomId: room.id,
        roomSlug: room.slug,
        roomName: room.name,
        checkIn,
        checkOut,
        nights,
        adults,
        children,
        infants,
        // Surfaced so the summary can say what the tariff already covers rather
        // than leaving a guest to infer it from the absence of a surcharge.
        adultsIncluded: adultsIncludedFor(room.slug),
        maxAdults,
        pricePerNight: effectiveNightlyRate,
        baseNightlyTotal,
        extraGuestLines: extras.lines,
        extraGuestTotal: extras.total,
        discountAmount,
        couponCode: appliedCouponCode,
        gstRate: gstRatePct,
        subtotalBeforeGst,
        // Alias for the taxable base under the name the pricing API documents.
        baseAmount: subtotalBeforeGst,
        cgstRate: gst.cgstRate,
        sgstRate: gst.sgstRate,
        cgstAmount: gst.cgstAmount,
        sgstAmount: gst.sgstAmount,
        totalGst: gst.totalGst,
        // Retained under its original name for callers written before the split.
        gstAmount: gst.totalGst,
        totalAmount: gst.totalAmount,
    };
}
