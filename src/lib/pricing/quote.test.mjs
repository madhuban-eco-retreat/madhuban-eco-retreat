// @ts-check
/**
 * The rate card, asserted end to end.
 *
 * Cases A-E are the five worked examples the property signed off on; A, D and
 * E were already priced correctly and are here as regressions, while B and C
 * are the two that were wrong — an extra adult and a peak night respectively
 * both left the room on the 5% slab it no longer belonged on.
 *
 * Run with: npm test
 */

import test from "node:test";
import assert from "node:assert/strict";

import {
  computeStayQuote,
  seasonForNight,
  gstRateForEffectiveValue,
  longStayDiscountForStay,
} from "./quote.mjs";
import { computeAdminQuote } from "./admin-quote.mjs";
import {
  BASE_NIGHTLY_RATES,
  PEAK_PERIODS,
  GST_THRESHOLD,
  GST_RATE_LOW,
  GST_RATE_HIGH,
  PEAK_SURCHARGE_RATE,
  DAY_OUTING_RATE_PER_PERSON,
  SAFARI_RATE,
  SAFARI_WITH_NATURALIST_RATE,
  GUIDED_HIKE_RATE_PER_PERSON,
  GUIDED_HIKE_MIN_GUESTS,
  BUSH_DINING_RATE_PER_COUPLE,
  OTHER_CHARGES,
} from "./config.mjs";

const GLAMPING = BASE_NIGHTLY_RATES["glamping-tents"];
const SAFARI_TENT = BASE_NIGHTLY_RATES["safari-tent"];
const MUD_STANDARD = BASE_NIGHTLY_RATES["mud-house-standard"];

/* -- Case A --------------------------------------------------------------- */

test("A: Glamping, regular season, 1 night, 2 adults -> 7,500 at 5%", () => {
  const q = computeStayQuote({
    baseNightlyRate: GLAMPING,
    roomSlug: "glamping-tents",
    checkIn: "2026-09-10",
    checkOut: "2026-09-11",
    adults: 2,
  });

  assert.equal(q.nights, 1);
  assert.equal(q.peakNights, 0);
  assert.equal(q.nightLines[0].effectiveValue, 7500);
  assert.equal(q.gstRate, 5);
  assert.equal(q.totalGst, 375);
  assert.equal(q.totalAmount, 7875);
});

/* -- Case B — the extra-adult slab bug ------------------------------------ */

test("B: Glamping, regular, 1 night, 2 adults + 1 extra adult -> 9,500 at 18%", () => {
  const q = computeStayQuote({
    baseNightlyRate: GLAMPING,
    roomSlug: "glamping-tents",
    checkIn: "2026-09-10",
    checkOut: "2026-09-11",
    adults: 3,
  });

  assert.equal(q.extraPersonPerNight, 2000);
  // The slab is read from 7,500 + 2,000, not from the 7,500 catalogue tariff.
  assert.equal(q.nightLines[0].effectiveValue, 9500);
  assert.equal(q.taxableAmount, 9500);
  assert.equal(q.gstRate, 18);
  assert.equal(q.totalGst, 1710);
  assert.equal(q.totalAmount, 11210);
});

/* -- Case C — the peak-surcharge bug -------------------------------------- */

test("C: Glamping, peak (25 Dec), 1 night, 2 adults -> 9,000 at 18%, no discount", () => {
  const q = computeStayQuote({
    baseNightlyRate: GLAMPING,
    roomSlug: "glamping-tents",
    checkIn: "2026-12-25",
    checkOut: "2026-12-26",
    adults: 2,
  });

  assert.equal(q.peakNights, 1);
  assert.equal(q.nightLines[0].seasonalBase, 9000);
  assert.equal(q.longStayDiscountTotal, 0);
  assert.equal(q.nightLines[0].effectiveValue, 9000);
  assert.equal(q.gstRate, 18);
  assert.equal(q.totalGst, 1620);
  assert.equal(q.totalAmount, 10620);
});

/* -- Case D --------------------------------------------------------------- */

test("D: Safari Tent, peak (01 Jan), 2 nights, 2 adults -> 14,400/night at 18%", () => {
  const q = computeStayQuote({
    baseNightlyRate: SAFARI_TENT,
    roomSlug: "safari-tent",
    checkIn: "2027-01-01",
    checkOut: "2027-01-03",
    adults: 2,
  });

  assert.equal(q.nights, 2);
  // Both 01 and 02 Jan fall inside the 21 Dec - 04 Jan block.
  assert.equal(q.peakNights, 2);
  // A 2+ night stay, but every night is peak, so nothing comes off.
  assert.equal(q.longStayDiscountTotal, 0);
  for (const n of q.nightLines) {
    assert.equal(n.effectiveValue, 14400);
    assert.equal(n.gstRate, 18);
    assert.equal(n.gstAmount, 2592);
  }
  assert.equal(q.taxableAmount, 28800);
  assert.equal(q.totalGst, 5184);
  assert.equal(q.totalAmount, 33984);
});

/* -- Case E — slab read from the discounted transaction value ------------- */

test("E: Mud House Standard, regular, 3 nights, 2 adults -> 7,200/night at 5%", () => {
  const q = computeStayQuote({
    baseNightlyRate: MUD_STANDARD,
    roomSlug: "mud-house-standard",
    checkIn: "2026-09-10",
    checkOut: "2026-09-13",
    adults: 2,
  });

  assert.equal(q.nights, 3);
  assert.equal(q.longStayDiscountApplied, true);
  for (const n of q.nightLines) {
    assert.equal(n.seasonalBase, 9000);
    assert.equal(n.longStayDiscount, 1800);
    // 9,000 declared tariff, 7,200 actually charged. The slab follows the
    // amount charged, so the discount carries the night from 18% down to 5%.
    assert.equal(n.effectiveValue, 7200);
    assert.equal(n.gstRate, 5);
    assert.equal(n.gstAmount, 360);
  }
  assert.equal(q.taxableAmount, 21600);
  assert.equal(q.totalGst, 1080);
  assert.equal(q.totalAmount, 22680);
});

/* -- season classification ------------------------------------------------ */

test("Christmas is peak on both endpoints and regular either side of them", () => {
  assert.equal(seasonForNight("2026-12-20").season, "regular");
  assert.equal(seasonForNight("2026-12-21").season, "peak");
  assert.equal(seasonForNight("2026-12-25").season, "peak");
  assert.equal(seasonForNight("2027-01-04").season, "peak");
  assert.equal(seasonForNight("2027-01-05").season, "regular");
});

test("the Christmas window recurs every year, with no dated list to refresh", () => {
  // Matched by month/day, so a booking years out is still peak.
  assert.equal(seasonForNight("2029-12-21").season, "peak");
  assert.equal(seasonForNight("2029-12-25").season, "peak");
  assert.equal(seasonForNight("2030-01-04").season, "peak");
  assert.equal(seasonForNight("2030-01-05").season, "regular");
  assert.equal(seasonForNight("2031-12-25").season, "peak");
  assert.equal(seasonForNight("2029-07-04").season, "regular");
});

test("long weekends are no longer peak — Christmas is the only peak period", () => {
  // Dussehra, Diwali and Holi carried the surcharge on an earlier rate card.
  // They are regular season now; this guards against them creeping back in.
  for (const date of [
    "2026-10-16", "2026-10-17", "2026-10-20", "2026-10-21", // Dussehra
    "2026-11-06", "2026-11-10", "2026-11-14", "2026-11-15", // Diwali
    "2027-03-15", "2027-03-19", "2027-03-22", "2027-03-23", // Holi
  ]) {
    assert.equal(seasonForNight(date).season, "regular", date);
  }

  assert.equal(PEAK_PERIODS.length, 1);
  assert.equal(PEAK_PERIODS[0].label, "Christmas & New Year");
  assert.equal(PEAK_PERIODS[0].start, "2026-12-21");
  assert.equal(PEAK_PERIODS[0].end, "2027-01-04");
});

test("a former long weekend is sold at the regular rate, discount included", () => {
  // Diwali 2026: 2 nights at the plain tariff, and the long-stay discount now
  // applies to both because neither night is peak any more.
  const q = computeStayQuote({
    baseNightlyRate: GLAMPING,
    roomSlug: "glamping-tents",
    checkIn: "2026-11-07",
    checkOut: "2026-11-09",
    adults: 2,
  });

  assert.equal(q.peakNights, 0);
  assert.equal(q.longStayDiscountApplied, true);
  for (const n of q.nightLines) {
    assert.equal(n.seasonalBase, 7500);
    assert.equal(n.effectiveValue, 6000);
    assert.equal(n.gstRate, 5);
  }
  assert.equal(q.totalAmount, 12600);
});

test("a stay straddling 04/05 Jan prices each night on its own season", () => {
  const q = computeStayQuote({
    baseNightlyRate: GLAMPING,
    roomSlug: "glamping-tents",
    checkIn: "2027-01-04",
    checkOut: "2027-01-06",
    adults: 2,
  });

  assert.equal(q.nights, 2);
  assert.equal(q.peakNights, 1);
  assert.equal(q.regularNights, 1);

  const [jan4, jan5] = q.nightLines;
  assert.equal(jan4.season, "peak");
  assert.equal(jan4.seasonalBase, 9000);
  // Peak night in a 2+ stay: surcharge stands, discount withheld.
  assert.equal(jan4.longStayDiscount, 0);
  assert.equal(jan4.gstRate, 18);

  assert.equal(jan5.season, "regular");
  assert.equal(jan5.seasonalBase, 7500);
  // Regular night of the same stay: the stay qualifies, so 20% comes off.
  assert.equal(jan5.longStayDiscount, 1500);
  assert.equal(jan5.effectiveValue, 6000);
  assert.equal(jan5.gstRate, 5);

  assert.equal(q.mixedGstRates, true);
  assert.equal(q.taxableAmount, 15000);
  assert.equal(q.totalGst, 1620 + 300);
});

/* -- GST slab boundary ---------------------------------------------------- */

test("the threshold is inclusive at the lower slab", () => {
  assert.equal(gstRateForEffectiveValue(GST_THRESHOLD - 0.01), GST_RATE_LOW);
  assert.equal(gstRateForEffectiveValue(GST_THRESHOLD), GST_RATE_LOW);
  assert.equal(gstRateForEffectiveValue(GST_THRESHOLD + 0.01), GST_RATE_HIGH);
});

test("a child pushes a 7,500 tent over the threshold", () => {
  const q = computeStayQuote({
    baseNightlyRate: GLAMPING,
    roomSlug: "glamping-tents",
    checkIn: "2026-09-10",
    checkOut: "2026-09-11",
    adults: 2,
    children: 1,
  });

  assert.equal(q.nightLines[0].effectiveValue, 9000);
  assert.equal(q.gstRate, 18);
});

test("the Pool Side Villa tariff covers four adults, so no surcharge for them", () => {
  const q = computeStayQuote({
    baseNightlyRate: BASE_NIGHTLY_RATES["pool-side-villa"],
    roomSlug: "pool-side-villa",
    checkIn: "2026-09-10",
    checkOut: "2026-09-11",
    adults: 4,
  });

  assert.equal(q.extraPersonPerNight, 0);
  assert.equal(q.nightLines[0].effectiveValue, 12000);
  assert.equal(q.gstRate, 18);
});

test("infants are free and never move the slab", () => {
  const q = computeStayQuote({
    baseNightlyRate: GLAMPING,
    roomSlug: "glamping-tents",
    checkIn: "2026-09-10",
    checkOut: "2026-09-11",
    adults: 2,
    infants: 2,
  });

  assert.equal(q.extraPersonPerNight, 0);
  assert.equal(q.gstRate, 5);
  assert.equal(q.totalAmount, 7875);
});

/* -- peak surcharge, every category --------------------------------------- */

test("peak is exactly +20% on every room category", () => {
  const expected = {
    "mud-house-standard": 10800,
    "mud-house-premium": 12000,
    "glamping-tents": 9000,
    "safari-tent": 14400,
    "pool-side-villa": 14400,
  };

  for (const [slug, base] of Object.entries(BASE_NIGHTLY_RATES)) {
    const q = computeStayQuote({
      baseNightlyRate: base,
      roomSlug: slug,
      checkIn: "2026-12-25",
      checkOut: "2026-12-26",
      adults: 2,
    });
    assert.equal(q.nightLines[0].seasonalBase, expected[slug], slug);
    assert.equal(q.nightLines[0].seasonalBase, base * PEAK_SURCHARGE_RATE, slug);
  }
});

/* -- long-stay discount --------------------------------------------------- */

test("one night never earns the long-stay discount", () => {
  const q = computeStayQuote({
    baseNightlyRate: MUD_STANDARD,
    roomSlug: "mud-house-standard",
    checkIn: "2026-09-10",
    checkOut: "2026-09-11",
    adults: 2,
  });

  assert.equal(q.longStayDiscountApplied, false);
  assert.equal(q.nightLines[0].effectiveValue, 9000);
  assert.equal(q.gstRate, 18);
});

test("the long-stay discount comes off room rent only, never off extras", () => {
  const q = computeStayQuote({
    baseNightlyRate: MUD_STANDARD,
    roomSlug: "mud-house-standard",
    checkIn: "2026-09-10",
    checkOut: "2026-09-12",
    adults: 3,
  });

  const night = q.nightLines[0];
  assert.equal(night.longStayDiscount, 1800);
  assert.equal(night.roomValue, 7200);
  // 7,200 room + 2,000 extra adult, taxed together at the slab that sum falls in.
  assert.equal(night.effectiveValue, 9200);
  assert.equal(night.gstRate, 18);
});

/* -- admin pricing_rules override ----------------------------------------- */

test("a staff multiplier can raise a peak night but never undercut +20%", () => {
  const raised = computeStayQuote({
    baseNightlyRate: GLAMPING,
    roomSlug: "glamping-tents",
    checkIn: "2026-12-25",
    checkOut: "2026-12-26",
    adults: 2,
    peakMultiplierOverride: 1.4,
  });
  assert.equal(raised.nightLines[0].seasonalBase, 10500);

  const undercut = computeStayQuote({
    baseNightlyRate: GLAMPING,
    roomSlug: "glamping-tents",
    checkIn: "2026-12-25",
    checkOut: "2026-12-26",
    adults: 2,
    peakMultiplierOverride: 1,
  });
  assert.equal(undercut.nightLines[0].seasonalBase, 9000);
});

/* -- coupons -------------------------------------------------------------- */

test("a coupon is spread across nights and reduces the value the slab reads", () => {
  const q = computeStayQuote({
    baseNightlyRate: SAFARI_TENT,
    roomSlug: "safari-tent",
    checkIn: "2026-09-10",
    checkOut: "2026-09-12",
    adults: 2,
    couponDiscount: 4000,
  });

  // 12,000 less 20% long-stay = 9,600/night; the coupon takes 2,000 more.
  assert.equal(q.couponDiscountTotal, 4000);
  for (const n of q.nightLines) {
    assert.equal(n.roomValue, 7600);
    assert.equal(n.effectiveValue, 7600);
    assert.equal(n.gstRate, 18);
  }
  assert.equal(q.taxableAmount, 15200);
});

test("a coupon cannot drive the room line below zero", () => {
  const q = computeStayQuote({
    baseNightlyRate: GLAMPING,
    roomSlug: "glamping-tents",
    checkIn: "2026-09-10",
    checkOut: "2026-09-11",
    adults: 2,
    couponDiscount: 999999,
  });

  assert.equal(q.nightLines[0].roomValue, 0);
  assert.equal(q.taxableAmount, 0);
  assert.equal(q.totalAmount, 0);
});

/* -- invoice-side reconstruction ------------------------------------------ */

test("a past stay's long-stay discount is reconstructed from its room total", () => {
  const d = longStayDiscountForStay({
    baseNightlyTotal: 27000, // 3 x 9,000, all regular
    nights: 3,
    checkIn: "2026-09-10",
    checkOut: "2026-09-13",
  });

  assert.equal(d.applied, true);
  assert.equal(d.amount, 5400);
});

test("reconstruction gives nothing back on an all-peak stay", () => {
  const d = longStayDiscountForStay({
    baseNightlyTotal: 28800,
    nights: 2,
    checkIn: "2027-01-01",
    checkOut: "2027-01-03",
  });

  assert.equal(d.applied, false);
  assert.equal(d.amount, 0);
  assert.match(d.reason, /Christmas & New Year/);
});

test("reconstruction weights a mixed stay by what each night was sold at", () => {
  // 04 Jan at 9,000 (peak) + 05 Jan at 7,500 (regular) = 16,500 room rent.
  // Only the regular night is eligible, so 20% of 7,500 comes off.
  const d = longStayDiscountForStay({
    baseNightlyTotal: 16500,
    nights: 2,
    checkIn: "2027-01-04",
    checkOut: "2027-01-06",
  });

  assert.equal(d.applied, true);
  assert.equal(d.amount, 1500);
});

test("a staff rate rule suppresses the reconstructed discount", () => {
  const d = longStayDiscountForStay({
    baseNightlyTotal: 27000,
    nights: 3,
    checkIn: "2026-09-10",
    checkOut: "2026-09-13",
    multiplier: 1.3,
  });

  assert.equal(d.applied, false);
  assert.equal(d.amount, 0);
});

/* -- admin quote ---------------------------------------------------------- */

test("admin add-ons are taxed beside the room, not folded into its slab", () => {
  const q = computeAdminQuote({
    baseNightlyRate: GLAMPING,
    roomSlug: "glamping-tents",
    checkIn: "2026-09-10",
    checkOut: "2026-09-11",
    adults: 2,
    addons: [{ label: "Bush Dining", price: 3000, qty: 1, unit: "per couple" }],
  });

  // The room is still a 7,500 night at 5% — dinner does not move its slab.
  assert.equal(q.roomTotal, 7500);
  assert.equal(q.gstRatePct, 5);
  assert.equal(q.addonsTotal, 3000);
  assert.equal(q.subtotalBeforeGst, 10500);
  assert.equal(q.gstAmount, 525);
  assert.equal(q.totalAmount, 11025);
});

test("admin pricing carries the peak surcharge the old inline maths ignored", () => {
  const q = computeAdminQuote({
    baseNightlyRate: BASE_NIGHTLY_RATES["safari-tent"],
    roomSlug: "safari-tent",
    checkIn: "2026-12-25",
    checkOut: "2026-12-26",
    adults: 2,
  });

  assert.equal(q.roomTotal, 14400);
  assert.equal(q.gstRatePct, 18);
  assert.equal(q.totalAmount, 16992);
});

test("a per-night add-on multiplies by nights; a one-off does not", () => {
  const q = computeAdminQuote({
    baseNightlyRate: GLAMPING,
    roomSlug: "glamping-tents",
    checkIn: "2026-09-10",
    checkOut: "2026-09-12",
    adults: 2,
    addons: [
      { label: "Extra Mattress", price: 1500, qty: 1, unit: "per night" },
      { label: "Late Check-out", price: 2000, qty: 1, unit: "flat" },
    ],
  });

  assert.equal(q.nights, 2);
  assert.equal(q.addonsBreakdown[0].amount, 3000);
  assert.equal(q.addonsBreakdown[1].amount, 2000);
  assert.equal(q.addonsTotal, 5000);
});

/* -- other charges -------------------------------------------------------- */

test("the other-charge rate card is what the property signed off on", () => {
  assert.equal(DAY_OUTING_RATE_PER_PERSON, 1500);
  assert.equal(SAFARI_RATE, 6500);
  assert.equal(SAFARI_WITH_NATURALIST_RATE, 8000);
  assert.equal(GUIDED_HIKE_RATE_PER_PERSON, 2000);
  assert.equal(GUIDED_HIKE_MIN_GUESTS, 4);
  assert.equal(BUSH_DINING_RATE_PER_COUPLE, 3000);

  // The tariff page renders OTHER_CHARGES, so the rows must track the rates.
  const byKey = Object.fromEntries(OTHER_CHARGES.map((c) => [c.key, c]));
  assert.equal(byKey.safari.amount, SAFARI_RATE);
  assert.equal(byKey["safari-naturalist"].amount, SAFARI_WITH_NATURALIST_RATE);
  assert.equal(byKey["day-outing"].amount, DAY_OUTING_RATE_PER_PERSON);
});

/* -- GST slabs, restated ---------------------------------------------------
   The slab rule is unchanged by this rate-card revision and is asserted above
   in cases A-E; these pin the three configured values themselves so a future
   edit to config.mjs cannot move a slab silently. */

test("the configured GST slabs are 5% / 18% either side of 7,500", () => {
  assert.equal(GST_THRESHOLD, 7500);
  assert.equal(GST_RATE_LOW, 5);
  assert.equal(GST_RATE_HIGH, 18);
});
