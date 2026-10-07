// @ts-check
/**
 * The published tariff, built from the same config the booking engine prices with.
 *
 * Everything a guest can read about a price — the tariff table, the "from"
 * figure in a meta description, an FAQ answer, a schema.org Offer — is asked
 * for here rather than typed out. A number written into a sentence is a number
 * that goes stale the next time the tariff moves; a number computed from
 * config.mjs moves with it. quote.test.mjs asserts that these helpers and the
 * engine agree with each other and with the printed sheet.
 *
 * Pure and dependency-free: safe to import from a server component, a client
 * component, a test, or the admin panel.
 */

import {
  BASE_NIGHTLY_RATES,
  ROOM_CATEGORIES,
  MEAL_PLANS,
  MEAL_PLAN_CODES,
  DEFAULT_MEAL_PLAN,
  PEAK_SURCHARGE_RATE,
  LONG_STAY_DISCOUNT_RATE,
  LONG_STAY_MIN_NIGHTS,
  EXTRA_GUEST_RATES,
  GST_THRESHOLD,
  GST_RATE_LOW,
  GST_RATE_HIGH,
} from "./config.mjs";

const round2 = (n) => Math.round((n + Number.EPSILON) * 100) / 100;

/** ₹10,200 — Indian digit grouping, no decimals for whole rupees. */
export function formatInr(amount) {
  const n = Number(amount);
  return `₹${
    Number.isInteger(n)
      ? n.toLocaleString("en-IN")
      : n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }`;
}

function supplement(plan) {
  return MEAL_PLANS[plan].supplementPerNight;
}

function rent(slug) {
  const value = BASE_NIGHTLY_RATES[slug];
  if (value === undefined) throw new Error(`No tariff for room: ${slug}`);
  return value;
}

/** True when this room has a published tariff (camping, for one, does not). */
export function hasTariff(slug) {
  return Object.prototype.hasOwnProperty.call(BASE_NIGHTLY_RATES, slug);
}

/** Regular season, double occupancy, per night, before GST. */
export function regularRate(slug, plan = DEFAULT_MEAL_PLAN) {
  return round2(rent(slug) + supplement(plan));
}

/** Peak season / long weekends: the rent is marked up, the meals are not. */
export function peakRate(slug, plan = DEFAULT_MEAL_PLAN) {
  return round2(rent(slug) * PEAK_SURCHARGE_RATE + supplement(plan));
}

/** 2+ nights, regular season: the rent is discounted, the meals are not. */
export function longStayRate(slug, plan = DEFAULT_MEAL_PLAN) {
  return round2(rent(slug) * (1 - LONG_STAY_DISCOUNT_RATE) + supplement(plan));
}

/** Every room's tariff as table rows, in the order the sheet lists them. */
export function rateCardRows() {
  return ROOM_CATEGORIES.map(({ slug, label }) => {
    const row = { slug, label, rent: rent(slug), regular: {}, peak: {}, longStay: {} };
    for (const plan of MEAL_PLAN_CODES) {
      row.regular[plan] = regularRate(slug, plan);
      row.peak[plan] = peakRate(slug, plan);
      row.longStay[plan] = longStayRate(slug, plan);
    }
    return row;
  });
}

/** The lowest regular-season rate on the default plan — the "from" price. */
export function lowestRegularRate() {
  return Math.min(...ROOM_CATEGORIES.map(({ slug }) => regularRate(slug)));
}

/** The highest regular-season rate on the default plan. */
export function highestRegularRate() {
  return Math.max(...ROOM_CATEGORIES.map(({ slug }) => regularRate(slug)));
}

/** The cheapest room, as { slug, label, rate }. */
export function cheapestRoom() {
  const rows = ROOM_CATEGORIES.map(({ slug, label }) => ({ slug, label, rate: regularRate(slug) }));
  return rows.reduce((a, b) => (b.rate < a.rate ? b : a));
}

/** Rooms whose regular rate on the default plan equals the highest one. */
export function priciestRooms() {
  const top = highestRegularRate();
  return ROOM_CATEGORIES.filter(({ slug }) => regularRate(slug) === top);
}

/** Extra-guest rates for a plan, as { adult, child }. */
export function extraGuestRates(plan = DEFAULT_MEAL_PLAN) {
  return EXTRA_GUEST_RATES[plan];
}

/** "Breakfast, lunch/dinner" for MAP; "Breakfast, lunch and dinner" for AP. */
export function mealPlanIncludes(plan) {
  return MEAL_PLANS[plan].includes;
}

/** "MAP Plan" / "AP Plan". */
export function mealPlanLabel(plan) {
  return MEAL_PLANS[plan].label;
}

/** The GST slab a bare double-occupancy regular night falls in. */
export function slabFor(amount) {
  return amount > GST_THRESHOLD ? GST_RATE_HIGH : GST_RATE_LOW;
}

/**
 * One sentence pricing a room, for FAQ answers and structured data.
 *
 *   "Safari Tent starts at ₹13,200 per night on the MAP plan (breakfast,
 *   lunch/dinner) and ₹14,200 on the AP plan (breakfast, lunch and dinner), for
 *   two guests. Book 2 nights or more for ₹10,800 per night on MAP."
 *
 * `name` is what the sentence calls the room; it defaults to the tariff label.
 */
export function roomPriceSentence(slug, name) {
  const label = name ?? ROOM_CATEGORIES.find((r) => r.slug === slug)?.label ?? slug;
  const map = regularRate(slug, "MAP");
  const ap = regularRate(slug, "AP");
  const offer = longStayRate(slug, "MAP");
  return (
    `${label} starts at ${formatInr(map)} per night on the MAP plan ` +
    `(${MEAL_PLANS.MAP.includes.toLowerCase()}) and ${formatInr(ap)} on the AP plan ` +
    `(${MEAL_PLANS.AP.includes.toLowerCase()}), for two guests. ` +
    `Stay ${LONG_STAY_MIN_NIGHTS} nights or more and the MAP rate drops to ${formatInr(offer)} per night.`
  );
}

/** The sentence covering additional guests, for FAQ answers. */
export function extraGuestSentence() {
  const map = EXTRA_GUEST_RATES.MAP;
  const ap = EXTRA_GUEST_RATES.AP;
  return (
    `Additional guests are ${formatInr(map.adult)} per adult and ${formatInr(map.child)} per child ` +
    `(5–12 years) per night on the MAP plan, or ${formatInr(ap.adult)} and ${formatInr(ap.child)} on the AP plan. ` +
    `One child under 5 stays free.`
  );
}

/** The sentence covering GST, for FAQ answers and the terms page. */
export function gstSentence() {
  return (
    `Rates are exclusive of GST, which is charged separately. The GST rate is set by the tariff for the night ` +
    `before any discount: ${GST_RATE_LOW}% where it is ${formatInr(GST_THRESHOLD)} or less and ` +
    `${GST_RATE_HIGH}% where it is more.`
  );
}

/** "On peak-season and long-weekend dates the rates are ₹15,600 (MAP) and ₹16,600 (AP)." */
export function peakSentence(slug) {
  return (
    `On peak-season (21 December to 4 January) and notified long-weekend dates the rate is ` +
    `${formatInr(peakRate(slug, "MAP"))} on MAP and ${formatInr(peakRate(slug, "AP"))} on AP.`
  );
}

/** One line for a room page: the additional-guest tariff by plan. */
export function extraGuestSummary() {
  const map = EXTRA_GUEST_RATES.MAP;
  const ap = EXTRA_GUEST_RATES.AP;
  return (
    `One child under 5 free · MAP: adult ${formatInr(map.adult)}, child (5–12) ${formatInr(map.child)} per night · ` +
    `AP: adult ${formatInr(ap.adult)}, child (5–12) ${formatInr(ap.child)} per night (GST extra)`
  );
}

/** What the AP plan costs over MAP, per night (₹1,000 on the 2026-27 sheet). */
export function apPremium() {
  return MEAL_PLANS.AP.supplementPerNight - MEAL_PLANS.MAP.supplementPerNight;
}
