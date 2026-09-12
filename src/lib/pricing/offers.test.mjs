// @ts-check
/**
 * The offers engine.
 *
 * The three rules that carry the most risk, and so get the most tests:
 * one offer per booking, offers never touch peak or blackout nights, and the
 * long-stay discount competes rather than stacks.
 */

import test from "node:test";
import assert from "node:assert/strict";

import { computeStayQuote } from "./quote.mjs";
import { offerApplies, offerDiscountPerNight, bestReduction } from "./offers.mjs";
import { BASE_NIGHTLY_RATES } from "./config.mjs";

const SAFARI = BASE_NIGHTLY_RATES["safari-tent"]; // 12,000
const GLAMPING = BASE_NIGHTLY_RATES["glamping-tents"]; // 7,500

/** A 3-night regular-season Safari Tent stay: the workhorse sample. */
const STAY = {
  baseNightlyRate: SAFARI,
  roomSlug: "safari-tent",
  checkIn: "2026-08-10",
  checkOut: "2026-08-13",
  adults: 2,
};

const offer = (over) => ({
  id: "o",
  name: "Test offer",
  is_active: true,
  min_nights: 1,
  min_rooms: 1,
  ...over,
});

/* -- reward types ---------------------------------------------------------- */

test("percent off the stay comes off room rent, night by night", () => {
  const q = computeStayQuote({
    ...STAY,
    offers: [offer({ reward_type: "percent_off_stay", reward_value: 30 })],
  });

  // 30% of 36,000 beats the 20% long-stay discount, so it wins outright.
  assert.equal(q.offerDiscountTotal, 10800);
  assert.equal(q.longStayDiscountTotal, 0);
  for (const n of q.nightLines) assert.equal(n.offerDiscount, 3600);
  assert.equal(q.taxableAmount, 25200);
  assert.equal(q.appliedOffer.name, "Test offer");
});

test("flat rupees off is spread across nights by what each is worth", () => {
  const q = computeStayQuote({
    ...STAY,
    offers: [offer({ reward_type: "flat_off", reward_value: 9000 })],
  });

  assert.equal(q.offerDiscountTotal, 9000);
  // Three equal nights, so an equal split — and the parts add back exactly.
  assert.deepEqual(q.nightLines.map((n) => n.offerDiscount), [3000, 3000, 3000]);
});

test("a flat offer cannot exceed the room rent it applies to", () => {
  const q = computeStayQuote({
    baseNightlyRate: GLAMPING,
    roomSlug: "glamping-tents",
    checkIn: "2026-08-10",
    checkOut: "2026-08-11",
    adults: 2,
    offers: [offer({ reward_type: "flat_off", reward_value: 999999 })],
  });

  assert.equal(q.offerDiscountTotal, 7500);
  assert.equal(q.taxableAmount, 0);
  assert.equal(q.totalAmount, 0);
});

test("free night every N gives the cheapest qualifying night away", () => {
  // 2 nights paid, 1 free, on a 3-night stay.
  const q = computeStayQuote({
    ...STAY,
    offers: [offer({ reward_type: "free_night_per_n", reward_value: 2 })],
  });

  assert.equal(q.offerDiscountTotal, 12000);
  assert.equal(q.nightLines.filter((n) => n.offerDiscount > 0).length, 1);
});

test("free night every N does nothing on a stay too short to earn one", () => {
  const q = computeStayQuote({
    baseNightlyRate: SAFARI,
    roomSlug: "safari-tent",
    checkIn: "2026-08-10",
    checkOut: "2026-08-12",
    adults: 2,
    offers: [offer({ reward_type: "free_night_per_n", reward_value: 3 })],
  });

  assert.equal(q.offerDiscountTotal, 0);
  // The long-stay discount is still there — the offer losing does not remove it.
  assert.equal(q.longStayDiscountTotal, 4800);
});

test("tiered per-night percentages apply by position in the stay", () => {
  const q = computeStayQuote({
    ...STAY,
    offers: [
      offer({
        reward_type: "tiered_per_night",
        reward_tiers: [{ night: 2, percent: 20 }, { night: 3, percent: 50 }],
      }),
    ],
  });

  // Night 1 full, night 2 at 20% off, night 3 at 50% off.
  assert.deepEqual(q.nightLines.map((n) => n.offerDiscount), [0, 2400, 6000]);
  assert.equal(q.offerDiscountTotal, 8400);
});

/* -- exactly one winner ---------------------------------------------------- */

test("only one offer applies — the one that saves the guest the most", () => {
  const q = computeStayQuote({
    ...STAY,
    offers: [
      offer({ id: "small", name: "Small", reward_type: "percent_off_stay", reward_value: 10 }),
      offer({ id: "big", name: "Big", reward_type: "percent_off_stay", reward_value: 35 }),
      offer({ id: "mid", name: "Mid", reward_type: "flat_off", reward_value: 5000 }),
    ],
  });

  assert.equal(q.appliedOffer.id, "big");
  assert.equal(q.offerDiscountTotal, 12600); // 35% of 36,000
  // Not 10% + 35% + 5,000. One, and only one.
  assert.equal(q.totalDiscount, 12600);
});

test("the long-stay discount competes with offers and can win", () => {
  const q = computeStayQuote({
    ...STAY,
    offers: [offer({ reward_type: "percent_off_stay", reward_value: 5 })],
  });

  // 20% long-stay (7,200) beats a 5% offer (1,800).
  assert.equal(q.appliedOffer, null);
  assert.equal(q.offerDiscountTotal, 0);
  assert.equal(q.longStayDiscountTotal, 7200);
});

test("a winning offer replaces the long-stay discount rather than stacking", () => {
  const q = computeStayQuote({
    ...STAY,
    offers: [offer({ reward_type: "percent_off_stay", reward_value: 25 })],
  });

  assert.equal(q.longStayDiscountTotal, 0);
  assert.equal(q.offerDiscountTotal, 9000);
  assert.equal(q.totalDiscount, 9000);
  for (const n of q.nightLines) assert.equal(n.longStayDiscount, 0);
});

test("a tie goes to the long-stay discount the guest was already promised", () => {
  // 20% of 36,000 = 7,200, matched exactly by a 7,200 flat offer.
  const q = computeStayQuote({
    ...STAY,
    offers: [offer({ reward_type: "flat_off", reward_value: 7200 })],
  });

  assert.equal(q.appliedOffer, null);
  assert.equal(q.longStayDiscountTotal, 7200);
});

/* -- never on peak or blackout nights -------------------------------------- */

test("an offer is skipped entirely on an all-peak stay", () => {
  const q = computeStayQuote({
    baseNightlyRate: SAFARI,
    roomSlug: "safari-tent",
    checkIn: "2026-12-24",
    checkOut: "2026-12-27",
    adults: 2,
    offers: [offer({ reward_type: "percent_off_stay", reward_value: 50 })],
  });

  assert.equal(q.peakNights, 3);
  assert.equal(q.offerDiscountTotal, 0);
  assert.equal(q.appliedOffer, null);
  // Full peak rate, untouched.
  assert.equal(q.taxableAmount, 14400 * 3);
});

test("an offer is skipped on blackout nights and applies to the rest", () => {
  // 20 Oct is the last Dussehra night; 21 and 22 Oct are ordinary.
  const q = computeStayQuote({
    baseNightlyRate: SAFARI,
    roomSlug: "safari-tent",
    checkIn: "2026-10-20",
    checkOut: "2026-10-23",
    adults: 2,
    offers: [offer({ reward_type: "percent_off_stay", reward_value: 50 })],
  });

  assert.equal(q.blackoutNights, 1);
  const [oct20, oct21, oct22] = q.nightLines;
  assert.equal(oct20.offerDiscount, 0);
  assert.equal(oct21.offerDiscount, 6000);
  assert.equal(oct22.offerDiscount, 6000);
  assert.equal(q.offerDiscountTotal, 12000);
});

test("an offer discount moves the GST slab like any other reduction", () => {
  const q = computeStayQuote({
    ...STAY,
    offers: [offer({ reward_type: "percent_off_stay", reward_value: 40 })],
  });

  // 12,000 less 40% = 7,200 a night, which is at or below the threshold.
  for (const n of q.nightLines) {
    assert.equal(n.effectiveValue, 7200);
    assert.equal(n.gstRate, 5);
  }
  assert.equal(q.totalGst, 1080);
});

/* -- conditions ------------------------------------------------------------ */

test("minimum nights and rooms gate an offer", () => {
  assert.equal(
    offerApplies(offer({ min_nights: 4 }), { nights: 3, roomSlug: "safari-tent" }).ok,
    false,
  );
  assert.equal(
    offerApplies(offer({ min_rooms: 3 }), { nights: 3, rooms: 2, roomSlug: "safari-tent" }).ok,
    false,
  );
  assert.equal(
    offerApplies(offer({ min_rooms: 3 }), { nights: 3, rooms: 3, roomSlug: "safari-tent" }).ok,
    true,
  );
});

test("an offer restricted to other room types does not apply", () => {
  const q = computeStayQuote({
    ...STAY,
    offers: [
      offer({ room_slugs: ["glamping-tents"], reward_type: "percent_off_stay", reward_value: 50 }),
    ],
  });
  assert.equal(q.appliedOffer, null);
  assert.equal(q.longStayDiscountTotal, 7200);
});

test("book-by closes the window for a late booking", () => {
  const early = offer({ book_by: "2026-06-30", reward_type: "percent_off_stay", reward_value: 50 });

  const inTime = computeStayQuote({ ...STAY, offers: [early], bookedOn: "2026-06-01" });
  assert.equal(inTime.offerDiscountTotal, 18000);

  const tooLate = computeStayQuote({ ...STAY, offers: [early], bookedOn: "2026-07-01" });
  assert.equal(tooLate.appliedOffer, null);
});

test("the stay window restricts which nights an offer reaches", () => {
  const windowed = offer({
    stay_from: "2026-08-12",
    stay_to: "2026-08-31",
    reward_type: "percent_off_stay",
    reward_value: 50,
  });

  // Only the third night (12 Aug) is inside the campaign window, so that is the
  // only night the reward touches.
  const nightLines = [
    { date: "2026-08-10", seasonalBase: 12000, offerEligible: true },
    { date: "2026-08-11", seasonalBase: 12000, offerEligible: true },
    { date: "2026-08-12", seasonalBase: 12000, offerEligible: true },
  ];
  assert.deepEqual(offerDiscountPerNight(windowed, nightLines), [0, 0, 6000]);
});

test("a window-clipped offer can lose to the long-stay discount it shrank below", () => {
  // The same 50% offer, but the window leaves it only one night: 6,000 against
  // the long-stay discount's 7,200 across all three. The house discount wins,
  // and the guest is not left worse off by the campaign existing.
  const q = computeStayQuote({
    ...STAY,
    offers: [
      offer({
        stay_from: "2026-08-12",
        stay_to: "2026-08-31",
        reward_type: "percent_off_stay",
        reward_value: 50,
      }),
    ],
  });

  assert.equal(q.appliedOffer, null);
  assert.equal(q.offerDiscountTotal, 0);
  assert.equal(q.longStayDiscountTotal, 7200);
  // 3 x 12,000 less 20% = 9,600 a night; 28,800 + 18% GST = 33,984.
  assert.equal(q.taxableAmount, 28800);
  assert.equal(q.totalAmount, 33984);
});

test("an inactive offer never competes", () => {
  const q = computeStayQuote({
    ...STAY,
    offers: [offer({ is_active: false, reward_type: "percent_off_stay", reward_value: 90 })],
  });
  assert.equal(q.appliedOffer, null);
  assert.equal(q.longStayDiscountTotal, 7200);
});

test("candidates report why they were passed over, for the admin preview", () => {
  const q = computeStayQuote({
    ...STAY,
    offers: [offer({ id: "x", name: "Too short", min_nights: 9, reward_type: "flat_off", reward_value: 1000 })],
  });
  const candidate = q.offerCandidates.find((c) => c.id === "x");
  assert.match(candidate.skipped, /at least 9 nights/);
  assert.equal(candidate.won, false);
});

/* -- the reduction chooser in isolation ------------------------------------ */

test("bestReduction returns the long-stay candidate when no offer beats it", () => {
  const nightLines = [
    { date: "2026-08-10", seasonalBase: 10000, offerEligible: true },
    { date: "2026-08-11", seasonalBase: 10000, offerEligible: true },
  ];
  const { winner } = bestReduction({
    nightLines,
    offers: [offer({ reward_type: "flat_off", reward_value: 500 })],
    longStayPerNight: [2000, 2000],
    nights: 2,
    roomSlug: "safari-tent",
  });
  assert.equal(winner.kind, "long_stay");
  assert.equal(winner.total, 4000);
});

test("a reward never reduces a night below its own rent", () => {
  const nightLines = [{ date: "2026-08-10", seasonalBase: 5000, offerEligible: true }];
  const perNight = offerDiscountPerNight(
    offer({ reward_type: "percent_off_stay", reward_value: 150 }),
    nightLines,
  );
  assert.equal(perNight[0], 5000);
});
