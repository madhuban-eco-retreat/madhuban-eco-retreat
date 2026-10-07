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
 * being sold for: seasonal room rent, less the long-stay discount if the night
 * qualifies, plus the meal-plan supplement the rate includes, plus that
 * night's extra-person and bedding charges. Since the 2026-27 tariff every
 * published rate is a meal-inclusive package (MAP or AP), so the meals are part
 * of the value the slab is read from: a Glamping Tent is a ₹8,700 night on MAP,
 * not a ₹7,500 one, and is taxed as such.
 */
export const GST_THRESHOLD = 7500;

/** Slab at or below the threshold. ₹7,500 exactly stays here. */
export const GST_RATE_LOW = 5;

/** Slab above the threshold. */
export const GST_RATE_HIGH = 18;

/**
 * Which value the slab is read from when a night has been discounted.
 *
 * true (the property's rule, and the setting in force): the slab follows the
 * tariff for the night BEFORE any discount — the room rate plus the meal plan
 * plus any extra guests, with the long-stay offer and any coupon added back. A
 * discount never moves a night to a lower slab, so a Glamping Tent on MAP is an
 * ₹8,700 night and is taxed at 18% whether it is sold at ₹8,700 or, on a
 * 2-night stay, at ₹7,200. GST is still charged on what the guest actually
 * pays; only the slab is read from the undiscounted tariff.
 *
 * false (the engine's original behaviour, kept as an option): the slab follows
 * what the guest is charged AFTER the discount, which put a 2-night Glamping
 * stay on MAP at ₹7,200 a night and 5% — an invoice that under-collected
 * ₹1,872 of GST on a ₹14,400 stay.
 *
 * It stays a single switch so the tax basis can be changed on the accountant's
 * advice without touching the price list.
 */
export const GST_SLAB_ON_PRE_DISCOUNT_VALUE = true;

/* ── Room tariffs ─────────────────────────────────────────────────────────── */

/**
 * Room rent per night, double occupancy, pre-GST, EXCLUDING meals.
 *
 * Keyed by the slug the rooms table stores (rooms.base_price_per_night), which
 * is also the /book/[slug] route. These are the REGULAR-season figures. The
 * published tariff is built from them — regular = rent + meal supplement, peak
 * = rent x PEAK_SURCHARGE_RATE + meal supplement, 2+ nights = rent x 0.8 + meal
 * supplement — and none of those is stored separately, so the sheet can never
 * drift from what the engine charges. The 2026-27 tariff sheet reconciles to
 * these numbers exactly (Mud House Standard: 9,000 + 1,200 MAP = 10,200).
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

/* ── Meal plans ───────────────────────────────────────────────────────────── */

/**
 * Every published rate is a meal-inclusive package for two guests.
 *
 * The supplement is what the plan adds to the room rent per night for the two
 * guests the rate covers. It is a flat amount: it is not marked up in peak
 * season and it is not part of the room rent the long-stay discount comes off —
 * "20% off on room rent" means the rent, not the food. Worked from the sheet:
 * Mud House Standard MAP 10,200 = 9,000 + 1,200; AP 11,200 = 9,000 + 2,200.
 */
export const MEAL_PLANS = {
  MAP: {
    code: "MAP",
    label: "MAP Plan",
    includes: "Breakfast, lunch/dinner",
    supplementPerNight: 1200,
  },
  AP: {
    code: "AP",
    label: "AP Plan",
    includes: "Breakfast, lunch and dinner",
    supplementPerNight: 2200,
  },
};

/** Plan codes in the order the tariff lists them. */
export const MEAL_PLAN_CODES = ["MAP", "AP"];

/** The plan a booking is priced on when the guest does not choose one. */
export const DEFAULT_MEAL_PLAN = "AP";

/* ── Season dates the tariff sheet is valid for ───────────────────────────── */

export const TARIFF_LABEL = "2026-27";
export const TARIFF_VALID_FROM = "2026-07-01";
export const TARIFF_VALID_TO = "2027-06-30";

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
 * Notified long weekends, as concrete dated ranges.
 *
 * !! THESE MUST BE UPDATED EVERY YEAR. !!
 *
 * Unlike Christmas, these are lunar-calendar festivals: Dussehra, Diwali and
 * Holi land on different Gregorian dates each year, so they CANNOT be matched
 * by month/day the way the 21 Dec - 04 Jan window is. They are written out as
 * explicit dated ranges and simply stop applying once their year passes — which
 * fails safe for the guest (they are charged the regular rate) but quietly
 * costs the property money, so refresh this when the next year's tariff sheet
 * names the new dates.
 *
 * `start` and `end` are both INCLUSIVE stayed nights. The 2026-27 sheet lists:
 * Dussehra 17-20 October 2026, Diwali 06-14 November 2026, Holi 19-22 March
 * 2027 (Holi/Rangwali falls on Monday 22 March, so the Friday-to-Monday weekend
 * around it).
 */
export const LONG_WEEKEND_PERIODS = [
  { label: "Dussehra", start: "2026-10-17", end: "2026-10-20" },
  { label: "Diwali", start: "2026-11-06", end: "2026-11-14" },
  { label: "Holi", start: "2027-03-19", end: "2027-03-22" },
];

/**
 * Peak periods as concrete dated ranges, evaluated PER NIGHT.
 *
 * The 2026-27 tariff sheet has one peak column, "Peak Season / Long Weekends
 * (+20%)", covering Christmas / New Year AND the notified long weekends. Both
 * are marked up by PEAK_SURCHARGE_RATE on the room rent and both withhold the
 * 2+ night offer. (An earlier rate card treated the festivals as a middle tier
 * — regular rate, no discount — and this list held Christmas alone; the current
 * sheet retires that tier.)
 *
 * The Christmas entry is derived from RECURRING_PEAK_MONTH_DAYS rather than
 * written out again, so the dates the tariff page publishes and the dates the
 * engine charges cannot disagree.
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
  ...LONG_WEEKEND_PERIODS,
];

/**
 * Dates that are sold at the REGULAR rate but still withhold the long-stay
 * discount.
 *
 * Empty on the 2026-27 sheet: every date that loses the 2+ night offer is now
 * also a peak date, so peak alone explains it. The mechanism is kept — the
 * engine and the invoice reconstruction both consult it — so a future sheet
 * that reintroduces a "regular price, no discount" tier is a list entry here
 * and not an engine change.
 */
export const DISCOUNT_BLACKOUT_PERIODS = [];

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
 *
 * This governs peak nights only. DISCOUNT_BLACKOUT_PERIODS withholds the
 * discount for its own, separate reason — those nights are not marked up, so
 * turning this flag on would still leave them un-discounted.
 */
export const LONG_STAY_DISCOUNT_ON_PEAK_NIGHTS = false;

/* ── Extra person / bedding, per night, pre-GST ───────────────────────────── */

/**
 * Additional-guest tariff, per person per night, by meal plan.
 *
 * The sheet prices an extra guest with the meals they eat, so the rate follows
 * the plan the room is booked on: an extra adult is ₹2,600 on MAP and ₹3,200 on
 * AP; a child (5-12) is ₹1,800 on MAP and ₹2,100 on AP. An extra bed for any age
 * is charged at the adult rate of the plan.
 */
export const EXTRA_GUEST_RATES = {
  MAP: { adult: 2600, child: 1800 },
  AP: { adult: 3200, child: 2100 },
};

/**
 * The extra-guest rates in force before the 2026-27 sheet: bedding only, no
 * meals, whatever the plan.
 *
 * Not used to price anything new. Bookings taken before the meal-plan tariff
 * carry no plan, and an invoice raised for one of them rebuilds its extra-guest
 * lines from the headcount — at the rate the guest was actually charged, not at
 * today's. See extraGuestRatesFor.
 */
export const LEGACY_EXTRA_GUEST_RATES = { adult: 2000, child: 1500 };

/** Under-5s stay free; counted for headcount only. */
export const INFANT_RATE = 0;

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
 * Per-room occupancy overrides, keyed by slug.
 *
 * The 2026-27 sheet quotes every room, the Poolside Villa included, "per room
 * per night on double occupancy", with additional guests charged at the
 * additional-guest tariff. The villa therefore includes two adults like the
 * rest; only its ceiling differs, because it is a whole villa that sleeps more.
 * (Before the sheet it was let at a family rate that covered four — if that is
 * still how it should sell, this is the one line to change.)
 */
export const ROOM_OCCUPANCY_OVERRIDES = {
  "pool-side-villa": { adultsIncluded: 2, maxAdults: 6 },
};

export const MAX_CHILDREN = 2;

/**
 * Children under 5 who stay free: one, per the 2026-27 sheet ("One child below
 * 5 years is complimentary, sharing the room with parents without extra bed").
 * A second under-5 is not covered by that line, so a party with one is booked
 * with the extra child charged at the child rate.
 */
export const MAX_INFANTS = 1;
