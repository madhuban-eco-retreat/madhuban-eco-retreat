// @ts-check
import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { computeRoomGstRate, computeGst } from "@/lib/gst";
import { extraGuestCharges, adultsIncludedFor, maxAdultsFor } from "@/lib/booking/occupancy";
function diffDays(a, b) {
    const msPerDay = 86400000;
    return Math.round((new Date(b).getTime() - new Date(a).getTime()) / msPerDay);
}

/** Fraction taken off room rent for a qualifying multi-night stay. */
export const MULTI_NIGHT_DISCOUNT_RATE = 0.2;
/** Nights required before the multi-night discount applies at all. */
export const MULTI_NIGHT_MIN_NIGHTS = 2;

/**
 * Date ranges in which the multi-night discount is withheld.
 *
 * `end` is a departure date, not a stayed night — the same half-open convention
 * the pricing_rules overlap below already uses. A Dussehra block of 17–20 Oct
 * therefore covers the nights of the 17th, 18th and 19th, and a stay checking in
 * on the 20th is outside it. Getting this wrong in the other direction would
 * quietly hand out 20% on the single busiest night of each period.
 *
 * These are the fixed festival and long-weekend periods. They are deliberately
 * hard-coded rather than read from pricing_rules: a rate multiplier is a
 * commercial decision staff can edit in the admin, while these blackout dates
 * are a policy the discount must honour even if nobody has loaded a rule for
 * them yet.
 */
export const LONG_WEEKEND_BLOCKS = [
    { label: "Dussehra", start: "2026-10-17", end: "2026-10-20" },
    { label: "Diwali", start: "2026-11-06", end: "2026-11-14" },
    { label: "Christmas & New Year", start: "2026-12-21", end: "2027-01-04" },
    { label: "Holi", start: "2027-03-19", end: "2027-03-22" },
];

/** The first blackout period the stay touches, or null when it touches none. */
function blockedPeriodFor(checkIn, checkOut) {
    return (LONG_WEEKEND_BLOCKS.find((block) => checkIn < block.end && checkOut > block.start) ?? null);
}

/**
 * The multi-night discount, as a rupee figure off room rent alone.
 *
 * Extra adults and children are excluded by construction — this is handed
 * baseNightlyTotal, never the post-extras taxable base — so a family of four
 * gets 20% off the tent, not 20% off the surcharges for occupying it.
 *
 * A peak multiplier withholds it too: peak season is expressed in this system
 * as a pricing_rules multiplier above 1, and marking a date up 40% only to hand
 * 20% straight back is not a rate the property ever intended to sell.
 */
export function calculateMultiNightDiscount({ baseNightlyTotal, nights, checkIn, checkOut, multiplier = 1, }) {
    if (nights < MULTI_NIGHT_MIN_NIGHTS) {
        return { amount: 0, applied: false, reason: null };
    }
    const blocked = blockedPeriodFor(checkIn, checkOut);
    if (blocked) {
        return {
            amount: 0,
            applied: false,
            reason: `Not available for ${blocked.label} dates`,
        };
    }
    if (multiplier > 1) {
        return { amount: 0, applied: false, reason: "Not available on peak season dates" };
    }
    return {
        amount: +(baseNightlyTotal * MULTI_NIGHT_DISCOUNT_RATE).toFixed(2),
        applied: true,
        reason: `${Math.round(MULTI_NIGHT_DISCOUNT_RATE * 100)}% off for ${MULTI_NIGHT_MIN_NIGHTS}+ nights stay`,
    };
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
    // Length-of-stay discount, off room rent only and before any coupon.
    const multiNight = calculateMultiNightDiscount({
        baseNightlyTotal,
        nights,
        checkIn,
        checkOut,
        multiplier,
    });
    const multiNightDiscount = multiNight.amount;
    // What a coupon can still reach. Charging a percentage coupon against the
    // undiscounted tariff would stack to 40% off room rent, and a fixed-value
    // coupon capped at the undiscounted figure could drive the room line below
    // zero once the multi-night cut is also taken.
    const discountableRoomTotal = +(baseNightlyTotal - multiNightDiscount).toFixed(2);
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
                    discountAmount = +(discountableRoomTotal * Number(coupon.discount_value) / 100).toFixed(2);
                }
                else {
                    discountAmount = Math.min(Number(coupon.discount_value), discountableRoomTotal);
                }
                appliedCouponCode = code;
            }
        }
    }
    // Taxable base = room nights + extra occupants − discount. GST is then
    // charged on top of that, so the guest pays base + GST rather than the
    // tariff having the tax carved out of it.
    const totalDiscount = +(multiNightDiscount + discountAmount).toFixed(2);
    const subtotalBeforeGst = +(baseNightlyTotal + extras.total - totalDiscount).toFixed(2);
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
        // Coupon only, under the name every existing caller already reads.
        discountAmount,
        couponCode: appliedCouponCode,
        // Length-of-stay discount, kept as its own line so the summary can name
        // it rather than folding it into a coupon the guest never entered.
        multiNightDiscount,
        multiNightDiscountApplied: multiNight.applied,
        multiNightDiscountRate: MULTI_NIGHT_DISCOUNT_RATE,
        // Set even when nothing came off, so the UI can explain the absence on
        // blackout dates instead of silently showing no line at all.
        discountReason: multiNight.reason,
        // Every reduction to the taxable base, for anything storing one figure.
        totalDiscount,
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
