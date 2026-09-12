// @ts-check
import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { computeGst } from "@/lib/gst";
import { maxAdultsFor } from "@/lib/booking/occupancy";
import {
  computeStayQuote,
  longStayDiscountForStay,
  longStayDiscountReason,
  nightsBetween,
} from "@/lib/pricing/quote.mjs";
import {
  LONG_STAY_DISCOUNT_RATE,
  LONG_STAY_MIN_NIGHTS,
  PEAK_PERIODS,
} from "@/lib/pricing/config.mjs";

/**
 * Server-side quoting: fetch the room and any staff rate rules, then hand the
 * whole thing to the pure engine.
 *
 * Every rule this used to implement inline — the peak surcharge, the long-stay
 * discount and its blackouts, the GST slab — now lives in src/lib/pricing. What
 * remains here is the database: which room, what it costs, which coupon codes
 * are live. That split is what makes the rate card testable, and the slab bug
 * it replaced was only ever reachable through a Supabase client.
 */

/** Re-exported under the names existing callers already import. */
export const MULTI_NIGHT_DISCOUNT_RATE = LONG_STAY_DISCOUNT_RATE;
export const MULTI_NIGHT_MIN_NIGHTS = LONG_STAY_MIN_NIGHTS;

/**
 * The peak periods, under the name the invoice route already reads them by.
 *
 * They were a blackout list for the discount before they were a surcharge
 * list; they are the same dates either way, and keeping two lists is how they
 * drift apart.
 */
export const LONG_WEEKEND_BLOCKS = PEAK_PERIODS;

/**
 * The long-stay discount for a past stay, under the name the invoice route
 * already imports. The implementation is in the pure module, where it is
 * covered by tests; this is only the alias.
 */
export const calculateMultiNightDiscount = longStayDiscountForStay;

/**
 * A per-night multiplier lookup built from the pricing_rules rows.
 *
 * Rules are stored as half-open date ranges, so a rule ending on the 20th does
 * not cover the night of the 20th. Where two rules overlap a night, the higher
 * multiplier wins — the same "highest applicable" precedence the previous
 * implementation used, applied per night instead of stretched across the whole
 * stay because one of its nights matched.
 */
function multiplierLookup(rules) {
  return (date) => {
    let multiplier = 1;
    for (const rule of rules ?? []) {
      if (!rule.date_from || !rule.date_to) continue;
      if (date >= rule.date_from && date < rule.date_to && Number(rule.multiplier) > multiplier) {
        multiplier = Number(rule.multiplier);
      }
    }
    return multiplier;
  };
}

export async function calculatePricing(params) {
  const { roomSlug, checkIn, checkOut, adults, children, infants = 0, couponCode } = params;
  const supabase = createAdminClient();

  const { data: room, error: roomError } = await supabase
    .from("rooms")
    .select("id, name, slug, base_price_per_night, min_nights")
    .eq("slug", roomSlug)
    .eq("is_active", true)
    .single();
  if (roomError || !room) throw new Error("Room not found");

  const nights = nightsBetween(checkIn, checkOut);
  if (nights < 1) throw new Error("Check-out must be after check-in");

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

  // pricing_rules has: rule_type, date_from, date_to, multiplier. These are
  // staff overrides layered on top of the published peak surcharge, never a
  // replacement for it — the engine takes whichever is higher for each night,
  // so an empty table still prices Christmas at +20%.
  const { data: rules } = await supabase
    .from("pricing_rules")
    .select("rule_type, date_from, date_to, multiplier")
    .or(`room_id.eq.${room.id},room_id.is.null`);

  const baseNightlyRate = Number(room.base_price_per_night);
  const stay = {
    baseNightlyRate,
    checkIn,
    checkOut,
    adults,
    children,
    infants,
    roomSlug: room.slug,
    peakMultiplierOverride: multiplierLookup(rules),
  };

  // Quote once without a coupon to learn how much room rent is left for one to
  // reach. A percentage coupon charged against the undiscounted tariff would
  // stack with the long-stay cut to 40% off, and a fixed-value one capped at
  // the undiscounted figure could drive the room line below zero.
  const undiscounted = computeStayQuote(stay);
  const discountableRoomTotal = +(
    undiscounted.seasonalBaseTotal - undiscounted.longStayDiscountTotal
  ).toFixed(2);

  let couponAmount = 0;
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
      // DB columns: valid_to (not valid_until), usage_limit (not max_uses),
      // min_booking_value (not min_amount).
      const notExpired = !coupon.valid_to || coupon.valid_to >= today;
      const notBeforeStart = !coupon.valid_from || coupon.valid_from <= today;
      const notExhausted =
        coupon.usage_limit == null || coupon.used_count < coupon.usage_limit;
      const meetsMinAmount =
        undiscounted.seasonalBaseTotal >= Number(coupon.min_booking_value);

      if (notExpired && notBeforeStart && notExhausted && meetsMinAmount) {
        couponAmount =
          coupon.discount_type === "percentage"
            ? +((discountableRoomTotal * Number(coupon.discount_value)) / 100).toFixed(2)
            : Math.min(Number(coupon.discount_value), discountableRoomTotal);
        appliedCouponCode = code;
      }
    }
  }

  const quote =
    couponAmount > 0
      ? computeStayQuote({ ...stay, couponDiscount: couponAmount })
      : undiscounted;

  // Split into CGST and SGST here rather than letting each surface halve the
  // total itself — one rounding decision, taken once, so checkout, review,
  // confirmation and the invoice cannot drift a paisa apart. The halves are
  // taken from the engine's own GST total rather than recomputed from a single
  // rate, because a stay spanning two slabs has no single rate to recompute at.
  const gst = computeGst(quote.taxableAmount, quote.gstRate);
  const cgstAmount = +(quote.totalGst / 2).toFixed(2);

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
    adultsIncluded: quote.adultsIncluded,
    maxAdults,

    // Per-night detail, so checkout can show a guest why two nights of one
    // stay cost different amounts instead of presenting an unexplained average.
    nightLines: quote.nightLines,
    peakNights: quote.peakNights,
    regularNights: quote.regularNights,
    peakLabels: quote.peakLabels,

    // An average once the stay straddles a season boundary; nightLines carries
    // the authoritative per-night figures.
    pricePerNight: +(quote.seasonalBaseTotal / nights).toFixed(2),
    baseNightlyTotal: quote.seasonalBaseTotal,
    extraGuestLines: quote.extraGuestLines.map((l) => ({
      ...l,
      // Existing callers render a stay-level amount on these lines.
      amount: +(l.amountPerNight * nights).toFixed(2),
    })),
    extraGuestTotal: +(quote.extraPersonPerNight * nights).toFixed(2),

    // Coupon only, under the name every existing caller already reads.
    discountAmount: quote.couponDiscountTotal,
    couponCode: appliedCouponCode,

    // Length-of-stay discount, kept as its own line so the summary can name it
    // rather than folding it into a coupon the guest never entered.
    multiNightDiscount: quote.longStayDiscountTotal,
    multiNightDiscountApplied: quote.longStayDiscountApplied,
    multiNightDiscountRate: MULTI_NIGHT_DISCOUNT_RATE,
    // Set even when nothing came off, so the UI can explain the absence on
    // blackout dates instead of silently showing no line at all.
    discountReason: longStayDiscountReason(quote),

    // Every reduction to the taxable base, for anything storing one figure.
    totalDiscount: quote.totalDiscount,

    gstRate: quote.gstRate,
    // True when the stay spans both slabs, so a surface showing one rate can
    // say so rather than implying the whole stay was taxed at it.
    mixedGstRates: quote.mixedGstRates,
    subtotalBeforeGst: quote.taxableAmount,
    // Alias for the taxable base under the name the pricing API documents.
    baseAmount: quote.taxableAmount,

    cgstRate: gst.cgstRate,
    sgstRate: gst.sgstRate,
    cgstAmount,
    sgstAmount: +(quote.totalGst - cgstAmount).toFixed(2),
    totalGst: quote.totalGst,
    // Retained under its original name for callers written before the split.
    gstAmount: quote.totalGst,
    totalAmount: quote.totalAmount,
  };
}
