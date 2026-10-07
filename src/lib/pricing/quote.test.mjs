// @ts-check
/**
 * The rate card, asserted end to end.
 *
 * The first block transcribes the printed 2026-27 tariff sheet by hand — every
 * figure a guest can be quoted — and asserts that the engine, the rate-card
 * helpers and the sheet all agree. It is deliberately NOT built from config.mjs:
 * if it were, editing the config would edit the expectation and nothing could
 * fail. A wrong rate, a wrong season date or a wrong meal supplement breaks a
 * test here before it reaches a guest.
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
  longStayDiscountReason,
  discountEligibilityForNight,
  resolveMealPlan,
  mealSupplementPerNight,
  extraGuestRatesFor,
  extraPersonChargesPerNight,
} from "./quote.mjs";
import { computeAdminQuote } from "./admin-quote.mjs";
import {
  BASE_NIGHTLY_RATES,
  PEAK_PERIODS,
  LONG_WEEKEND_PERIODS,
  DISCOUNT_BLACKOUT_PERIODS,
  GST_THRESHOLD,
  GST_RATE_LOW,
  GST_RATE_HIGH,
  PEAK_SURCHARGE_RATE,
  LONG_STAY_DISCOUNT_RATE,
  LONG_STAY_MIN_NIGHTS,
  MEAL_PLANS,
  DEFAULT_MEAL_PLAN,
  EXTRA_GUEST_RATES,
  LEGACY_EXTRA_GUEST_RATES,
  ROOM_OCCUPANCY_OVERRIDES,
  MAX_INFANTS,
  MAX_CHILDREN,
  TARIFF_VALID_FROM,
  TARIFF_VALID_TO,
  DAY_OUTING_RATE_PER_PERSON,
  SAFARI_RATE,
  SAFARI_WITH_NATURALIST_RATE,
  GUIDED_HIKE_RATE_PER_PERSON,
  GUIDED_HIKE_MIN_GUESTS,
  BUSH_DINING_RATE_PER_COUPLE,
  OTHER_CHARGES,
} from "./config.mjs";
import {
  regularRate,
  peakRate,
  longStayRate,
  rateCardRows,
  lowestRegularRate,
  highestRegularRate,
  cheapestRoom,
  priciestRooms,
  hasTariff,
  formatInr,
  roomPriceSentence,
  extraGuestSentence,
  gstSentence,
} from "./rate-card.mjs";

/** The morning after a given night: the check-out date of a one-night stay. */
const nextDay = (date) =>
  new Date(Date.parse(`${date}T00:00:00Z`) + 86400000).toISOString().slice(0, 10);
const prevDay = (date) =>
  new Date(Date.parse(`${date}T00:00:00Z`) - 86400000).toISOString().slice(0, 10);

const REGULAR = "2026-09-10";
const CHRISTMAS = "2026-12-25";
const DIWALI = "2026-11-08";

/** A stay of `nights` starting on `checkIn`, for `slug`, on `plan`. */
function stay(slug, plan, checkIn, nights = 1, extra = {}) {
  const out = new Date(Date.parse(`${checkIn}T00:00:00Z`) + nights * 86400000)
    .toISOString()
    .slice(0, 10);
  return computeStayQuote({
    baseNightlyRate: BASE_NIGHTLY_RATES[slug],
    roomSlug: slug,
    checkIn,
    checkOut: out,
    adults: 2,
    mealPlan: plan,
    ...extra,
  });
}

/* ══ The printed tariff sheet, 2026-27 ═════════════════════════════════════════
   Per night, for two guests, before GST. [MAP, AP] in each cell. Transcribed
   from "Standard Tariff & Stay Packages 2026-27". */

const SHEET = {
  "mud-house-standard": { regular: [10200, 11200], peak: [12000, 13000], twoNight: [8400, 9400] },
  "mud-house-premium": { regular: [11200, 12200], peak: [13200, 14200], twoNight: [9200, 10200] },
  "glamping-tents": { regular: [8700, 9700], peak: [10200, 11200], twoNight: [7200, 8200] },
  "safari-tent": { regular: [13200, 14200], peak: [15600, 16600], twoNight: [10800, 11800] },
  "pool-side-villa": { regular: [13200, 14200], peak: [15600, 16600], twoNight: [10800, 11800] },
};

const PLANS = ["MAP", "AP"];

for (const [slug, row] of Object.entries(SHEET)) {
  PLANS.forEach((plan, i) => {
    test(`sheet: ${slug} on ${plan} — regular, peak (Christmas + long weekend), 2+ nights`, () => {
      // Regular season, one night.
      assert.equal(stay(slug, plan, REGULAR).nightLines[0].effectiveValue, row.regular[i]);
      // Peak: Christmas and a long weekend are the same column.
      assert.equal(stay(slug, plan, CHRISTMAS).nightLines[0].effectiveValue, row.peak[i]);
      assert.equal(stay(slug, plan, DIWALI).nightLines[0].effectiveValue, row.peak[i]);
      // 2+ nights, regular season: both nights at the offer rate.
      const two = stay(slug, plan, REGULAR, 2);
      for (const night of two.nightLines) assert.equal(night.effectiveValue, row.twoNight[i]);

      // The helpers behind the tariff page say the same thing as the engine.
      assert.equal(regularRate(slug, plan), row.regular[i]);
      assert.equal(peakRate(slug, plan), row.peak[i]);
      assert.equal(longStayRate(slug, plan), row.twoNight[i]);
    });
  });
}

test("sheet: the rate-card rows carry every figure on the printed sheet", () => {
  const rows = Object.fromEntries(rateCardRows().map((r) => [r.slug, r]));
  for (const [slug, printed] of Object.entries(SHEET)) {
    PLANS.forEach((plan, i) => {
      assert.equal(rows[slug].regular[plan], printed.regular[i], `${slug} ${plan} regular`);
      assert.equal(rows[slug].peak[plan], printed.peak[i], `${slug} ${plan} peak`);
      assert.equal(rows[slug].longStay[plan], printed.twoNight[i], `${slug} ${plan} 2+ nights`);
    });
  }
  assert.equal(rateCardRows().length, 5);
});

test("sheet: additional-guest tariff and meal supplements", () => {
  assert.deepEqual(EXTRA_GUEST_RATES.MAP, { adult: 2600, child: 1800 });
  assert.deepEqual(EXTRA_GUEST_RATES.AP, { adult: 3200, child: 2100 });
  assert.equal(MEAL_PLANS.MAP.supplementPerNight, 1200);
  assert.equal(MEAL_PLANS.AP.supplementPerNight, 2200);
});

test("sheet: the tariff is valid 01 Jul 2026 to 30 Jun 2027", () => {
  assert.equal(TARIFF_VALID_FROM, "2026-07-01");
  assert.equal(TARIFF_VALID_TO, "2027-06-30");
});

/* ══ Meal plan ═════════════════════════════════════════════════════════════════ */

test("meals are a flat supplement: not marked up in peak, not cut by the 2+ night offer", () => {
  for (const slug of Object.keys(SHEET)) {
    for (const plan of PLANS) {
      const supp = MEAL_PLANS[plan].supplementPerNight;
      const rent = BASE_NIGHTLY_RATES[slug];
      // Peak is rent x 1.2 plus the SAME supplement.
      assert.equal(peakRate(slug, plan), rent * PEAK_SURCHARGE_RATE + supp, `${slug} ${plan}`);
      // The offer takes 20% of the rent only.
      assert.equal(longStayRate(slug, plan), rent * (1 - LONG_STAY_DISCOUNT_RATE) + supp, `${slug} ${plan}`);
    }
    // So the AP premium over MAP is ₹1,000 in every season.
    assert.equal(regularRate(slug, "AP") - regularRate(slug, "MAP"), 1000);
    assert.equal(peakRate(slug, "AP") - peakRate(slug, "MAP"), 1000);
    assert.equal(longStayRate(slug, "AP") - longStayRate(slug, "MAP"), 1000);
  }
});

test("the meal plan is reported on the quote and defaults to AP", () => {
  const q = stay("safari-tent", undefined, REGULAR);
  assert.equal(q.mealPlan, "AP");
  assert.equal(q.mealPlanLabel, "AP Plan");
  assert.equal(q.mealSupplementPerNight, 2200);
  assert.equal(q.mealSupplementTotal, 2200);
  assert.equal(DEFAULT_MEAL_PLAN, "AP");

  const map = stay("safari-tent", "MAP", REGULAR, 3);
  assert.equal(map.mealSupplementPerNight, 1200);
  assert.equal(map.mealSupplementTotal, 3600);
  assert.equal(map.nightLines[0].mealSupplement, 1200);
});

test("an unknown meal plan is refused rather than priced at nothing", () => {
  assert.throws(() => stay("safari-tent", "CP", REGULAR), /Unknown meal plan/);
  assert.throws(() => resolveMealPlan("EP"), /Unknown meal plan/);
});

test("a booking from before the meal-plan tariff prices under the legacy regime", () => {
  // null — not undefined — is the legacy marker: no supplement, bedding-only rates.
  assert.equal(resolveMealPlan(null), null);
  assert.equal(mealSupplementPerNight(null), 0);
  assert.deepEqual(extraGuestRatesFor(null), LEGACY_EXTRA_GUEST_RATES);

  const q = stay("glamping-tents", null, REGULAR);
  assert.equal(q.nightLines[0].effectiveValue, 7500);
  assert.equal(q.gstRate, 5);
  assert.equal(q.totalAmount, 7875);
  assert.equal(q.mealPlan, null);

  const withAdult = stay("glamping-tents", null, REGULAR, 1, { adults: 3 });
  assert.equal(withAdult.nightLines[0].effectiveValue, 9500);
  assert.equal(withAdult.gstRate, 18);
});

/* ══ Seasons ═══════════════════════════════════════════════════════════════════ */

test("Christmas is peak on both endpoints and regular either side of them", () => {
  assert.equal(seasonForNight("2026-12-20").season, "regular");
  assert.equal(seasonForNight("2026-12-21").season, "peak");
  assert.equal(seasonForNight("2027-01-04").season, "peak");
  assert.equal(seasonForNight("2027-01-05").season, "regular");
});

test("the Christmas window recurs every year, with no dated list to refresh", () => {
  assert.equal(seasonForNight("2031-12-25").season, "peak");
  assert.equal(seasonForNight("2032-01-02").season, "peak");
  assert.equal(seasonForNight("2031-12-20").season, "regular");
  assert.equal(seasonForNight("2032-01-05").season, "regular");
});

test("the notified long weekends are peak, on their exact dates", () => {
  const expected = [
    ["Dussehra", "2026-10-17", "2026-10-20"],
    ["Diwali", "2026-11-06", "2026-11-14"],
    ["Holi", "2027-03-19", "2027-03-22"],
  ];
  assert.deepEqual(
    LONG_WEEKEND_PERIODS.map((p) => [p.label, p.start, p.end]),
    expected,
  );
  for (const [label, start, end] of expected) {
    assert.equal(seasonForNight(start).season, "peak", `${label} first night`);
    assert.equal(seasonForNight(start).label, label);
    assert.equal(seasonForNight(end).season, "peak", `${label} last night`);
    assert.equal(seasonForNight(prevDay(start)).season, "regular", `${label} eve`);
    assert.equal(seasonForNight(nextDay(end)).season, "regular", `${label} morning after`);
  }
});

test("lunar festivals do NOT recur by month/day the way Christmas does", () => {
  // Diwali 2027 is on a different Gregorian date; the 2026 range must not leak.
  assert.equal(seasonForNight("2027-11-08").season, "regular");
  assert.equal(seasonForNight("2027-10-18").season, "regular");
});

test("peak and long-weekend dates are the only peak dates; the old middle tier is gone", () => {
  assert.equal(PEAK_PERIODS.length, 1 + LONG_WEEKEND_PERIODS.length);
  assert.deepEqual(DISCOUNT_BLACKOUT_PERIODS, []);
  const q = stay("mud-house-standard", "MAP", DIWALI);
  assert.equal(q.nightLines[0].season, "peak");
  assert.equal(q.nightLines[0].discountBlackout, false);
  assert.equal(q.blackoutNights, 0);
});

test("a long-weekend night is marked up +20% on the rent exactly like Christmas", () => {
  const diwali = stay("glamping-tents", "MAP", DIWALI).nightLines[0];
  const xmas = stay("glamping-tents", "MAP", CHRISTMAS).nightLines[0];
  assert.equal(diwali.seasonalBase, 9000);
  assert.equal(diwali.seasonalBase, xmas.seasonalBase);
  assert.equal(diwali.effectiveValue, xmas.effectiveValue);
  assert.equal(diwali.gstRate, 18);
});

/* ══ The 2+ night offer ════════════════════════════════════════════════════════ */

test("one night never earns the offer", () => {
  const q = stay("mud-house-standard", "MAP", REGULAR);
  assert.equal(q.longStayDiscountApplied, false);
  assert.equal(q.nightLines[0].effectiveValue, 10200);
});

test("the offer is not available on Christmas or a long weekend, however long the stay", () => {
  for (const start of ["2026-12-26", "2026-11-06", "2026-10-17", "2027-03-19"]) {
    const q = stay("safari-tent", "MAP", start, 2);
    assert.equal(q.longStayDiscountApplied, false, start);
    assert.equal(q.longStayDiscountTotal, 0, start);
  }
});

test("a stay running into a long weekend discounts only its regular nights", () => {
  // 05 Nov is regular; 06 Nov is the first night of Diwali. Glamping MAP.
  const q = stay("glamping-tents", "MAP", "2026-11-05", 2);
  const [eve, first] = q.nightLines;
  assert.equal(eve.season, "regular");
  assert.equal(eve.longStayDiscount, 1500);
  assert.equal(eve.effectiveValue, 7200); // 7,500 x 0.8 + 1,200 meals
  assert.equal(first.season, "peak");
  assert.equal(first.longStayDiscount, 0);
  assert.equal(first.effectiveValue, 10200); // 7,500 x 1.2 + 1,200 meals
  assert.equal(q.discountEligibleNights, 1);
});

test("a stay straddling 04/05 Jan prices each night on its own season", () => {
  const q = stay("glamping-tents", "MAP", "2027-01-04", 2);
  assert.equal(q.peakNights, 1);
  assert.equal(q.regularNights, 1);

  const [jan4, jan5] = q.nightLines;
  assert.equal(jan4.season, "peak");
  assert.equal(jan4.effectiveValue, 10200);
  assert.equal(jan4.gstRate, 18);

  assert.equal(jan5.season, "regular");
  assert.equal(jan5.longStayDiscount, 1500);
  assert.equal(jan5.effectiveValue, 7200);
  // Charged 7,200, but the tariff it was discounted from is 8,700: 18%, not 5%.
  assert.equal(jan5.slabValue, 8700);
  assert.equal(jan5.gstRate, 18);

  assert.equal(q.mixedGstRates, false);
  assert.equal(q.taxableAmount, 17400);
  assert.equal(q.totalGst, 3132); // 17,400 x 18%
  assert.equal(q.totalAmount, 20532);

  // The superseded reading (slab on what was charged) still works as an option.
  const old = stay("glamping-tents", "MAP", "2027-01-04", 2, { slabOnPreDiscountValue: false });
  assert.equal(old.mixedGstRates, true);
  assert.equal(old.totalGst, 1836 + 360);
});

test("the offer comes off the rent only — never the meals, never the extras", () => {
  const q = stay("mud-house-standard", "MAP", REGULAR, 2, { adults: 3 });
  const night = q.nightLines[0];
  assert.equal(night.longStayDiscount, 1800); // 20% of the 9,000 rent
  assert.equal(night.roomValue, 7200);
  assert.equal(night.mealSupplement, 1200);
  // 7,200 rent + 1,200 meals + 2,600 extra adult (MAP), taxed together.
  assert.equal(night.effectiveValue, 11000);
  assert.equal(night.gstRate, 18);
});

/* ══ Extra guests ══════════════════════════════════════════════════════════════ */

test("extra guests are charged at the rate of the plan the room is booked on", () => {
  const map = stay("mud-house-standard", "MAP", REGULAR, 1, { adults: 3, children: 1 });
  assert.equal(map.extraPersonPerNight, 2600 + 1800);
  assert.deepEqual(
    map.extraGuestLines.map((l) => [l.key, l.qty, l.ratePerNight]),
    [
      ["extra_adult", 1, 2600],
      ["child", 1, 1800],
    ],
  );
  assert.equal(map.nightLines[0].effectiveValue, 10200 + 4400);

  const ap = stay("mud-house-standard", "AP", REGULAR, 1, { adults: 3, children: 1 });
  assert.equal(ap.extraPersonPerNight, 3200 + 2100);
  assert.equal(ap.nightLines[0].effectiveValue, 11200 + 5300);
});

test("an extra bed is charged at the adult rate of the plan", () => {
  const q = stay("glamping-tents", "AP", REGULAR, 1, { extraBeds: 1 });
  assert.equal(q.extraPersonPerNight, 3200);
});

test("infants are free and never move the slab", () => {
  const q = stay("glamping-tents", "MAP", REGULAR, 1, { infants: 1 });
  assert.equal(q.extraPersonPerNight, 0);
  assert.equal(q.nightLines[0].effectiveValue, 8700);
  assert.equal(MAX_INFANTS, 1); // "One child below 5 years is complimentary"
  assert.equal(MAX_CHILDREN, 2);
});

test("the Pool Side Villa is quoted for two guests like every other room", () => {
  assert.equal(ROOM_OCCUPANCY_OVERRIDES["pool-side-villa"].adultsIncluded, 2);
  assert.equal(ROOM_OCCUPANCY_OVERRIDES["pool-side-villa"].maxAdults, 6);

  const two = stay("pool-side-villa", "MAP", REGULAR, 1, { adults: 2 });
  assert.equal(two.extraPersonPerNight, 0);
  assert.equal(two.nightLines[0].effectiveValue, 13200);

  // The third and fourth adult are now charged, at the additional-adult tariff.
  const four = stay("pool-side-villa", "MAP", REGULAR, 1, { adults: 4 });
  assert.equal(four.extraPersonPerNight, 2 * 2600);
  assert.equal(four.nightLines[0].effectiveValue, 13200 + 5200);
});

/* ══ GST ═══════════════════════════════════════════════════════════════════════ */

test("the configured GST slabs are 5% / 18% either side of 7,500", () => {
  assert.equal(GST_THRESHOLD, 7500);
  assert.equal(GST_RATE_LOW, 5);
  assert.equal(GST_RATE_HIGH, 18);
});

test("the threshold is inclusive at the lower slab", () => {
  assert.equal(gstRateForEffectiveValue(GST_THRESHOLD - 0.01), GST_RATE_LOW);
  assert.equal(gstRateForEffectiveValue(GST_THRESHOLD), GST_RATE_LOW);
  assert.equal(gstRateForEffectiveValue(GST_THRESHOLD + 0.01), GST_RATE_HIGH);
});

test("every published regular rate is above the threshold, so is taxed at 18%", () => {
  for (const [slug, row] of Object.entries(SHEET)) {
    PLANS.forEach((plan, i) => {
      const q = stay(slug, plan, REGULAR);
      assert.ok(row.regular[i] > GST_THRESHOLD, `${slug} ${plan}`);
      assert.equal(q.gstRate, 18, `${slug} ${plan}`);
      assert.equal(q.totalGst, Math.round(row.regular[i] * 18) / 100, `${slug} ${plan}`);
    });
  }
});

test("worked example: Mud House Standard, MAP, 1 night", () => {
  const q = stay("mud-house-standard", "MAP", REGULAR);
  assert.equal(q.taxableAmount, 10200);
  assert.equal(q.gstRate, 18);
  assert.equal(q.totalGst, 1836);
  assert.equal(q.totalAmount, 12036);
});

test("the Glamping Tent moves from the 5% slab to 18% because the meal-inclusive rate crosses 7,500", () => {
  // Before the meal-plan tariff a Glamping Tent was a ₹7,500 night at 5%.
  assert.equal(stay("glamping-tents", null, REGULAR).gstRate, 5);
  // On the 2026-27 sheet it is ₹8,700 on MAP: over the line.
  const q = stay("glamping-tents", "MAP", REGULAR);
  assert.equal(q.nightLines[0].effectiveValue, 8700);
  assert.equal(q.gstRate, 18);
  assert.equal(q.totalGst, 1566);
  assert.equal(q.totalAmount, 10266);
});

test("GST basis: a discounted night is taxed at the slab of the tariff it was discounted from", () => {
  // Glamping MAP: 7,500 rent + 1,200 meals = an 8,700 tariff. A 2-night stay is
  // charged 7,200 a night, but the slab is read from 8,700, so it is 18%.
  const q = stay("glamping-tents", "MAP", REGULAR, 2);
  assert.equal(q.taxableAmount, 14400); // GST is still charged on what the guest pays
  assert.equal(q.nightLines[0].effectiveValue, 7200);
  assert.equal(q.nightLines[0].slabValue, 8700);
  assert.equal(q.gstRate, 18);
  assert.equal(q.totalGst, 2592);
  assert.equal(q.totalAmount, 16992);
});

test("GST basis: the invoice that under-collected GST (Glamping, MAP, 24-26 Oct 2026)", () => {
  // MADH/INV/2026-27/0010 was issued at 5%: GST 720, total 15,120.
  const q = stay("glamping-tents", "MAP", "2026-10-24", 2);
  assert.equal(q.taxableAmount, 14400); // unchanged: the guest's room and meals cost the same
  assert.equal(q.totalGst, 2592); // 18% of 14,400, not the 720 (5%) that was invoiced
  assert.equal(q.totalAmount, 16992);
  assert.equal(16992 - 15120, 1872); // the GST that invoice under-collected
});

test("GST basis: the superseded reading is still available as an option", () => {
  // With the switch off the slab follows what was charged after the discount.
  const q = stay("glamping-tents", "MAP", REGULAR, 2, { slabOnPreDiscountValue: false });
  assert.equal(q.nightLines[0].slabValue, 7200);
  assert.equal(q.gstRate, 5);
  assert.equal(q.totalGst, 720);
  assert.equal(q.totalAmount, 15120);
});

test("GST basis: a coupon never moves a night to a lower slab either", () => {
  const q = stay("glamping-tents", "MAP", REGULAR, 1, { couponDiscount: 3000 });
  assert.equal(q.nightLines[0].effectiveValue, 5700);
  assert.equal(q.nightLines[0].slabValue, 8700);
  assert.equal(q.gstRate, 18);
});

test("GST basis: a long weekend or peak night is unaffected (already above the line)", () => {
  const q = stay("glamping-tents", "MAP", CHRISTMAS);
  assert.equal(q.nightLines[0].slabValue, q.nightLines[0].effectiveValue);
  assert.equal(q.gstRate, 18);
});

test("a child pushes a discounted night over the threshold", () => {
  // A 2-night glamping night is 7,200; a child at 1,800 makes it 9,000.
  const q = stay("glamping-tents", "MAP", REGULAR, 2, { children: 1 });
  assert.equal(q.nightLines[0].effectiveValue, 7200 + 1800);
  assert.equal(q.gstRate, 18);
});

/* ══ Staff rate rules and coupons ══════════════════════════════════════════════ */

test("a staff multiplier can raise a peak night but never undercut +20%", () => {
  const raised = stay("glamping-tents", "MAP", CHRISTMAS, 1, { peakMultiplierOverride: 1.4 });
  assert.equal(raised.nightLines[0].seasonalBase, 10500);
  assert.equal(raised.nightLines[0].effectiveValue, 10500 + 1200);

  const undercut = stay("glamping-tents", "MAP", CHRISTMAS, 1, { peakMultiplierOverride: 1 });
  assert.equal(undercut.nightLines[0].seasonalBase, 9000);
  assert.equal(undercut.nightLines[0].effectiveValue, 9000 + 1200);
});

test("a coupon comes off the rent, is spread across nights and lowers the value the slab reads", () => {
  const q = stay("safari-tent", "MAP", REGULAR, 2, { couponDiscount: 4000 });
  // 12,000 rent less 20% = 9,600/night; the coupon takes 2,000 more off the rent.
  assert.equal(q.couponDiscountTotal, 4000);
  for (const n of q.nightLines) {
    assert.equal(n.roomValue, 7600);
    assert.equal(n.mealSupplement, 1200);
    assert.equal(n.effectiveValue, 8800);
    assert.equal(n.gstRate, 18);
  }
  assert.equal(q.taxableAmount, 17600);
});

test("a coupon cannot drive the room rent below zero, and cannot touch the meals", () => {
  const q = stay("glamping-tents", "MAP", REGULAR, 1, { couponDiscount: 999999 });
  assert.equal(q.nightLines[0].roomValue, 0);
  // The meal supplement is not room rent, so it is still charged.
  assert.equal(q.taxableAmount, 1200);
  // The slab is read from the 8,700 tariff the coupon was taken off, not from 1,200.
  assert.equal(q.gstRate, 18);
  assert.equal(q.totalGst, 216);
  assert.equal(q.totalAmount, 1416);
});

/* ══ Invoice-side reconstruction ═══════════════════════════════════════════════ */

test("a past stay's long-stay discount is reconstructed from its room-rent total", () => {
  const d = longStayDiscountForStay({
    baseNightlyTotal: 27000, // 3 x 9,000 rent, all regular
    nights: 3,
    checkIn: REGULAR,
    checkOut: "2026-09-13",
  });
  assert.equal(d.applied, true);
  assert.equal(d.amount, 5400);
});

test("reconstruction gives nothing back on an all-peak stay", () => {
  const d = longStayDiscountForStay({
    baseNightlyTotal: 21600, // 2 x 10,800, all Christmas
    nights: 2,
    checkIn: "2027-01-01",
    checkOut: "2027-01-03",
  });
  assert.equal(d.applied, false);
  assert.equal(d.amount, 0);
  assert.match(d.reason, /Christmas & New Year/);
});

test("reconstruction names the long weekend that cost a stay its discount", () => {
  const d = longStayDiscountForStay({
    baseNightlyTotal: 21600,
    nights: 2,
    checkIn: "2026-11-07",
    checkOut: "2026-11-09",
  });
  assert.equal(d.applied, false);
  assert.match(d.reason, /Diwali/);

  const q = stay("mud-house-standard", "MAP", "2026-11-07", 2);
  assert.match(longStayDiscountReason(q), /Diwali/);
});

test("reconstruction weights a mixed stay by what each night was sold at", () => {
  // 04 Jan at 9,000 (peak) + 05 Jan at 7,500 (regular) = 16,500 rent.
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

test("reconstruction agrees with the engine for a stay running into a long weekend", () => {
  const q = stay("glamping-tents", "MAP", "2026-11-05", 2);
  const d = longStayDiscountForStay({
    baseNightlyTotal: q.seasonalBaseTotal, // rent only: 7,500 + 9,000
    nights: 2,
    checkIn: "2026-11-05",
    checkOut: "2026-11-07",
  });
  assert.equal(d.amount, q.longStayDiscountTotal);
});

test("a staff rate rule suppresses the reconstructed discount", () => {
  const d = longStayDiscountForStay({
    baseNightlyTotal: 27000,
    nights: 3,
    checkIn: REGULAR,
    checkOut: "2026-09-13",
    multiplier: 1.3,
  });
  assert.equal(d.applied, false);
  assert.equal(d.amount, 0);
});

test("discount eligibility is answered per night", () => {
  assert.equal(discountEligibilityForNight(REGULAR).eligible, true);
  assert.deepEqual(discountEligibilityForNight(DIWALI), { eligible: false, reason: "peak", label: "Diwali" });
  assert.equal(discountEligibilityForNight(CHRISTMAS).reason, "peak");
  assert.equal(LONG_STAY_MIN_NIGHTS, 2);
  assert.equal(LONG_STAY_DISCOUNT_RATE, 0.2);
});

/* ══ Admin quote ═══════════════════════════════════════════════════════════════ */

test("admin add-ons are taxed beside the room, not folded into its slab", () => {
  const q = computeAdminQuote({
    baseNightlyRate: BASE_NIGHTLY_RATES["glamping-tents"],
    roomSlug: "glamping-tents",
    checkIn: REGULAR,
    checkOut: "2026-09-11",
    adults: 2,
    mealPlan: "MAP",
    addons: [{ label: "Bush Dining", price: 3000, qty: 1, unit: "per couple" }],
  });
  // The room is the ₹8,700 MAP night, on the 18% slab; dinner does not move it.
  assert.equal(q.roomTotal, 8700);
  assert.equal(q.gstRatePct, 18);
  assert.equal(q.addonsTotal, 3000);
  assert.equal(q.subtotalBeforeGst, 11700);
  assert.equal(q.gstAmount, 2106);
  assert.equal(q.totalAmount, 13806);
  assert.equal(q.mealPlan, "MAP");
});

test("admin pricing takes a meal plan and defaults to AP", () => {
  const args = {
    baseNightlyRate: BASE_NIGHTLY_RATES["safari-tent"],
    roomSlug: "safari-tent",
    checkIn: REGULAR,
    checkOut: "2026-09-11",
    adults: 2,
  };
  assert.equal(computeAdminQuote(args).roomTotal, 14200);
  assert.equal(computeAdminQuote({ ...args, mealPlan: "MAP" }).roomTotal, 13200);
});

test("admin pricing carries the peak surcharge on the rent and the meals on top", () => {
  const q = computeAdminQuote({
    baseNightlyRate: BASE_NIGHTLY_RATES["safari-tent"],
    roomSlug: "safari-tent",
    checkIn: CHRISTMAS,
    checkOut: "2026-12-26",
    adults: 2,
    mealPlan: "MAP",
  });
  assert.equal(q.roomTotal, 15600);
  assert.equal(q.gstRatePct, 18);
  assert.equal(q.totalAmount, 18408);
});

test("a per-night add-on multiplies by nights; a one-off does not", () => {
  const q = computeAdminQuote({
    baseNightlyRate: BASE_NIGHTLY_RATES["glamping-tents"],
    roomSlug: "glamping-tents",
    checkIn: REGULAR,
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

/* ══ Other charges ═════════════════════════════════════════════════════════════ */

test("the other-charge rate card is what the sheet lists", () => {
  assert.equal(DAY_OUTING_RATE_PER_PERSON, 1500);
  assert.equal(SAFARI_RATE, 6500);
  assert.equal(SAFARI_WITH_NATURALIST_RATE, 8000);
  assert.equal(GUIDED_HIKE_RATE_PER_PERSON, 2000);
  assert.equal(GUIDED_HIKE_MIN_GUESTS, 4);
  assert.equal(BUSH_DINING_RATE_PER_COUPLE, 3000);

  const byKey = Object.fromEntries(OTHER_CHARGES.map((c) => [c.key, c]));
  assert.equal(byKey.safari.amount, SAFARI_RATE);
  assert.equal(byKey["safari-naturalist"].amount, SAFARI_WITH_NATURALIST_RATE);
  assert.equal(byKey["guided-hike"].amount, GUIDED_HIKE_RATE_PER_PERSON);
  assert.equal(byKey["bush-dining"].amount, BUSH_DINING_RATE_PER_COUPLE);
  assert.equal(byKey["day-outing"].amount, DAY_OUTING_RATE_PER_PERSON);
});

/* ══ Rate-card helpers (the source of every price a guest reads) ═══════════════ */

test("the 'from' price is the cheapest regular rate on the default (AP) plan", () => {
  assert.equal(lowestRegularRate(), 9700);
  assert.equal(highestRegularRate(), 14200);
  assert.equal(cheapestRoom().slug, "glamping-tents");
  assert.deepEqual(priciestRooms().map((r) => r.slug).sort(), ["pool-side-villa", "safari-tent"]);
  // The MAP figures from the printed sheet are still reachable explicitly.
  assert.equal(regularRate("glamping-tents", "MAP"), 8700);
});

test("rooms without a published tariff are recognised (camping is not on the sheet)", () => {
  assert.equal(hasTariff("safari-tent"), true);
  assert.equal(hasTariff("camping-tent"), false);
});

test("rate-card sentences quote the figures from the sheet", () => {
  const safari = roomPriceSentence("safari-tent", "The Safari Tent");
  assert.match(safari, /₹13,200 per night on the MAP plan/);
  assert.match(safari, /₹14,200 on the AP plan/);
  assert.match(safari, /₹10,800 per night/);

  const guests = extraGuestSentence();
  assert.match(guests, /₹2,600 per adult and ₹1,800 per child/);
  assert.match(guests, /₹3,200 and ₹2,100 on the AP plan/);

  assert.match(gstSentence(), /5%/);
  assert.match(gstSentence(), /18%/);
  assert.match(gstSentence(), /₹7,500/);
  assert.equal(formatInr(10200), "₹10,200");
  assert.equal(formatInr(187.5), "₹187.50");
});

test("plan helpers are exposed for display code", () => {
  assert.equal(extraGuestRatesFor("MAP").adult, 2600);
  assert.equal(extraGuestRatesFor("AP").child, 2100);
  assert.equal(mealSupplementPerNight("MAP"), 1200);
});

/* ══ Invoice reconstruction round-trip ═════════════════════════════════════════
   An invoice is rebuilt from the booking row: base_amount (net of discount, and
   including meals and extra guests) and discount_amount. The invoice route
   recovers gross room rent as  base + discount - meals - extras  and then splits
   the long-stay discount back out. These tests run that algebra against what
   the checkout engine stored, so an invoice cannot drift from the charge. */

function reconstructRent(q, { plan, slug, adults, children, nights }) {
  const stored = { base: q.subtotalBeforeGst ?? q.taxableAmount, discount: q.totalDiscount };
  const extras = extraPersonChargesPerNight({ adults, children, roomSlug: slug, mealPlan: plan });
  const meals = mealSupplementPerNight(plan) * nights;
  return Math.round((stored.base + stored.discount - extras.total * nights - meals) * 100) / 100;
}

for (const plan of ["MAP", "AP", null]) {
  for (const [label, checkIn, nights, extra] of [
    ["regular 1 night", "2026-09-10", 1, {}],
    ["regular 3 nights + extras", "2026-09-10", 3, { adults: 3, children: 2 }],
    ["Christmas 2 nights", "2026-12-25", 2, {}],
    ["into Diwali", "2026-11-05", 3, {}],
    ["with a coupon", "2026-09-10", 2, { couponDiscount: 1500 }],
  ]) {
    test(`reconstruction round-trip: ${plan ?? "legacy"}, ${label}`, () => {
      const slug = "safari-tent";
      const q = stay(slug, plan, checkIn, nights, extra);
      const rent = reconstructRent(q, {
        plan,
        slug,
        adults: extra.adults ?? 2,
        children: extra.children ?? 0,
        nights,
      });
      // Gross room rent recovered from the stored figures is exactly what the
      // engine charged as rent before any discount.
      assert.equal(rent, q.seasonalBaseTotal);
      // And the long-stay share the invoice separates back out matches the engine's.
      const d = longStayDiscountForStay({
        baseNightlyTotal: rent,
        nights,
        checkIn,
        checkOut: new Date(Date.parse(`${checkIn}T00:00:00Z`) + nights * 86400000).toISOString().slice(0, 10),
      });
      assert.equal(d.amount, q.longStayDiscountTotal);
    });
  }
}
