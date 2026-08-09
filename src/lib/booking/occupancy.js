// @ts-check
/**
 * Occupancy rules and extra-guest tariffs.
 *
 * Most rooms are quoted on double occupancy: the first two adults are paid for
 * in the nightly tariff and only a third is charged. The Pool Side Villa is
 * not — it is a whole villa let at a family rate that already covers four, and
 * charging its third and fourth adult a surcharge overcharged every group that
 * booked it. Base occupancy is therefore a per-room fact, not a constant.
 *
 * These figures are pre-GST: they are added to the taxable base and taxed at
 * the room's slab, matching how the rates are advertised on the stay pages
 * ("₹1,500 / night ... GST extra on above charges").
 */

/** Adults covered by the nightly tariff for a room with no override. */
export const DEFAULT_ADULTS_INCLUDED = 2;
/** Largest party a room with no override accepts. */
export const DEFAULT_MAX_ADULTS = 3;

/**
 * Per-room occupancy overrides, keyed by slug.
 *
 * Slugs rather than a rooms column because the schema has max_occupancy but
 * nothing for "adults already in the price", and inventing that column is a
 * migration this repo does not own. Adding a room here is a one-line change;
 * if a third room ever needs it, move both numbers into the table.
 */
export const ROOM_OCCUPANCY_OVERRIDES = {
  "pool-side-villa": { adultsIncluded: 4, maxAdults: 6 },
};

/** Ceiling across every room — the coarse bound request validation can apply. */
export const MAX_ADULTS_ANY_ROOM = Object.values(ROOM_OCCUPANCY_OVERRIDES).reduce(
  (max, o) => Math.max(max, o.maxAdults),
  DEFAULT_MAX_ADULTS,
);

/**
 * Retained for callers that predate per-room occupancy. New code should ask
 * for a slug — this is the default, not the answer for every room.
 */
export const ADULTS_INCLUDED = DEFAULT_ADULTS_INCLUDED;
export const MAX_ADULTS = DEFAULT_MAX_ADULTS;

export const MAX_CHILDREN = 2;
export const MAX_INFANTS = 2;

/** Per night, pre-GST. Charged per adult beyond the room's included count. */
export const EXTRA_ADULT_RATE = 2000;
/** Per child per night, pre-GST. Applies to ages 5–12. */
export const CHILD_RATE = 1500;
/** Under-5s stay free; tracked for headcount only, never charged. */
export const INFANT_RATE = 0;

/** Adults already covered by the nightly tariff for this room. */
export function adultsIncludedFor(roomSlug) {
  return ROOM_OCCUPANCY_OVERRIDES[roomSlug]?.adultsIncluded ?? DEFAULT_ADULTS_INCLUDED;
}

/** Largest party this room accepts. */
export function maxAdultsFor(roomSlug) {
  return ROOM_OCCUPANCY_OVERRIDES[roomSlug]?.maxAdults ?? DEFAULT_MAX_ADULTS;
}

/**
 * Extra-guest charges for a stay, as pre-GST line items.
 *
 * Returns whole line items rather than a single number so the checkout summary,
 * the review page and the invoice can each show the guest exactly what they are
 * paying for instead of a lump "extras" figure.
 *
 * roomSlug decides where the surcharge starts. Omitting it falls back to double
 * occupancy, which is right for every room that has no override.
 */
export function extraGuestCharges({ adults, children, nights, roomSlug }) {
  const included = adultsIncludedFor(roomSlug);
  const extraAdults = Math.max(0, adults - included);
  const lines = [];

  if (extraAdults > 0) {
    lines.push({
      key: "extra_adult",
      label: "Extra adult",
      qty: extraAdults,
      ratePerNight: EXTRA_ADULT_RATE,
      amount: Math.round(extraAdults * EXTRA_ADULT_RATE * nights * 100) / 100,
    });
  }

  if (children > 0) {
    lines.push({
      key: "child",
      label: "Child (5–12 yrs)",
      qty: children,
      ratePerNight: CHILD_RATE,
      amount: Math.round(children * CHILD_RATE * nights * 100) / 100,
    });
  }

  const total = Math.round(lines.reduce((s, l) => s + l.amount, 0) * 100) / 100;
  return { lines, total, extraAdults, adultsIncluded: included };
}
