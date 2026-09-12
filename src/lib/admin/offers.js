import { REWARD_TYPES } from "@/lib/pricing/offers.mjs";

/**
 * Validation and normalisation for the offers form.
 *
 * No `server-only` here: the form imports the same functions so a staff member
 * sees the problem before the round trip, and the API route re-runs them
 * because the form is a convenience and the route is the boundary.
 */

/**
 * Everything wrong with an offer, as sentences.
 *
 * Collected rather than thrown one at a time — an offer has a lot of fields and
 * fixing them one round trip each is miserable.
 */
export function validateOfferPayload(body) {
  const errors = [];
  const o = body ?? {};

  if (!o.name || !String(o.name).trim()) errors.push("Name is required");
  if (!REWARD_TYPES.includes(o.reward_type)) errors.push("Pick a reward type");

  const int = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  };

  const minNights = int(o.min_nights ?? 1);
  if (minNights === null || minNights < 1) errors.push("Minimum nights must be at least 1");
  const minRooms = int(o.min_rooms ?? 1);
  if (minRooms === null || minRooms < 1) errors.push("Minimum rooms must be at least 1");

  if (o.stay_from && o.stay_to && o.stay_to < o.stay_from) {
    errors.push("The stay window ends before it begins");
  }

  // Reward shape. Exactly one reward per offer, and each has its own bounds.
  switch (o.reward_type) {
    case "percent_off_stay": {
      const v = Number(o.reward_value);
      if (!Number.isFinite(v) || v <= 0 || v > 100) {
        errors.push("Percentage off must be between 1 and 100");
      }
      break;
    }
    case "flat_off": {
      const v = Number(o.reward_value);
      if (!Number.isFinite(v) || v <= 0) errors.push("Flat amount must be more than zero");
      break;
    }
    case "free_night_per_n": {
      const v = Number(o.reward_value);
      if (!Number.isFinite(v) || v < 1) {
        errors.push("Enter how many nights must be paid for before one is free");
      }
      // Buy-1-get-1 on a 1-night minimum is a 50% offer written confusingly;
      // it is allowed, but the minimum stay has to be able to reach it.
      if (Number.isFinite(v) && minNights !== null && minNights < v + 1) {
        errors.push(
          `A free night needs at least ${v + 1} nights — raise the minimum nights to match`,
        );
      }
      break;
    }
    case "tiered_per_night": {
      const tiers = Array.isArray(o.reward_tiers) ? o.reward_tiers : [];
      if (tiers.length === 0) errors.push("Add at least one night tier");
      const seen = new Set();
      for (const t of tiers) {
        const night = Number(t?.night);
        const percent = Number(t?.percent);
        if (!Number.isFinite(night) || night < 1) {
          errors.push("Each tier needs a night number of 1 or more");
        } else if (seen.has(night)) {
          errors.push(`Night ${night} appears twice`);
        } else {
          seen.add(night);
        }
        if (!Number.isFinite(percent) || percent <= 0 || percent > 100) {
          errors.push("Each tier percentage must be between 1 and 100");
        }
      }
      break;
    }
    default:
      break;
  }

  return errors;
}

/**
 * The payload as the table wants it.
 *
 * Blank strings become nulls, because an empty date input posts "" and a
 * Postgres date column will not take it. room_slugs is nulled when empty so
 * "every room type" is one representation rather than two.
 */
export function normaliseOffer(body) {
  const o = body ?? {};
  const blankToNull = (v) => (v === "" || v === undefined ? null : v);
  const slugs = Array.isArray(o.room_slugs) ? o.room_slugs.filter(Boolean) : [];

  return {
    name: String(o.name).trim(),
    description: blankToNull(o.description?.trim?.() ?? o.description) ?? null,
    is_active: Boolean(o.is_active),

    min_nights: Number(o.min_nights ?? 1),
    min_rooms: Number(o.min_rooms ?? 1),
    stay_from: blankToNull(o.stay_from),
    stay_to: blankToNull(o.stay_to),
    book_by: blankToNull(o.book_by),
    room_slugs: slugs.length > 0 ? slugs : null,

    reward_type: o.reward_type,
    reward_value:
      o.reward_type === "tiered_per_night" ? null : Number(o.reward_value),
    reward_tiers:
      o.reward_type === "tiered_per_night"
        ? (Array.isArray(o.reward_tiers) ? o.reward_tiers : [])
            .map((t) => ({ night: Number(t.night), percent: Number(t.percent) }))
            .sort((a, b) => a.night - b.night)
        : null,

    sort_order: Number(o.sort_order ?? 0),
    updated_at: new Date().toISOString(),
  };
}

/** One-line human summary of a reward, for the offers list. */
export function describeReward(offer) {
  if (!offer) return "";
  switch (offer.reward_type) {
    case "percent_off_stay":
      return `${Number(offer.reward_value)}% off room rent`;
    case "flat_off":
      return `₹${Number(offer.reward_value).toLocaleString("en-IN")} off the stay`;
    case "free_night_per_n":
      return `Stay ${Number(offer.reward_value)}, get 1 night free`;
    case "tiered_per_night": {
      const tiers = Array.isArray(offer.reward_tiers) ? offer.reward_tiers : [];
      return tiers.map((t) => `night ${t.night}: ${t.percent}% off`).join(", ") || "Tiered";
    }
    default:
      return offer.reward_type;
  }
}
