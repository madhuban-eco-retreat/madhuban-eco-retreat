// @ts-check
/**
 * The rate card as a value, so the engine can be handed one instead of reading
 * module constants.
 *
 * config.mjs is now the DEFAULT rate card rather than the only one. The admin
 * screens write the same shape into the database; `rateCardFromRows` turns
 * those rows back into this object, and anything missing falls through to the
 * config value. That fallback is deliberate and load-bearing: a half-applied
 * migration, an empty table or a single deleted row leaves the site quoting at
 * the shipped rate rather than failing or quoting zero.
 *
 * Pure — no database, no clock, no imports beyond config. The DB reads live in
 * rate-card-db.js, which is server-only.
 */

import {
  GST_THRESHOLD,
  GST_RATE_LOW,
  GST_RATE_HIGH,
  BASE_NIGHTLY_RATES,
  ROOM_CATEGORIES,
  PEAK_SURCHARGE_RATE,
  PEAK_PERIODS,
  RECURRING_PEAK_MONTH_DAYS,
  DISCOUNT_BLACKOUT_PERIODS,
  LONG_STAY_DISCOUNT_RATE,
  LONG_STAY_MIN_NIGHTS,
  LONG_STAY_DISCOUNT_ON_PEAK_NIGHTS,
  INFANT_RATE,
  CHILD_RATE,
  EXTRA_ADULT_RATE,
  INFANT_MAX_AGE,
  CHILD_MAX_AGE,
  DEFAULT_ADULTS_INCLUDED,
  DEFAULT_MAX_ADULTS,
  ROOM_OCCUPANCY_OVERRIDES,
} from "./config.mjs";

/**
 * The shipped rate card: exactly what config.mjs holds.
 *
 * Frozen so a caller cannot mutate the default and silently change pricing for
 * everything else in the process.
 */
export const DEFAULT_RATE_CARD = Object.freeze({
  gst: Object.freeze({
    threshold: GST_THRESHOLD,
    rateLow: GST_RATE_LOW,
    rateHigh: GST_RATE_HIGH,
  }),
  baseRates: Object.freeze({ ...BASE_NIGHTLY_RATES }),
  /** Per-slug peak rate. Empty by default: the surcharge derives it instead. */
  peakRates: Object.freeze({}),
  categories: Object.freeze(ROOM_CATEGORIES.map((c) => Object.freeze({ ...c }))),
  peakSurchargeRate: PEAK_SURCHARGE_RATE,
  peakPeriods: Object.freeze(PEAK_PERIODS.map((p) => Object.freeze({ ...p }))),
  recurringPeak: Object.freeze({ ...RECURRING_PEAK_MONTH_DAYS }),
  blackoutPeriods: Object.freeze(DISCOUNT_BLACKOUT_PERIODS.map((p) => Object.freeze({ ...p }))),
  longStay: Object.freeze({
    rate: LONG_STAY_DISCOUNT_RATE,
    minNights: LONG_STAY_MIN_NIGHTS,
    appliesOnPeak: LONG_STAY_DISCOUNT_ON_PEAK_NIGHTS,
    active: true,
  }),
  occupancy: Object.freeze({
    infantRate: INFANT_RATE,
    childRate: CHILD_RATE,
    extraAdultRate: EXTRA_ADULT_RATE,
    extraBeddingRate: EXTRA_ADULT_RATE,
    infantMaxAge: INFANT_MAX_AGE,
    childMaxAge: CHILD_MAX_AGE,
    defaultAdultsIncluded: DEFAULT_ADULTS_INCLUDED,
    defaultMaxAdults: DEFAULT_MAX_ADULTS,
    overrides: Object.freeze({ ...ROOM_OCCUPANCY_OVERRIDES }),
  }),
  /** Campaign offers. None by default — the table ships empty. */
  offers: Object.freeze([]),
});

/** A finite number, or `fallback` when the value is absent or unparseable. */
function num(value, fallback) {
  if (value === null || value === undefined || value === "") return fallback;
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function pad(n) {
  return String(n).padStart(2, "0");
}

/**
 * One pricing_seasons row as the engine wants it.
 *
 * A recurring row carries month/day and no dates; the engine reads its
 * month/day fields. A dated row is the plain {label, start, end} shape the
 * config list already uses.
 */
function seasonFromRow(row) {
  if (row.is_recurring) {
    return {
      label: row.label,
      recurring: true,
      from: { month: num(row.start_month, 1), day: num(row.start_day, 1) },
      to: { month: num(row.end_month, 1), day: num(row.end_day, 1) },
      // Dates are surfaced too so a UI can print a concrete range for the
      // current cycle without re-deriving the wrap across the year boundary.
      start: `${pad(num(row.start_month, 1))}-${pad(num(row.start_day, 1))}`,
      end: `${pad(num(row.end_month, 1))}-${pad(num(row.end_day, 1))}`,
    };
  }
  return { label: row.label, recurring: false, start: row.start_date, end: row.end_date };
}

/**
 * Builds a rate card from database rows, falling back to the shipped defaults.
 *
 * Every argument is optional and every one of them may be null or empty. The
 * rule throughout is the same: a present row wins, an absent one leaves the
 * default in place. Note the difference between *absent* and *empty* for the
 * two season lists — `null` means "the table was not read" and keeps the config
 * periods, while `[]` means "read, and there are none", which is a legitimate
 * state an admin can create by deleting every row.
 */
export function rateCardFromRows({
  roomRates = null,
  gstRules = null,
  occupancyRules = null,
  seasons = null,
  longStayRules = null,
  offers = null,
} = {}) {
  const d = DEFAULT_RATE_CARD;

  // ── room rates ─────────────────────────────────────────────────────────────
  let baseRates = { ...d.baseRates };
  let peakRates = {};
  let categories = d.categories.map((c) => ({ ...c }));
  const activeRates = (roomRates ?? []).filter((r) => r.is_active !== false);
  if (activeRates.length > 0) {
    // Start from the defaults rather than replacing them: a room the admin has
    // no row for still needs a price, and the config value is the right one.
    for (const row of activeRates) {
      const slug = row.room_slug;
      if (!slug) continue;
      baseRates[slug] = num(row.regular_rate, baseRates[slug] ?? 0);
      if (row.peak_rate !== null && row.peak_rate !== undefined) {
        peakRates[slug] = num(row.peak_rate, undefined);
      }
    }
    categories = [...activeRates]
      .sort((a, b) => num(a.sort_order, 0) - num(b.sort_order, 0))
      .map((row) => ({
        slug: row.room_slug,
        label: row.label ?? d.categories.find((c) => c.slug === row.room_slug)?.label ?? row.room_slug,
      }));
  }

  // ── GST ────────────────────────────────────────────────────────────────────
  const gst = gstRules
    ? {
        threshold: num(gstRules.threshold, d.gst.threshold),
        rateLow: num(gstRules.rate_low, d.gst.rateLow),
        rateHigh: num(gstRules.rate_high, d.gst.rateHigh),
      }
    : { ...d.gst };

  // ── occupancy ──────────────────────────────────────────────────────────────
  const occ = occupancyRules
    ? {
        infantRate: num(occupancyRules.infant_rate, d.occupancy.infantRate),
        childRate: num(occupancyRules.child_rate, d.occupancy.childRate),
        extraAdultRate: num(occupancyRules.extra_adult_rate, d.occupancy.extraAdultRate),
        extraBeddingRate: num(
          occupancyRules.extra_bedding_rate,
          num(occupancyRules.extra_adult_rate, d.occupancy.extraBeddingRate),
        ),
        infantMaxAge: num(occupancyRules.infant_max_age, d.occupancy.infantMaxAge),
        childMaxAge: num(occupancyRules.child_max_age, d.occupancy.childMaxAge),
        defaultAdultsIncluded: num(
          occupancyRules.default_adults_included,
          d.occupancy.defaultAdultsIncluded,
        ),
        defaultMaxAdults: num(occupancyRules.default_max_adults, d.occupancy.defaultMaxAdults),
        overrides: { ...d.occupancy.overrides },
      }
    : { ...d.occupancy, overrides: { ...d.occupancy.overrides } };

  // ── seasons ────────────────────────────────────────────────────────────────
  let peakPeriods = d.peakPeriods.map((p) => ({ ...p }));
  let recurringPeak = { ...d.recurringPeak };
  let blackoutPeriods = d.blackoutPeriods.map((p) => ({ ...p }));
  let peakSurchargeRate = d.peakSurchargeRate;

  if (seasons !== null) {
    const active = (seasons ?? []).filter((s) => s.is_active !== false);
    const peakRows = active.filter((s) => s.kind === "peak");
    const blackoutRows = active.filter((s) => s.kind === "blackout");

    const recurringRow = peakRows.find((s) => s.is_recurring);
    if (recurringRow) {
      recurringPeak = {
        label: recurringRow.label,
        from: { month: num(recurringRow.start_month, 12), day: num(recurringRow.start_day, 21) },
        to: { month: num(recurringRow.end_month, 1), day: num(recurringRow.end_day, 4) },
      };
    } else {
      // No recurring row at all means the admin deleted it; honour that rather
      // than silently reinstating Christmas from config.
      recurringPeak = null;
    }

    const surcharged = peakRows.find(
      (s) => s.surcharge_rate !== null && s.surcharge_rate !== undefined,
    );
    if (surcharged) peakSurchargeRate = num(surcharged.surcharge_rate, d.peakSurchargeRate);

    peakPeriods = peakRows.filter((s) => !s.is_recurring).map(seasonFromRow);
    blackoutPeriods = blackoutRows.map(seasonFromRow);
  }

  // ── long stay ──────────────────────────────────────────────────────────────
  const longStay = longStayRules
    ? {
        rate: num(longStayRules.discount_rate, d.longStay.rate),
        minNights: num(longStayRules.min_nights, d.longStay.minNights),
        appliesOnPeak: longStayRules.applies_on_peak ?? d.longStay.appliesOnPeak,
        active: longStayRules.is_active ?? true,
      }
    : { ...d.longStay };

  return {
    gst,
    baseRates,
    peakRates,
    categories,
    peakSurchargeRate,
    peakPeriods,
    recurringPeak,
    blackoutPeriods,
    longStay,
    occupancy: occ,
    offers: offers ?? [],
  };
}

/**
 * The nightly rate for one room, at the season given.
 *
 * A per-room peak rate wins when the admin has set one, because the point of
 * storing it is to let a single category break the global +20%. Otherwise the
 * surcharge derives it, which is what keeps an un-edited card behaving exactly
 * as config.mjs always did.
 */
export function nightlyRateFor(card, roomSlug, { peak = false } = {}) {
  const base = card.baseRates[roomSlug];
  if (base === undefined) return undefined;
  if (!peak) return base;
  const override = card.peakRates?.[roomSlug];
  return override !== undefined && override !== null ? override : base * card.peakSurchargeRate;
}
