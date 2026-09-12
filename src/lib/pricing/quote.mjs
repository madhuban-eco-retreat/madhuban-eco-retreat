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
 *
 * Every function that needs a number takes an optional rate card and defaults
 * to DEFAULT_RATE_CARD, which is config.mjs verbatim. That default is what lets
 * the admin screens move the rate card into the database without changing a
 * single call site or a single sum: an un-edited card prices identically, and a
 * missing row falls back rather than failing.
 */

import { DEFAULT_RATE_CARD, nightlyRateFor } from "./rate-card.mjs";
import { bestReduction } from "./offers.mjs";

/** Every entry point takes `card` last, so existing callers keep working. */
const D = DEFAULT_RATE_CARD;

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
function inRecurringPeakWindow(date, card = D) {
  const recurring = card.recurringPeak;
  // Null when an admin has deleted the recurring peak row outright. Honoured
  // rather than quietly reinstated from config, or Christmas could not be
  // switched off even deliberately.
  if (!recurring) return false;
  const month = Number(date.slice(5, 7));
  const day = Number(date.slice(8, 10));
  const { from, to } = recurring;
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
export function seasonForNight(date, card = D) {
  const listed = (card.peakPeriods ?? []).find(
    (p) => !p.recurring && withinInclusive(date, p.start, p.end),
  );
  if (listed) return { season: "peak", label: listed.label };
  if (inRecurringPeakWindow(date, card)) {
    return { season: "peak", label: card.recurringPeak?.label ?? "Peak season" };
  }
  return { season: "regular", label: null };
}

/** Convenience predicate: does this night carry the +20% surcharge? */
export function isPeakNight(date, card = D) {
  return seasonForNight(date, card).season === "peak";
}

/**
 * The festival or long weekend this night falls in, or null.
 *
 * Separate from the season because it answers a different question. A blackout
 * night is REGULAR season — it is sold at the plain tariff, with no surcharge —
 * and the only thing it changes is that the long-stay discount is withheld.
 * Folding it into seasonForNight would have marked Diwali up 20%, which is not
 * what the rate card says.
 */
export function discountBlackoutForNight(date, card = D) {
  return (card.blackoutPeriods ?? []).find((p) => withinInclusive(date, p.start, p.end)) ?? null;
}

/** True when this night sits in a festival / long-weekend blackout. */
export function isDiscountBlackoutNight(date, card = D) {
  return discountBlackoutForNight(date, card) !== null;
}

/**
 * Whether one night can carry the long-stay discount, and why not if it cannot.
 *
 * The two reasons are independent and both disqualifying: a peak night is
 * already marked up, and a blackout night is a date the property fills at full
 * rate. Answering both in one place keeps the engine and the invoice-side
 * reconstruction from drifting on which nights count.
 */
export function discountEligibilityForNight(date, card = D) {
  const { season, label: peakLabel } = seasonForNight(date, card);
  if (season === "peak" && !card.longStay.appliesOnPeak) {
    return { eligible: false, reason: "peak", label: peakLabel };
  }
  const blackout = discountBlackoutForNight(date, card);
  if (blackout) {
    return { eligible: false, reason: "blackout", label: blackout.label };
  }
  return { eligible: true, reason: null, label: null };
}

/** Every peak period a stay touches, by label. Used for guest-facing copy. */
export function peakLabelsForStay(checkIn, checkOut, card = D) {
  const labels = new Set();
  for (const night of stayNights(checkIn, checkOut)) {
    const { season, label } = seasonForNight(night, card);
    if (season === "peak" && label) labels.add(label);
  }
  return [...labels];
}

/** Every period that costs a stay its discount, peak and blackout alike. */
export function discountBlockingLabelsForStay(checkIn, checkOut, card = D) {
  const labels = new Set();
  for (const night of stayNights(checkIn, checkOut)) {
    const { eligible, label } = discountEligibilityForNight(night, card);
    if (!eligible && label) labels.add(label);
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
export function gstRateForEffectiveValue(effectivePerNightValue, card = D) {
  return effectivePerNightValue > card.gst.threshold ? card.gst.rateHigh : card.gst.rateLow;
}

/* -- occupancy ------------------------------------------------------------ */

/** Adults already covered by the nightly tariff for this room. */
export function adultsIncludedFor(roomSlug, card = D) {
  return card.occupancy.overrides[roomSlug]?.adultsIncluded ?? card.occupancy.defaultAdultsIncluded;
}

/** Largest party this room accepts. */
export function maxAdultsFor(roomSlug, card = D) {
  return card.occupancy.overrides[roomSlug]?.maxAdults ?? card.occupancy.defaultMaxAdults;
}

/**
 * Per-night extra-occupant charge, as lines plus a total.
 *
 * Per NIGHT, not per stay, because the slab is a per-night test: a stay-level
 * extras figure cannot tell you what any individual night was worth. Infants
 * are absent by construction — they are free, and a zero line on an invoice
 * invites the question of why it is there.
 */
export function extraPersonChargesPerNight({
  adults = 0,
  children = 0,
  extraBeds = 0,
  roomSlug,
  card = D,
}) {
  const included = adultsIncludedFor(roomSlug, card);
  const extraAdults = Math.max(0, adults - included);
  const { extraAdultRate, childRate, extraBeddingRate, infantMaxAge, childMaxAge } = card.occupancy;
  const lines = [];

  if (extraAdults > 0) {
    lines.push({
      key: "extra_adult",
      label: "Extra adult",
      qty: extraAdults,
      ratePerNight: extraAdultRate,
      amountPerNight: roundTo2(extraAdults * extraAdultRate),
    });
  }
  if (children > 0) {
    lines.push({
      key: "child",
      // The bracket is read off the card so the label cannot contradict the
      // ages the admin screen is charging by.
      label: `Child (${infantMaxAge}-${childMaxAge} yrs)`,
      qty: children,
      ratePerNight: childRate,
      amountPerNight: roundTo2(children * childRate),
    });
  }
  if (extraBeds > 0) {
    lines.push({
      key: "extra_bed",
      label: "Extra bedding",
      qty: extraBeds,
      ratePerNight: extraBeddingRate,
      amountPerNight: roundTo2(extraBeds * extraBeddingRate),
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
  rateCard = D,
  offers = null,
  rooms = 1,
  bookedOn = null,
}) {
  const card = rateCard ?? D;
  const nightDates = stayNights(checkIn, checkOut);
  const nights = nightDates.length;
  if (nights < 1) throw new Error("Check-out must be after check-in");

  // The caller may hand the rate in directly — every existing one does — or
  // leave it out and let the card supply it for the slug.
  const baseRate =
    baseNightlyRate ?? nightlyRateFor(card, roomSlug, { peak: false });
  if (baseRate === undefined || baseRate === null) {
    throw new Error(`No nightly rate configured for ${roomSlug ?? "this room"}`);
  }

  const extras = extraPersonChargesPerNight({ adults, children, extraBeds, roomSlug, card });
  const longStayActive = card.longStay.active !== false;
  const stayQualifiesForLongStay = longStayActive && nights >= card.longStay.minNights;

  // Pass 1 — season, surcharge and the long-stay cut, night by night. The
  // coupon cannot be spread until every night's room rent is known, so the
  // slab is deliberately NOT read here.
  const draft = nightDates.map((date) => {
    const { season, label } = seasonForNight(date, card);
    const peak = season === "peak";
    const override =
      typeof peakMultiplierOverride === "function"
        ? Number(peakMultiplierOverride(date)) || 1
        : peakMultiplierOverride;

    // A per-room peak rate, where the admin has set one, replaces the derived
    // surcharge; the rate card is the only place that decision lives. The
    // multiplier is then back-derived so the night still reports how far above
    // its base rate it was sold.
    const peakRate = peak ? nightlyRateFor(card, roomSlug, { peak: true }) : undefined;
    const cardPeakBase =
      peak && peakRate !== undefined && card.peakRates?.[roomSlug] !== undefined
        ? peakRate
        : undefined;

    const multiplier = peak ? Math.max(card.peakSurchargeRate, override) : override;
    const seasonalBase = roundTo2(
      cardPeakBase !== undefined ? Math.max(cardPeakBase, baseRate * override) : baseRate * multiplier,
    );
    const effectiveMultiplier = baseRate > 0 ? roundTo2(seasonalBase / baseRate) : multiplier;

    // Eligibility is asked of the date, not of `peak`, so a festival night —
    // regular rate, no surcharge — still loses the discount.
    const eligibility = discountEligibilityForNight(date, card);
    const discountEligible = stayQualifiesForLongStay && eligibility.eligible;
    const longStayDiscount = discountEligible
      ? roundTo2(seasonalBase * card.longStay.rate)
      : 0;

    const blackout = discountBlackoutForNight(date, card);

    return {
      date,
      season,
      seasonLabel: label,
      discountBlackout: blackout !== null,
      discountBlackoutLabel: blackout?.label ?? null,
      discountBlockedBy: stayQualifiesForLongStay ? eligibility.reason : null,
      // Nights an offer may reduce. Peak and blackout nights are excluded for
      // the same reason the long-stay discount skips them.
      offerEligible: eligibility.eligible,
      baseRate: roundTo2(baseRate),
      multiplier: effectiveMultiplier,
      seasonalBase,
      longStayDiscount,
      longStayDiscountApplied: longStayDiscount > 0,
      roomRentAfterLongStay: roundTo2(seasonalBase - longStayDiscount),
    };
  });

  // ── one reduction, not two ────────────────────────────────────────────────
  // The long-stay discount worked out above is a candidate, not a decision.
  // Campaign offers compete with it and the biggest single saving wins; nothing
  // stacks. When an offer wins, the long-stay cut is removed from every night
  // rather than reduced, so the guest gets exactly one of the two.
  const offerList = offers ?? card.offers ?? [];
  const { winner, candidates: reductionCandidates } = bestReduction({
    nightLines: draft,
    offers: offerList,
    longStayPerNight: draft.map((n) => n.longStayDiscount),
    nights,
    roomSlug,
    rooms,
    bookedOn,
  });
  const offerWon = winner.kind === "offer" && winner.offer;

  if (offerWon) {
    draft.forEach((n, i) => {
      n.longStayDiscount = 0;
      n.longStayDiscountApplied = false;
      n.offerDiscount = winner.perNight[i];
      n.offerDiscountApplied = winner.perNight[i] > 0;
      n.roomRentAfterLongStay = roundTo2(n.seasonalBase - n.offerDiscount);
    });
  } else {
    draft.forEach((n) => {
      n.offerDiscount = 0;
      n.offerDiscountApplied = false;
    });
  }

  const appliedOffer = offerWon
    ? {
        id: winner.offer.id ?? null,
        name: winner.offer.name ?? "Offer",
        rewardType: winner.offer.reward_type,
        rewardValue: winner.offer.reward_value ?? null,
        amount: winner.total,
      }
    : null;

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
    const gstRate = gstRateForEffectiveValue(effectiveValue, card);
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
  const offerDiscountTotal = sum((n) => n.offerDiscount ?? 0);
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

    // Festival / long-weekend nights: regular rate, discount withheld. Counted
    // separately from peak so a summary can explain the missing discount on a
    // stay that was never marked up.
    blackoutNights: nightLines.filter((n) => n.discountBlackout).length,
    blackoutLabels: [...new Set(nightLines.map((n) => n.discountBlackoutLabel).filter(Boolean))],
    discountEligibleNights: nightLines.filter((n) => n.longStayDiscountApplied).length,

    baseNightlyRate: roundTo2(baseRate),
    seasonalBaseTotal,
    longStayDiscountTotal,
    longStayDiscountApplied: longStayDiscountTotal > 0,
    longStayDiscountRate: card.longStay.rate,
    couponDiscountTotal,

    // The winning campaign offer, if one beat the long-stay discount. Null when
    // the house discount won or when nothing applied.
    appliedOffer,
    offerDiscountTotal,
    // Every offer considered, with the reason each was passed over. The admin
    // preview renders this; a guest never sees it.
    offerCandidates: reductionCandidates
      .filter((c) => c.kind === "offer")
      .map((c) => ({
        id: c.offer?.id ?? null,
        name: c.offer?.name ?? null,
        total: c.total,
        skipped: c.skipped ?? null,
        won: offerWon && c.offer === winner.offer,
      })),

    totalDiscount: roundTo2(longStayDiscountTotal + offerDiscountTotal + couponDiscountTotal),
    extraPersonTotal,

    /** The card this quote was priced from, for offers and the rate snapshot. */
    rateCard: card,

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
export function longStayDiscountForStay({
  baseNightlyTotal,
  nights,
  checkIn,
  checkOut,
  multiplier = 1,
  rateCard = D,
}) {
  const card = rateCard ?? D;
  if (card.longStay.active === false || nights < card.longStay.minNights) {
    return { amount: 0, applied: false, reason: null };
  }

  const dates = stayNights(checkIn, checkOut);
  const eligible = dates.filter((d) => discountEligibilityForNight(d, card).eligible);

  if (eligible.length === 0 || multiplier > 1) {
    const labels = [
      ...new Set(dates.map((d) => discountEligibilityForNight(d, card).label).filter(Boolean)),
    ].join(", ");
    return {
      amount: 0,
      applied: false,
      reason: labels ? `Not available for ${labels} dates` : "Not available on peak season dates",
    };
  }

  // Weighted by what each night was actually sold at, so the eligible share of
  // a mixed stay is right. Only peak nights carry the surcharge — a blackout
  // night costs the plain tariff, so it weighs the same as a regular one even
  // though it earns nothing.
  const weights = dates.map((d) => (isPeakNight(d, card) ? card.peakSurchargeRate : 1));
  const totalWeight = weights.reduce((s, w) => s + w, 0);
  const eligibleWeight = dates.reduce(
    (s, d, i) => (discountEligibilityForNight(d, card).eligible ? s + weights[i] : s),
    0,
  );
  const eligibleRent = (baseNightlyTotal * eligibleWeight) / totalWeight;

  const pct = Math.round(card.longStay.rate * 100);
  return {
    amount: roundTo2(eligibleRent * card.longStay.rate),
    applied: true,
    reason:
      eligible.length === dates.length
        ? `${pct}% off for ${card.longStay.minNights}+ nights stay`
        : `${pct}% off room rent on your ${eligible.length} regular-season night${
            eligible.length > 1 ? "s" : ""
          }`,
  };
}

/**
 * Why the long-stay discount was or was not given, in one guest-facing line.
 *
 * Kept beside the engine so checkout, the review step and the invoice cannot
 * each invent their own wording for the same outcome. A stay can now lose the
 * discount for two different reasons, and a guest who was never charged a
 * surcharge should not be told their dates were "peak season".
 */
export function longStayDiscountReason(quote, card = quote?.rateCard ?? D) {
  if (quote.nights < card.longStay.minNights) return null;

  const pct = Math.round(card.longStay.rate * 100);
  if (quote.longStayDiscountApplied) {
    const n = quote.discountEligibleNights;
    return n === quote.nights
      ? `${pct}% off for ${card.longStay.minNights}+ nights stay`
      : `${pct}% off room rent on ${n} of your ${quote.nights} nights`;
  }

  const labels = [...new Set([...quote.peakLabels, ...quote.blackoutLabels])].join(", ");
  return labels
    ? `Not available for ${labels} dates`
    : "Not available on peak season dates";
}
