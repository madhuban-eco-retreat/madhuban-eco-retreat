// @ts-check
/**
 * Occupancy rules and extra-guest tariffs.
 *
 * Room rates are quoted on double occupancy, so the first two adults are
 * already paid for in the nightly tariff and only a third is charged. These
 * figures are pre-GST: they are added to the taxable base and taxed at the
 * room's slab, matching how the rates are advertised on the stay pages
 * ("₹1,500 / night ... GST extra on above charges").
 */

/** Adults covered by the nightly tariff before extra-guest charges apply. */
export const ADULTS_INCLUDED = 2;

export const MAX_ADULTS = 3;
export const MAX_CHILDREN = 2;
export const MAX_INFANTS = 2;

/** Per night, pre-GST. */
export const EXTRA_ADULT_RATE = 2000;
/** Per child per night, pre-GST. Applies to ages 5–12. */
export const CHILD_RATE = 1500;
/** Under-5s stay free; tracked for headcount only, never charged. */
export const INFANT_RATE = 0;

/**
 * Extra-guest charges for a stay, as pre-GST line items.
 *
 * Returns whole line items rather than a single number so the checkout summary,
 * the review page and the invoice can each show the guest exactly what they are
 * paying for instead of a lump "extras" figure.
 */
export function extraGuestCharges({ adults, children, nights }) {
  const extraAdults = Math.max(0, adults - ADULTS_INCLUDED);
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
  return { lines, total, extraAdults };
}
