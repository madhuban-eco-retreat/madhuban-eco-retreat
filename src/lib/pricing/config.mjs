// @ts-check
/**
 * The whole commercial rate card, in one place.
 *
 * Every rate, percentage, threshold and date range the booking engine prices
 * with lives here and nowhere else. The rules change every year — peak dates
 * move with the festival calendar, tariffs move with the season — and the
 * point of this module is that changing them never means reading pricing
 * logic. `quote.mjs` holds the logic and imports every number from here.
 *
 * Plain data only: no imports, no `server-only`, nothing that would stop the
 * marketing pages, the admin panel or a test runner from reading it.
 */

/* ── GST ──────────────────────────────────────────────────────────────────── */

/**
 * The slab boundary, in rupees, on the EFFECTIVE per-night room value.
 *
 * Effective value — not the catalogue tariff. It is what the night is actually
 * being sold for: seasonal base, less the long-stay discount if the night
 * qualifies, plus that night's extra-person and bedding charges. A ₹7,500 tent
 * with one extra adult is a ₹9,500 night and is taxed as one.
 */
export const GST_THRESHOLD = 7500;

/** Slab at or below the threshold. ₹7,500 exactly stays here. */
export const GST_RATE_LOW = 5;

/** Slab above the threshold. */
export const GST_RATE_HIGH = 18;

/* ── Room tariffs ─────────────────────────────────────────────────────────── */

/**
 * Base nightly rate per room, double occupancy, pre-GST.
 *
 * Keyed by the slug the rooms table stores, which is also the /book/[slug]
 * route. These are the REGULAR-season rates; the peak figure is always this
 * times PEAK_SURCHARGE_RATE and is never stored separately, so the two can
 * never drift apart.
 */
export const BASE_NIGHTLY_RATES = {
  "mud-house-standard": 9000,
  "mud-house-premium": 10000,
  "glamping-tents": 7500,
  "safari-tent": 12000,
  "pool-side-villa": 12000,
};

/** Display names, in the order the public tariff table lists them. */
export const ROOM_CATEGORIES = [
  { slug: "mud-house-standard", label: "Mud House – Standard" },
  { slug: "mud-house-premium", label: "Mud House – Premium" },
  { slug: "glamping-tents", label: "Glamping Tent" },
  { slug: "safari-tent", label: "Safari Tent" },
  { slug: "pool-side-villa", label: "Poolside Villa" },
];

/* ── Seasons ──────────────────────────────────────────────────────────────── */

/** Multiplier applied to the base rate on a peak night: +20%. */
export const PEAK_SURCHARGE_RATE = 1.2;

/**
 * Peak periods, evaluated PER NIGHT.
 *
 * `start` and `end` are both INCLUSIVE stayed nights (see quote.mjs), so a
 * guest checking out on the morning after `end` paid the surcharge on `end`
 * itself. The Christmas block is what fixes the convention: the rate card puts
 * regular season at 05 Jan onward, so 04 Jan must still be a peak night.
 *
 * Configurable by design — these move every year with the festival calendar,
 * and replacing the list is the entire yearly maintenance task.
 */
export const PEAK_PERIODS = [
  { label: "Dussehra", start: "2026-10-17", end: "2026-10-20" },
  { label: "Diwali", start: "2026-11-06", end: "2026-11-14" },
  { label: "Christmas & New Year", start: "2026-12-21", end: "2027-01-04" },
  { label: "Holi", start: "2027-03-15", end: "2027-03-22" },
];

/**
 * The Christmas–New Year turn, which recurs on the same calendar dates every
 * year and so is matched month/day rather than by a dated range.
 *
 * PEAK_PERIODS carries the 2026-27 instance explicitly for its label; this
 * catches every other year, so a booking for 25 Dec 2028 is not quietly sold
 * at the regular rate because nobody refreshed the list.
 */
export const RECURRING_PEAK_MONTH_DAYS = {
  label: "Christmas & New Year",
  /** Inclusive from 21 Dec … */
  from: { month: 12, day: 21 },
  /** … through 04 Jan, wrapping the year boundary. */
  to: { month: 1, day: 4 },
};

/* ── Long-stay discount ───────────────────────────────────────────────────── */

/** Fraction taken off room rent on a qualifying night. */
export const LONG_STAY_DISCOUNT_RATE = 0.2;

/** Nights in the stay before the discount applies to any of them. */
export const LONG_STAY_MIN_NIGHTS = 2;

/**
 * Whether a peak night can carry the long-stay discount.
 *
 * False, and deliberately named rather than implied by the code: marking a
 * night up 20% and handing 20% straight back is not a rate the property sells.
 * The stay still QUALIFIES on total nights — a 3-night stay spanning Christmas
 * gets the discount on its regular nights and full peak rate on the rest.
 */
export const LONG_STAY_DISCOUNT_ON_PEAK_NIGHTS = false;

/* ── Extra person / bedding, per night, pre-GST ───────────────────────────── */

/** Under-5s stay free; counted for headcount only. */
export const INFANT_RATE = 0;

/** Ages 5–12. */
export const CHILD_RATE = 1500;

/** Over 12, or an extra bed for any age. */
export const EXTRA_ADULT_RATE = 2000;

/** Upper age of a free infant, inclusive. */
export const INFANT_MAX_AGE = 5;

/** Upper age of a charged child, inclusive. Above this is an extra adult. */
export const CHILD_MAX_AGE = 12;

/* ── Other charges (GST as applicable) ────────────────────────────────────── */

export const DAY_OUTING_RATE_PER_PERSON = 1500;
export const SAFARI_RATE = 5500;
export const SAFARI_WITH_NATURALIST_RATE = 6000;
export const GUIDED_HIKE_RATE_PER_PERSON = 2000;
export const GUIDED_HIKE_MIN_GUESTS = 4;
export const BUSH_DINING_RATE_PER_COUPLE = 3000;

/**
 * Whether an add-on or experience is taxed at the room's slab.
 *
 * True, which is the behaviour the booking engine already had — one rate
 * across the folio. The rate card says only "GST as applicable" for these, so
 * this is the existing assumption made explicit rather than a new rule: if the
 * property's accountant wants experiences at a flat 18% regardless of the
 * room, this is the single line that changes.
 */
export const ADDON_GST_FOLLOWS_ROOM_SLAB = true;

/** The same figures as display rows, for the public tariff table. */
export const OTHER_CHARGES = [
  {
    key: "day-outing",
    label: "Day Outing",
    amount: DAY_OUTING_RATE_PER_PERSON,
    unit: "per person",
  },
  { key: "safari", label: "Ratapani Safari", amount: SAFARI_RATE, unit: "per safari" },
  {
    key: "safari-naturalist",
    label: "Ratapani Safari with Naturalist",
    amount: SAFARI_WITH_NATURALIST_RATE,
    unit: "per safari",
  },
  {
    key: "guided-hike",
    label: "Guided Hiking / Saru Maru Trek",
    amount: GUIDED_HIKE_RATE_PER_PERSON,
    unit: `per person (min ${GUIDED_HIKE_MIN_GUESTS} guests)`,
  },
  {
    key: "bush-dining",
    label: "Bush Dining Experience",
    amount: BUSH_DINING_RATE_PER_COUPLE,
    unit: "per couple",
  },
];

/* ── Occupancy ────────────────────────────────────────────────────────────── */

/** Adults covered by the nightly tariff for a room with no override. */
export const DEFAULT_ADULTS_INCLUDED = 2;

/** Largest party a room with no override accepts. */
export const DEFAULT_MAX_ADULTS = 3;

/**
 * Per-room occupancy overrides, keyed by slug. The Pool Side Villa is let
 * whole at a family rate that already covers four.
 */
export const ROOM_OCCUPANCY_OVERRIDES = {
  "pool-side-villa": { adultsIncluded: 4, maxAdults: 6 },
};

export const MAX_CHILDREN = 2;
export const MAX_INFANTS = 2;
