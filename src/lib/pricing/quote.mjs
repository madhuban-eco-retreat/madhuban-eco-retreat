// @ts-check
/**
 * The pricing engine, as a pure function of a rate card and a stay.
 *
 * Nothing here reads a database, an environment variable or a clock, so the
 * whole rate card is testable without a Supabase client — which is part of why
 * the slab bug lived as long as it did. Every number it uses comes from
 * config.mjs; this module only sequences them.
 *
 * The sequence, per night, is the whole point:
 *
 *   1. classify the night — peak or regular, on its OWN date
 *   2. seasonal base   = base rate x (peak ? +20% : 1)
 *   3. long-stay cut   = 20% off, but only on a regular night of a 2+ stay
 *   4. extras          = extra adults / children / beds, per night
 *   5. effective value = (2 - 3) + 4          <- what the guest is charged
 *   6. GST slab        = decided by (5), not by the catalogue tariff
 *
 * Step 6 after step 5 is the fix. The previous implementation picked the slab
 * from rooms.base_price_per_night before any of steps 2-4 ran, so a Rs 7,500
 * tent stayed on the 5% slab whether it was sold at Rs 7,500, Rs 9,000 on a
 * peak night, or Rs 9,500 with a third adult in it — under-collecting GST on
 * every booking that was not a bare double-occupancy regular night.
 */

import {
  GST_THRESHOLD,
  GST_RATE_LOW,
  GST_RATE_HIGH,
  PEAK_SURCHARGE_RATE,
  PEAK_PERIODS,
  RECURRING_PEAK_MONTH_DAYS,
  LONG_STAY_DISCOUNT_RATE,
  LONG_STAY_MIN_NIGHTS,
  LONG_STAY_DISCOUNT_ON_PEAK_NIGHTS,
  CHILD_RATE,
  EXTRA_ADULT_RATE,
  DEFAULT_ADULTS_INCLUDED,
  DEFAULT_MAX_ADULTS,
  ROOM_OCCUPANCY_OVERRIDES,
} from "./config.mjs";

/* -- small helpers -------------------------------------------------------- */

/** Rupees to the paisa. Every figure this module returns has been through it. */
export function roundTo2(n) {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

/** Days between two YYYY-MM-DD dates, treated as UTC midnights. */
export function nightsBetween(checkIn, checkOut) {
  return Math.round(
    (Date.parse(`${checkOut}T00:00:00Z`) - Date.parse(`${checkIn}T00:00:00Z`)) / 86400000,
  );
}

/**
 * The dates actually slept in, as YYYY-MM-DD.
 *
 * A stay is priced as a list of nights, each named by the date it begins, and
 * the check-out date is not one of them. Everything downstream classifies and
 * charges these dates individually — there is no stay-level season, because a
 * stay can straddle 04/05 January.
 */
export function stayNights(checkIn, checkOut) {
  const out = [];
  const count = nightsBetween(checkIn, checkOut);
  const start = Date.parse(`${checkIn}T00:00:00Z`);
  for (let i = 0; i < count; i += 1) {
    out.push(new Date(start + i * 86400000).toISOString().slice(0, 10));
  }
  return out;
}

/** True when date falls on or between two inclusive YYYY-MM-DD bounds. */
function withinInclusive(date, start, end) {
  return date >= start && date <= end;
}

/**
 * True for a date in the Christmas-New Year turn of ANY year.
 *
 * The window wraps the year boundary, so it is two tests, not one: December
 * from the 21st, or January through the 4th.
 */
function inRecurringPeakWindow(date) {
  const month = Number(date.slice(5, 7));
  const day = Number(date.slice(8, 10));
  const { from, to } = RECURRING_PEAK_MONTH_DAYS;
  if (month === from.month) return day >= from.day;
  if (month === to.month) return day <= to.day;
  return false;
}

/* -- season --------------------------------------------------------------- */

/**
 * Which season one night belongs to.
 *
 * Regular season is defined by exclusion — everything the rate card does not
 * name as peak — so a date the festival list has never heard of is sold at the
 * regular rate rather than falling through to nothing.
 */
export function seasonForNight(date) {
  const listed = PEAK_PERIODS.find((p) => withinInclusive(date, p.start, p.end));
  if (listed) return { season: "peak", label: listed.label };
  if (inRecurringPeakWindow(date)) {
    return { season: "peak", label: RECURRING_PEAK_MONTH_DAYS.label };
  }
  return { season: "regular", label: null };
}

/** Convenience predicate — the surcharge and the discount blackout share it. */
export function isPeakNight(date) {
  return seasonForNight(date).season === "peak";
}

/** Every peak period a stay touches, by label. Used for guest-facing copy. */
export function peakLabelsForStay(checkIn, checkOut) {
  const labels = new Set();
  for (const night of stayNights(checkIn, checkOut)) {
    const { season, label } = seasonForNight(night);
    if (season === "peak" && label) labels.add(label);
  }
  return [...labels];
}

/* -- GST slab ------------------------------------------------------------- */

/**
 * The slab for an amount actually being charged.
 *
 * Callers must hand this the EFFECTIVE per-night value — post-surcharge,
 * post-discount, extras included. Handing it a catalogue tariff is the bug
 * this module exists to fix, so the parameter is named for what it must be.
 *
 * The threshold is inclusive at the bottom slab: Rs 7,500 exactly is 5%, and
 * only strictly more moves to 18%.
 */
export function gstRateForEffectiveValue(effectivePerNightValue) {
  return effectivePerNightValue > GST_THRESHOLD ? GST_RATE_HIGH : GST_RATE_LOW;
}

/* -- occupancy ------------------------------------------------------------ */

/** Adults already covered by the nightly tariff for this room. */
export function adultsIncludedFor(roomSlug) {
  return ROOM_OCCUPANCY_OVERRIDES[roomSlug]?.adultsIncluded ?? DEFAULT_ADULTS_INCLUDED;
}

/** Largest party this room accepts. */
export function maxAdultsFor(roomSlug) {
  return ROOM_OCCUPANCY_OVERRIDES[roomSlug]?.maxAdults ?? DEFAULT_MAX_ADULTS;
}

/**
 * Per-night extra-occupant charge, as lines plus a total.
 *
 * Per NIGHT, not per stay, because the slab is a per-night test: a stay-level
 * extras figure cannot tell you what any individual night was worth. Infants
 * are absent by construction — they are free, and a zero line on an invoice
 * invites the question of why it is there.
 */
export function extraPersonChargesPerNight({ adults = 0, children = 0, extraBeds = 0, roomSlug }) {
  const included = adultsIncludedFor(roomSlug);
  const extraAdults = Math.max(0, adults - included);
  const lines = [];

  if (extraAdults > 0) {
    lines.push({
      key: "extra_adult",
      label: "Extra adult",
      qty: extraAdults,
      ratePerNight: EXTRA_ADULT_RATE,
      amountPerNight: roundTo2(extraAdults * EXTRA_ADULT_RATE),
    });
  }
  if (children > 0) {
    lines.push({
      key: "child",
      label: "Child (5-12 yrs)",
      qty: children,
      ratePerNight: CHILD_RATE,
      amountPerNight: roundTo2(children * CHILD_RATE),
    });
  }
  if (extraBeds > 0) {
    lines.push({
      key: "extra_bed",
      label: "Extra bedding",
      qty: extraBeds,
      ratePerNight: EXTRA_ADULT_RATE,
      amountPerNight: roundTo2(extraBeds * EXTRA_ADULT_RATE),
    });
  }

  const total = roundTo2(lines.reduce((s, l) => s + l.amountPerNight, 0));
  return { lines, total, extraAdults, adultsIncluded: included };
}

/* -- the engine ----------------------------------------------------------- */

/**
 * Prices one stay.
 *
 * baseNightlyRate is the regular-season, double-occupancy, pre-GST tariff —
 * the figure the rooms table stores and the tariff table advertises. Peak
 * pricing is derived here rather than passed in, so no caller can forget it.
 *
 * peakMultiplierOverride exists for the admin pricing_rules table, which can
 * mark a date range up beyond the standard +20%. It only ever raises the
 * surcharge: a staff rule below the rate card cannot undercut the published
 * peak rate, and a rule of 1 on a Christmas night cannot cancel it. Pass a
 * number for a flat override, or a (date) => number callback when the rules
 * cover only part of the stay — a rule is a date range like any other, and
 * applying its multiplier to nights outside it was the stay-level mistake this
 * engine exists to stop repeating.
 *
 * couponDiscount is a rupee figure off room rent for the whole stay. It is
 * spread across nights in proportion to what each night's room rent is worth,
 * because a coupon that reduces the amount charged has to reduce the value the
 * slab is read from too — otherwise the transaction-value rule would hold for
 * the long-stay discount but not for a coupon, which is not a distinction GST
 * makes.
 */
export function computeStayQuote({
  baseNightlyRate,
  checkIn,
  checkOut,
  adults = 2,
  children = 0,
  infants = 0,
  extraBeds = 0,
  roomSlug,
  couponDiscount = 0,
  peakMultiplierOverride = 1,
}) {
  const nightDates = stayNights(checkIn, checkOut);
  const nights = nightDates.length;
  if (nights < 1) throw new Error("Check-out must be after check-in");

  const extras = extraPersonChargesPerNight({ adults, children, extraBeds, roomSlug });
  const stayQualifiesForLongStay = nights >= LONG_STAY_MIN_NIGHTS;

  // Pass 1 — season, surcharge and the long-stay cut, night by night. The
  // coupon cannot be spread until every night's room rent is known, so the
  // slab is deliberately NOT read here.
  const draft = nightDates.map((date) => {
    const { season, label } = seasonForNight(date);
    const peak = season === "peak";
    const override =
      typeof peakMultiplierOverride === "function"
        ? Number(peakMultiplierOverride(date)) || 1
        : peakMultiplierOverride;
    const multiplier = peak ? Math.max(PEAK_SURCHARGE_RATE, override) : override;
    const seasonalBase = roundTo2(baseNightlyRate * multiplier);

    const discountEligible =
      stayQualifiesForLongStay && (!peak || LONG_STAY_DISCOUNT_ON_PEAK_NIGHTS);
    const longStayDiscount = discountEligible
      ? roundTo2(seasonalBase * LONG_STAY_DISCOUNT_RATE)
      : 0;

    return {
      date,
      season,
      seasonLabel: label,
      baseRate: roundTo2(baseNightlyRate),
      multiplier,
      seasonalBase,
      longStayDiscount,
      longStayDiscountApplied: longStayDiscount > 0,
      roomRentAfterLongStay: roundTo2(seasonalBase - longStayDiscount),
    };
  });

  // Spread the coupon across nights by share of room rent, then hand the last
  // night the remainder so the parts add back to the coupon exactly rather
  // than drifting a paisa on a three-way split.
  const discountableRoomTotal = roundTo2(
    draft.reduce((s, n) => s + n.roomRentAfterLongStay, 0),
  );
  const coupon = Math.max(0, Math.min(roundTo2(couponDiscount), discountableRoomTotal));
  let couponAssigned = 0;
  const couponPerNight = draft.map((n, i) => {
    if (coupon === 0 || discountableRoomTotal === 0) return 0;
    if (i === draft.length - 1) return roundTo2(coupon - couponAssigned);
    const share = roundTo2((n.roomRentAfterLongStay / discountableRoomTotal) * coupon);
    couponAssigned = roundTo2(couponAssigned + share);
    return share;
  });

  // Pass 2 — extras, effective value, and only now the slab.
  const nightLines = draft.map((n, i) => {
    const couponShare = couponPerNight[i];
    const roomValue = roundTo2(n.roomRentAfterLongStay - couponShare);
    const effectiveValue = roundTo2(roomValue + extras.total);
    const gstRate = gstRateForEffectiveValue(effectiveValue);
    const gstAmount = roundTo2((effectiveValue * gstRate) / 100);

    return {
      ...n,
      couponDiscount: couponShare,
      extraPersonCharges: extras.total,
      roomValue,
      // The number the slab is read from, surfaced so an invoice or a test can
      // assert on it instead of re-deriving it.
      effectiveValue,
      gstRate,
      gstAmount,
      totalWithGst: roundTo2(effectiveValue + gstAmount),
    };
  });

  const sum = (pick) => roundTo2(nightLines.reduce((s, n) => s + pick(n), 0));

  const seasonalBaseTotal = sum((n) => n.seasonalBase);
  const longStayDiscountTotal = sum((n) => n.longStayDiscount);
  const couponDiscountTotal = sum((n) => n.couponDiscount);
  const extraPersonTotal = sum((n) => n.extraPersonCharges);
  const taxableAmount = sum((n) => n.effectiveValue);
  const totalGst = sum((n) => n.gstAmount);

  // A stay can legitimately straddle two slabs — a regular night at Rs 7,200
  // and a Christmas night at Rs 10,800 are 5% and 18% respectively. The
  // per-night rates are authoritative; this is the single figure the bookings
  // table's one gst_rate column can hold, chosen as the rate covering the most
  // taxable value so a mixed stay is labelled by what it mostly is.
  const rates = [...new Set(nightLines.map((n) => n.gstRate))];
  const valueAtRate = (rate) =>
    nightLines.filter((n) => n.gstRate === rate).reduce((s, n) => s + n.effectiveValue, 0);
  const representativeGstRate =
    rates.length === 1 ? rates[0] : [...rates].sort((a, b) => valueAtRate(b) - valueAtRate(a))[0];

  const peakNights = nightLines.filter((n) => n.season === "peak").length;

  return {
    checkIn,
    checkOut,
    nights,
    adults,
    children,
    infants,
    extraBeds,
    adultsIncluded: extras.adultsIncluded,
    extraGuestLines: extras.lines,
    extraPersonPerNight: extras.total,

    nightLines,

    peakNights,
    regularNights: nights - peakNights,
    peakLabels: [...new Set(nightLines.map((n) => n.seasonLabel).filter(Boolean))],

    baseNightlyRate: roundTo2(baseNightlyRate),
    seasonalBaseTotal,
    longStayDiscountTotal,
    longStayDiscountApplied: longStayDiscountTotal > 0,
    longStayDiscountRate: LONG_STAY_DISCOUNT_RATE,
    couponDiscountTotal,
    totalDiscount: roundTo2(longStayDiscountTotal + couponDiscountTotal),
    extraPersonTotal,

    /** Pre-GST amount actually being charged. */
    taxableAmount,
    gstRate: representativeGstRate,
    mixedGstRates: rates.length > 1,
    totalGst,
    totalAmount: roundTo2(taxableAmount + totalGst),
  };
}

/**
 * The long-stay discount for a stay that has already been sold, reconstructed
 * from its stored room-rent total.
 *
 * Invoicing works backwards: it has a booking row, not a quote, and must arrive
 * at the same discount checkout gave without re-pricing the stay at today's
 * tariff. `baseNightlyTotal` is gross room rent at the rate actually charged.
 *
 * Per night, like everything else here — a stay that straddles Christmas earns
 * the discount on its regular nights and nothing on its peak ones, where the
 * older stay-level test withheld it from the whole stay. Peak nights cost more,
 * so the eligible share is weighted by the rate each night was sold at rather
 * than being a flat 1/nights.
 *
 * `multiplier` above 1 means a staff rate rule was in force, which suppresses
 * the discount outright: marking a date up and then discounting it is not a
 * rate the property sells.
 */
export function longStayDiscountForStay({ baseNightlyTotal, nights, checkIn, checkOut, multiplier = 1 }) {
  if (nights < LONG_STAY_MIN_NIGHTS) {
    return { amount: 0, applied: false, reason: null };
  }

  const dates = stayNights(checkIn, checkOut);
  const eligible = dates.filter((d) => !isPeakNight(d));

  if (eligible.length === 0 || multiplier > 1) {
    const labels = [...new Set(dates.map((d) => seasonForNight(d).label).filter(Boolean))].join(", ");
    return {
      amount: 0,
      applied: false,
      reason: labels ? `Not available for ${labels} dates` : "Not available on peak season dates",
    };
  }

  const weights = dates.map((d) => (isPeakNight(d) ? PEAK_SURCHARGE_RATE : 1));
  const totalWeight = weights.reduce((s, w) => s + w, 0);
  const eligibleWeight = dates.reduce((s, d, i) => (isPeakNight(d) ? s : s + weights[i]), 0);
  const eligibleRent = (baseNightlyTotal * eligibleWeight) / totalWeight;

  const pct = Math.round(LONG_STAY_DISCOUNT_RATE * 100);
  return {
    amount: roundTo2(eligibleRent * LONG_STAY_DISCOUNT_RATE),
    applied: true,
    reason:
      eligible.length === dates.length
        ? `${pct}% off for ${LONG_STAY_MIN_NIGHTS}+ nights stay`
        : `${pct}% off room rent on your ${eligible.length} regular-season night${
            eligible.length > 1 ? "s" : ""
          }`,
  };
}

/**
 * Why the long-stay discount was or was not given, in one guest-facing line.
 *
 * Kept beside the engine so checkout, the review step and the invoice cannot
 * each invent their own wording for the same outcome.
 */
export function longStayDiscountReason(quote) {
  if (quote.nights < LONG_STAY_MIN_NIGHTS) return null;
  if (quote.longStayDiscountApplied) {
    const pct = Math.round(LONG_STAY_DISCOUNT_RATE * 100);
    return quote.peakNights > 0
      ? `${pct}% off room rent on your ${quote.regularNights} regular-season night${
          quote.regularNights > 1 ? "s" : ""
        }`
      : `${pct}% off for ${LONG_STAY_MIN_NIGHTS}+ nights stay`;
  }
  const labels = quote.peakLabels.join(", ");
  return labels ? `Not available for ${labels} dates` : "Not available on peak season dates";
}
