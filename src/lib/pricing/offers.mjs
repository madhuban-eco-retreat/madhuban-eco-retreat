// @ts-check
/**
 * Campaign offers: conditions in, one reward out, one winner per booking.
 *
 * The rules this encodes, all of which are deliberate:
 *
 *   - ONE offer per booking. Never two. The winner is whichever reduces the
 *     bill most, so a guest is never worse off for the property having run a
 *     second campaign.
 *   - The long-stay discount competes in that same contest rather than sitting
 *     underneath it. Stacking 20% for length of stay on top of a 25% campaign
 *     is not something anyone decided to sell, and "no stacking" has to mean
 *     the house discount too or it means very little.
 *   - Offers never touch a peak or blackout night. Those are the dates the
 *     property fills at full rate, and an offer that ignored them would quietly
 *     undo the blackout tier that exists to protect them.
 *
 * Pure: no database, no clock. `bookedOn` is passed in so an early-bird cutoff
 * is testable and so a quote is reproducible after the fact.
 */

import { roundTo2 } from "./quote.mjs";

/** The reward shapes an offer may take. Exactly one per offer. */
export const REWARD_TYPES = Object.freeze([
  "percent_off_stay",
  "flat_off",
  "free_night_per_n",
  "tiered_per_night",
]);

/** Human labels, shared by the admin form and the preview. */
export const REWARD_LABELS = Object.freeze({
  percent_off_stay: "% off the stay",
  flat_off: "Flat ₹ off",
  free_night_per_n: "Free night every N nights",
  tiered_per_night: "Per-night tiered %",
});

/**
 * Whether an offer's conditions are met by this stay.
 *
 * Returns a reason when they are not, because the admin preview needs to say
 * why a sample quote came back undiscounted rather than just showing no line.
 */
export function offerApplies(offer, { nights, roomSlug, rooms = 1, bookedOn = null }) {
  if (!offer) return { ok: false, reason: "No offer" };
  if (offer.is_active === false) return { ok: false, reason: "Offer is switched off" };
  if (nights < (offer.min_nights ?? 1)) {
    return { ok: false, reason: `Needs at least ${offer.min_nights} nights` };
  }
  if (rooms < (offer.min_rooms ?? 1)) {
    return { ok: false, reason: `Needs at least ${offer.min_rooms} rooms` };
  }
  const slugs = offer.room_slugs;
  if (Array.isArray(slugs) && slugs.length > 0 && roomSlug && !slugs.includes(roomSlug)) {
    return { ok: false, reason: "Not available for this room type" };
  }
  // book_by is the early-bird / last-minute lever: book on or before this date.
  if (offer.book_by && bookedOn && bookedOn > offer.book_by) {
    return { ok: false, reason: `Booking window closed on ${offer.book_by}` };
  }
  return { ok: true, reason: null };
}

/**
 * Which nights of a stay this offer may reduce.
 *
 * Two filters, and they are different things. `offerEligible` is the engine's
 * own peak/blackout rule and is not negotiable. The offer's stay_from/stay_to
 * is the campaign window, applied PER NIGHT for the same reason seasons are:
 * a stay running out of a promotional window should get the promotion on the
 * nights inside it, not lose it entirely or claim it for nights outside.
 */
export function offerNightIndices(offer, nightLines) {
  const from = offer.stay_from ?? null;
  const to = offer.stay_to ?? null;
  const indices = [];
  nightLines.forEach((n, i) => {
    if (!n.offerEligible) return;
    if (from && n.date < from) return;
    if (to && n.date > to) return;
    indices.push(i);
  });
  return indices;
}

/** Zero-filled per-night array, so every reward returns the same shape. */
function emptyPerNight(length) {
  return new Array(length).fill(0);
}

/**
 * What one offer takes off, night by night.
 *
 * Every reward reduces ROOM RENT at the seasonal base — never the extra-person
 * charges, and never below zero on any night. Returning per-night figures
 * rather than one total is what lets the GST slab stay a per-night question:
 * a night discounted below Rs 7,500 moves to 5%, and it can only do that if the
 * engine knows which night the money came off.
 */
export function offerDiscountPerNight(offer, nightLines) {
  const perNight = emptyPerNight(nightLines.length);
  const idx = offerNightIndices(offer, nightLines);
  if (idx.length === 0) return perNight;

  const rentAt = (i) => nightLines[i].seasonalBase;

  switch (offer.reward_type) {
    case "percent_off_stay": {
      const pct = Number(offer.reward_value) || 0;
      for (const i of idx) perNight[i] = roundTo2((rentAt(i) * pct) / 100);
      break;
    }

    case "flat_off": {
      // Spread across eligible nights in proportion to what each is worth, so
      // the reduction lands where the money is and the slab moves honestly.
      // Capped at the eligible rent: a Rs 5,000 offer cannot make a Rs 3,000
      // night negative or leak onto a blackout night.
      const eligibleRent = idx.reduce((s, i) => s + rentAt(i), 0);
      if (eligibleRent <= 0) break;
      const flat = Math.min(Number(offer.reward_value) || 0, eligibleRent);
      let assigned = 0;
      idx.forEach((i, k) => {
        const share =
          k === idx.length - 1
            ? roundTo2(flat - assigned)
            : roundTo2((rentAt(i) / eligibleRent) * flat);
        perNight[i] = share;
        assigned = roundTo2(assigned + share);
      });
      break;
    }

    case "free_night_per_n": {
      // Buy N, get 1. The guest gets the CHEAPEST qualifying nights free, which
      // is the industry convention and the conservative one for the property.
      const n = Math.max(1, Math.floor(Number(offer.reward_value) || 0));
      const freeCount = Math.min(Math.floor(nightLines.length / (n + 1)), idx.length);
      if (freeCount <= 0) break;
      const cheapestFirst = [...idx].sort((a, b) => rentAt(a) - rentAt(b));
      for (const i of cheapestFirst.slice(0, freeCount)) perNight[i] = roundTo2(rentAt(i));
      break;
    }

    case "tiered_per_night": {
      // Tiers are keyed by position in the stay, 1-based: night 2 is the second
      // night the guest sleeps, regardless of how many nights are eligible.
      const tiers = Array.isArray(offer.reward_tiers) ? offer.reward_tiers : [];
      const byNight = new Map(
        tiers
          .filter((t) => t && Number.isFinite(Number(t.night)))
          .map((t) => [Number(t.night), Number(t.percent) || 0]),
      );
      for (const i of idx) {
        const pct = byNight.get(i + 1);
        if (pct) perNight[i] = roundTo2((rentAt(i) * pct) / 100);
      }
      break;
    }

    default:
      break;
  }

  // Never reduce a night past its own rent.
  return perNight.map((amount, i) => Math.min(roundTo2(amount), roundTo2(nightLines[i].seasonalBase)));
}

/**
 * The single best reduction available, offers and the long-stay discount alike.
 *
 * `longStayPerNight` is the house discount the engine already worked out. It is
 * passed in as just another candidate so the comparison is one-sided and
 * total-based: whatever saves the guest the most wins, and nothing stacks.
 *
 * A tie goes to the long-stay discount, because it is the one a guest was
 * already told about on the tariff page.
 */
export function bestReduction({
  nightLines,
  offers = [],
  longStayPerNight = null,
  nights,
  roomSlug,
  rooms = 1,
  bookedOn = null,
}) {
  const candidates = [];

  const longStay = longStayPerNight ?? emptyPerNight(nightLines.length);
  const longStayTotal = roundTo2(longStay.reduce((s, a) => s + a, 0));
  candidates.push({
    kind: "long_stay",
    offer: null,
    perNight: longStay,
    total: longStayTotal,
  });

  for (const offer of offers ?? []) {
    const check = offerApplies(offer, { nights, roomSlug, rooms, bookedOn });
    if (!check.ok) {
      candidates.push({ kind: "offer", offer, perNight: null, total: 0, skipped: check.reason });
      continue;
    }
    const perNight = offerDiscountPerNight(offer, nightLines);
    const total = roundTo2(perNight.reduce((s, a) => s + a, 0));
    candidates.push({
      kind: "offer",
      offer,
      perNight,
      total,
      skipped: total > 0 ? null : "No eligible nights (peak, blackout, or outside the offer window)",
    });
  }

  // Strictly greater, so an offer matching the long-stay discount to the rupee
  // does not displace it.
  let winner = candidates[0];
  for (const c of candidates) {
    if (c.perNight && c.total > winner.total) winner = c;
  }

  return { winner, candidates };
}
