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
 * The Christmas–New Year turn: the property's only peak period.
 *
 * Matched by month and day rather than as a dated range, so it applies every
 * year without anyone refreshing a list — a booking for 25 Dec 2031 is peak
 * for the same reason 25 Dec 2026 is. The window wraps the year boundary, so
 * reading it is two tests, not one (see seasonForNight in quote.mjs).
 *
 * Both ends are INCLUSIVE stayed nights: a guest checking out on the morning
 * of 05 Jan paid the surcharge on the night of the 4th. The rate card is what
 * fixes that convention — it puts regular season at 05 Jan onward, so 04 Jan
 * has to still be peak.
 */
export const RECURRING_PEAK_MONTH_DAYS = {
  label: "Christmas & New Year",
  /** Inclusive from 21 Dec … */
  from: { month: 12, day: 21 },
  /** … through 04 Jan, wrapping the year boundary. */
  to: { month: 1, day: 4 },
};

/**
 * The calendar year the current tariff sheet's peak window opens in.
 *
 * Only ever used to print concrete dates on the public tariff page. Nothing
 * prices from it: classification is month/day, so a stale value here shows the
 * wrong year on a page and cannot mis-charge a booking.
 */
export const TARIFF_PEAK_DISPLAY_YEAR = 2026;

const pad = (n) => String(n).padStart(2, "0");

/**
 * Peak periods as concrete dated ranges, evaluated PER NIGHT.
 *
 * Long weekends are deliberately absent. Dussehra, Diwali and Holi were peak
 * on an earlier rate card and are not any more: the only nights that carry the
 * surcharge, and the only nights the long-stay discount is withheld from, are
 * the Christmas–New Year ones. Adding a festival back means adding it here.
 *
 * The one entry is derived from RECURRING_PEAK_MONTH_DAYS rather than written
 * out again, so the dates the tariff page publishes and the dates the engine
 * charges cannot disagree — editing the month/day above moves both.
 */
export const PEAK_PERIODS = [
  {
    label: RECURRING_PEAK_MONTH_DAYS.label,
    start: `${TARIFF_PEAK_DISPLAY_YEAR}-${pad(RECURRING_PEAK_MONTH_DAYS.from.month)}-${pad(
      RECURRING_PEAK_MONTH_DAYS.from.day,
    )}`,
    end: `${TARIFF_PEAK_DISPLAY_YEAR + 1}-${pad(RECURRING_PEAK_MONTH_DAYS.to.month)}-${pad(
      RECURRING_PEAK_MONTH_DAYS.to.day,
    )}`,
  },
];

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
export const SAFARI_RATE = 6500;
export const SAFARI_WITH_NATURALIST_RATE = 8000;
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
