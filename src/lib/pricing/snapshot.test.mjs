// @ts-check
/**
 * The rate snapshot.
 *
 * This exists for exactly one promise: a confirmed booking keeps the price it
 * was made at. Rates are now editable by staff from a web form, so that promise
 * is the difference between an admin screen and a liability.
 */

import test from "node:test";
import assert from "node:assert/strict";

import { computeStayQuote } from "./quote.mjs";
import { rateCardFromRows } from "./rate-card.mjs";
import {
  buildRateSnapshot,
  readRateSnapshot,
  effectivePerNightFromSnapshot,
  RATE_SNAPSHOT_VERSION,
} from "./snapshot.mjs";

const STAY = {
  roomSlug: "safari-tent",
  checkIn: "2026-08-10",
  checkOut: "2026-08-13",
  adults: 2,
};

/** Rate card as the migration seeds it. */
const seeded = rateCardFromRows({
  roomRates: [
    { room_slug: "safari-tent", label: "Safari Tent", regular_rate: 12000, peak_rate: 14400, is_active: true },
  ],
});

/** The same card after staff put the Safari Tent up to 18,000. */
const raised = rateCardFromRows({
  roomRates: [
    { room_slug: "safari-tent", label: "Safari Tent", regular_rate: 18000, peak_rate: 21600, is_active: true },
  ],
});

function snapshotFor(card) {
  const quote = computeStayQuote({ ...STAY, rateCard: card });
  return {
    quote,
    snapshot: buildRateSnapshot({ quote, roomSlug: "safari-tent", roomName: "Safari Tent" }),
  };
}

/* -- the promise ----------------------------------------------------------- */

test("a rate rise does not change what an existing booking was sold at", () => {
  // Booked in August at 12,000 a night.
  const { quote: booked, snapshot } = snapshotFor(seeded);
  assert.equal(booked.totalAmount, 33984);

  // Staff raise the tariff to 18,000. A NEW quote moves.
  const newQuote = computeStayQuote({ ...STAY, rateCard: raised });
  assert.notEqual(newQuote.totalAmount, booked.totalAmount);
  assert.equal(newQuote.seasonalBaseTotal, 54000);

  // The stored snapshot does not. This is the whole point.
  const stored = readRateSnapshot(snapshot);
  assert.equal(stored.totals.totalAmount, 33984);
  assert.equal(stored.totals.taxableAmount, 28800);
  assert.equal(stored.rules.baseNightlyRate, 12000);
  for (const n of stored.nights) assert.equal(n.baseRate, 12000);
});

test("the slab an invoice reprints is the one the guest was charged", () => {
  // Sold at 9,600 a night after the long-stay discount, which is 18%.
  const { snapshot } = snapshotFor(seeded);
  assert.equal(effectivePerNightFromSnapshot(snapshot), 9600);
  assert.equal(readRateSnapshot(snapshot).totals.gstRate, 18);

  // Even after the GST threshold itself is edited, the snapshot still states
  // what was actually collected.
  const movedThreshold = rateCardFromRows({
    gstRules: { threshold: 20000, rate_low: 5, rate_high: 18 },
    roomRates: [
      { room_slug: "safari-tent", label: "Safari Tent", regular_rate: 12000, peak_rate: 14400, is_active: true },
    ],
  });
  const reQuoted = computeStayQuote({ ...STAY, rateCard: movedThreshold });
  assert.equal(reQuoted.gstRate, 5); // today's rules
  assert.equal(readRateSnapshot(snapshot).totals.gstRate, 18); // what was charged
});

/* -- shape ----------------------------------------------------------------- */

test("a snapshot records every night, not just the total", () => {
  const { snapshot } = snapshotFor(seeded);
  assert.equal(snapshot.version, RATE_SNAPSHOT_VERSION);
  assert.equal(snapshot.nights.length, 3);
  for (const n of snapshot.nights) {
    assert.equal(n.seasonalBase, 12000);
    assert.equal(n.longStayDiscount, 2400);
    assert.equal(n.effectiveValue, 9600);
    assert.equal(n.gstRate, 18);
    assert.equal(n.gstAmount, 1728);
  }
  assert.equal(snapshot.room.slug, "safari-tent");
  assert.equal(snapshot.stay.nights, 3);
});

test("a snapshot records which offer was applied, if any", () => {
  const quote = computeStayQuote({
    ...STAY,
    rateCard: seeded,
    offers: [
      { id: "o1", name: "Monsoon 30", is_active: true, min_nights: 1, min_rooms: 1, reward_type: "percent_off_stay", reward_value: 30 },
    ],
  });
  const snap = buildRateSnapshot({ quote, roomSlug: "safari-tent", roomName: "Safari Tent" });

  assert.equal(snap.discounts.appliedOffer.name, "Monsoon 30");
  assert.equal(snap.discounts.offer, 10800);
  assert.equal(snap.discounts.longStay, 0);
  // Deleting the offer later cannot change what this booking was given.
  assert.equal(snap.totals.taxableAmount, 25200);
});

test("a snapshot records the rules in force, not a reference to them", () => {
  const { snapshot } = snapshotFor(seeded);
  assert.equal(snapshot.rules.gst.threshold, 7500);
  assert.equal(snapshot.rules.longStay.rate, 0.2);
  assert.equal(snapshot.rules.occupancy.extraAdultRate, 2000);
  assert.equal(snapshot.rules.peakSurchargeRate, 1.2);
});

/* -- older bookings -------------------------------------------------------- */

test("a booking with no snapshot reads as null rather than throwing", () => {
  assert.equal(readRateSnapshot(null), null);
  assert.equal(readRateSnapshot(undefined), null);
  assert.equal(readRateSnapshot({}), null);
  assert.equal(readRateSnapshot("garbage"), null);
  assert.equal(readRateSnapshot({ nights: "not an array" }), null);
  assert.equal(effectivePerNightFromSnapshot(null), null);
});
