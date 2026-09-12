// @ts-check
/**
 * The database-driven rate card.
 *
 * Two properties matter more than any individual assertion here:
 *
 *   1. An un-edited card prices EXACTLY as config.mjs always did. That is what
 *      makes the migration a no-op on day one.
 *   2. A missing row falls back rather than failing. A half-applied migration,
 *      an empty table or a deleted row must leave the site quoting, not 500ing
 *      or quoting zero.
 */

import test from "node:test";
import assert from "node:assert/strict";

import { rateCardFromRows, DEFAULT_RATE_CARD, nightlyRateFor } from "./rate-card.mjs";
import { computeStayQuote, seasonForNight, gstRateForEffectiveValue } from "./quote.mjs";
import { computeAdminQuote } from "./admin-quote.mjs";
import { BASE_NIGHTLY_RATES } from "./config.mjs";

const GLAMPING = BASE_NIGHTLY_RATES["glamping-tents"];

/* -- day one is a no-op ---------------------------------------------------- */

test("an empty database yields exactly the shipped rate card", () => {
  const card = rateCardFromRows({});
  assert.deepEqual(card.gst, { ...DEFAULT_RATE_CARD.gst });
  assert.deepEqual(card.baseRates, { ...DEFAULT_RATE_CARD.baseRates });
  assert.equal(card.peakSurchargeRate, DEFAULT_RATE_CARD.peakSurchargeRate);
  assert.equal(card.longStay.rate, DEFAULT_RATE_CARD.longStay.rate);
  assert.equal(card.occupancy.extraAdultRate, DEFAULT_RATE_CARD.occupancy.extraAdultRate);
});

test("the seeded rows reproduce case A to the rupee", () => {
  // The migration seeds these exact values, so a quote taken through the DB
  // card must match the quote taken through config.
  const card = rateCardFromRows({
    roomRates: [
      { room_slug: "glamping-tents", label: "Glamping Tent", regular_rate: 7500, peak_rate: 9000, sort_order: 3, is_active: true },
    ],
    gstRules: { threshold: 7500, rate_low: 5, rate_high: 18 },
    occupancyRules: {
      extra_adult_rate: 2000, child_rate: 1500, infant_rate: 0, extra_bedding_rate: 2000,
      infant_max_age: 5, child_max_age: 12, default_adults_included: 2, default_max_adults: 3,
    },
    longStayRules: { discount_rate: 0.2, min_nights: 2, applies_on_peak: false, is_active: true },
  });

  const fromDb = computeStayQuote({
    roomSlug: "glamping-tents",
    checkIn: "2026-09-10",
    checkOut: "2026-09-11",
    adults: 2,
    rateCard: card,
  });
  const fromConfig = computeStayQuote({
    baseNightlyRate: GLAMPING,
    roomSlug: "glamping-tents",
    checkIn: "2026-09-10",
    checkOut: "2026-09-11",
    adults: 2,
  });

  assert.equal(fromDb.totalAmount, fromConfig.totalAmount);
  assert.equal(fromDb.totalAmount, 7875);
  assert.equal(fromDb.gstRate, 5);
});

/* -- DB-driven rates reach the quote --------------------------------------- */

test("a rate edited in the database drives the quote", () => {
  const card = rateCardFromRows({
    roomRates: [
      { room_slug: "glamping-tents", label: "Glamping Tent", regular_rate: 8000, peak_rate: 9600, is_active: true },
    ],
  });

  assert.equal(card.baseRates["glamping-tents"], 8000);

  const q = computeStayQuote({
    roomSlug: "glamping-tents",
    checkIn: "2026-09-10",
    checkOut: "2026-09-11",
    adults: 2,
    rateCard: card,
  });

  // 8,000 is above the 7,500 threshold, so the slab moves with the price.
  assert.equal(q.nightLines[0].effectiveValue, 8000);
  assert.equal(q.gstRate, 18);
  assert.equal(q.totalAmount, 9440);
});

test("a per-room peak rate overrides the global surcharge", () => {
  const card = rateCardFromRows({
    roomRates: [
      // 7,500 regular but a flat 12,000 at Christmas, not 7,500 x 1.2 = 9,000.
      { room_slug: "glamping-tents", label: "Glamping Tent", regular_rate: 7500, peak_rate: 12000, is_active: true },
    ],
  });

  assert.equal(nightlyRateFor(card, "glamping-tents", { peak: true }), 12000);
  assert.equal(nightlyRateFor(card, "glamping-tents", { peak: false }), 7500);

  const q = computeStayQuote({
    roomSlug: "glamping-tents",
    checkIn: "2026-12-25",
    checkOut: "2026-12-26",
    adults: 2,
    rateCard: card,
  });
  assert.equal(q.nightLines[0].seasonalBase, 12000);
  assert.equal(q.gstRate, 18);
});

test("GST slabs come from the database when set", () => {
  const card = rateCardFromRows({ gstRules: { threshold: 10000, rate_low: 5, rate_high: 18 } });
  assert.equal(gstRateForEffectiveValue(9000, card), 5);
  assert.equal(gstRateForEffectiveValue(10000, card), 5);
  assert.equal(gstRateForEffectiveValue(10001, card), 18);
});

test("extra-person charges come from the database when set", () => {
  const card = rateCardFromRows({
    occupancyRules: {
      extra_adult_rate: 2500, child_rate: 1200, infant_rate: 0, extra_bedding_rate: 900,
      infant_max_age: 4, child_max_age: 11, default_adults_included: 2, default_max_adults: 4,
    },
  });

  const q = computeStayQuote({
    baseNightlyRate: GLAMPING,
    roomSlug: "glamping-tents",
    checkIn: "2026-09-10",
    checkOut: "2026-09-11",
    adults: 3,
    children: 1,
    extraBeds: 1,
    rateCard: card,
  });

  // 2,500 extra adult + 1,200 child + 900 bedding.
  assert.equal(q.extraPersonPerNight, 4600);
  assert.equal(q.nightLines[0].effectiveValue, 12100);
  // The child line names the configured bracket, not a hardcoded one.
  assert.equal(q.extraGuestLines.find((l) => l.key === "child").label, "Child (4-11 yrs)");
});

test("seasons come from the database, peak and blackout alike", () => {
  const card = rateCardFromRows({
    seasons: [
      { kind: "peak", label: "Christmas & New Year", is_recurring: true, start_month: 12, start_day: 21, end_month: 1, end_day: 4, surcharge_rate: 1.2, is_active: true },
      { kind: "blackout", label: "Ganesh Chaturthi", is_recurring: false, start_date: "2026-09-14", end_date: "2026-09-17", is_active: true },
    ],
  });

  assert.equal(seasonForNight("2026-12-25", card).season, "peak");
  // Diwali is NOT in this card, so it is an ordinary night here.
  assert.equal(seasonForNight("2026-11-10", card).season, "regular");

  const q = computeStayQuote({
    baseNightlyRate: GLAMPING,
    roomSlug: "glamping-tents",
    checkIn: "2026-09-15",
    checkOut: "2026-09-17",
    adults: 2,
    rateCard: card,
  });
  // A blackout added by an admin behaves exactly like the shipped ones: no
  // surcharge, no discount.
  assert.equal(q.peakNights, 0);
  assert.equal(q.blackoutNights, 2);
  assert.equal(q.longStayDiscountTotal, 0);
  assert.equal(q.totalAmount, 15750);
});

test("the long-stay discount is configurable and can be switched off", () => {
  const changed = rateCardFromRows({
    longStayRules: { discount_rate: 0.1, min_nights: 3, applies_on_peak: false, is_active: true },
  });
  const q = computeStayQuote({
    baseNightlyRate: 10000,
    roomSlug: "mud-house-premium",
    checkIn: "2026-09-10",
    checkOut: "2026-09-12",
    adults: 2,
    rateCard: changed,
  });
  // Two nights no longer qualifies — the minimum is 3 now.
  assert.equal(q.longStayDiscountTotal, 0);

  const three = computeStayQuote({
    baseNightlyRate: 10000,
    roomSlug: "mud-house-premium",
    checkIn: "2026-09-10",
    checkOut: "2026-09-13",
    adults: 2,
    rateCard: changed,
  });
  assert.equal(three.longStayDiscountTotal, 3000); // 10% of 30,000

  const off = rateCardFromRows({
    longStayRules: { discount_rate: 0.2, min_nights: 2, applies_on_peak: false, is_active: false },
  });
  const none = computeStayQuote({
    baseNightlyRate: 10000,
    roomSlug: "mud-house-premium",
    checkIn: "2026-09-10",
    checkOut: "2026-09-13",
    adults: 2,
    rateCard: off,
  });
  assert.equal(none.longStayDiscountTotal, 0);
});

/* -- fallback: a missing row must never break a quote ---------------------- */

test("a room with no rate row keeps its shipped price", () => {
  const card = rateCardFromRows({
    roomRates: [
      { room_slug: "glamping-tents", label: "Glamping Tent", regular_rate: 8000, peak_rate: 9600, is_active: true },
    ],
  });
  // Only the tent was edited; the Safari Tent still has its config price.
  assert.equal(card.baseRates["safari-tent"], BASE_NIGHTLY_RATES["safari-tent"]);
  assert.equal(card.baseRates["glamping-tents"], 8000);
});

test("null tables fall back; empty arrays are an admin decision and are honoured", () => {
  // null = "not read" -> keep the config blackouts.
  const notRead = rateCardFromRows({ seasons: null });
  assert.equal(notRead.blackoutPeriods.length, DEFAULT_RATE_CARD.blackoutPeriods.length);

  // [] = "read, and there are none" -> the admin deleted them all.
  const emptied = rateCardFromRows({ seasons: [] });
  assert.equal(emptied.blackoutPeriods.length, 0);
  assert.equal(emptied.peakPeriods.length, 0);
  assert.equal(seasonForNight("2026-12-25", emptied).season, "regular");
});

test("an inactive rate row is ignored rather than zeroing the price", () => {
  const card = rateCardFromRows({
    roomRates: [
      { room_slug: "glamping-tents", label: "Glamping Tent", regular_rate: 99999, peak_rate: 99999, is_active: false },
    ],
  });
  assert.equal(card.baseRates["glamping-tents"], GLAMPING);
});

test("unparseable numbers fall back instead of producing NaN prices", () => {
  const card = rateCardFromRows({
    gstRules: { threshold: "not-a-number", rate_low: null, rate_high: undefined },
    roomRates: [{ room_slug: "glamping-tents", label: "G", regular_rate: "", peak_rate: "", is_active: true }],
  });
  assert.equal(card.gst.threshold, DEFAULT_RATE_CARD.gst.threshold);
  assert.equal(card.gst.rateLow, DEFAULT_RATE_CARD.gst.rateLow);
  assert.equal(card.baseRates["glamping-tents"], GLAMPING);
});

test("the default card cannot be mutated by a caller", () => {
  assert.throws(() => {
    "use strict";
    DEFAULT_RATE_CARD.gst.threshold = 1;
  });
});

/* -- the admin path reads the same card ------------------------------------ */

test("an admin booking is priced from the admin-edited card, not the defaults", () => {
  const card = rateCardFromRows({
    roomRates: [
      { room_slug: "safari-tent", label: "Safari Tent", regular_rate: 15000, peak_rate: 18000, is_active: true },
    ],
  });

  const q = computeAdminQuote({
    rateCard: card,
    baseNightlyRate: card.baseRates["safari-tent"],
    roomSlug: "safari-tent",
    checkIn: "2026-08-10",
    checkOut: "2026-08-11",
    adults: 2,
  });

  assert.equal(q.roomTotal, 15000);
  assert.equal(q.gstRatePct, 18);
  assert.equal(q.totalAmount, 17700);
});

test("omitting the card leaves the admin path on the shipped rates", () => {
  const q = computeAdminQuote({
    baseNightlyRate: BASE_NIGHTLY_RATES["safari-tent"],
    roomSlug: "safari-tent",
    checkIn: "2026-08-10",
    checkOut: "2026-08-11",
    adults: 2,
  });
  assert.equal(q.roomTotal, 12000);
});

test("a live offer reaches the admin path too", () => {
  const card = rateCardFromRows({});
  const q = computeAdminQuote({
    rateCard: card,
    offers: [
      { id: "o", name: "Staff rate", is_active: true, min_nights: 1, min_rooms: 1, reward_type: "percent_off_stay", reward_value: 25 },
    ],
    baseNightlyRate: BASE_NIGHTLY_RATES["safari-tent"],
    roomSlug: "safari-tent",
    checkIn: "2026-08-10",
    checkOut: "2026-08-11",
    adults: 2,
  });
  assert.equal(q.appliedOffer.name, "Staff rate");
  assert.equal(q.roomTotal, 9000);
});
