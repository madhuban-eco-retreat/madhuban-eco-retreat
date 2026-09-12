// @ts-check
/**
 * A stay plus add-ons, priced the same way whoever is asking.
 *
 * The admin "new booking" screen previews a total in the browser and the
 * create route recomputes it on the server. They were two separate
 * implementations of the rate card, and they disagreed: the preview taxed
 * everything at 12% or 18% by a `>= 7500` test and then divided the tax back
 * out of the total as though tariffs were GST-inclusive, while the server
 * added 5%/18% on top. Both are now this function.
 */

import { computeStayQuote, roundTo2 } from "./quote.mjs";
import { ADDON_GST_FOLLOWS_ROOM_SLAB, GST_RATE_HIGH } from "./config.mjs";

/**
 * Add-on lines for a stay. `unit` of "per night" multiplies by nights; every
 * other unit is a one-off, whatever it is priced per.
 */
function addonLines(addons, nights) {
  return (addons ?? []).map((addon) => {
    const multiplier = addon.unit === "per night" ? nights : 1;
    return {
      label: addon.label,
      qty: addon.qty,
      unit: addon.unit,
      price: addon.price,
      amount: roundTo2(addon.price * addon.qty * multiplier),
    };
  });
}

/**
 * Prices a room-night stay together with any add-ons.
 *
 * The room is quoted by the engine, so it carries the peak surcharge, the
 * long-stay discount and a per-night slab. Add-ons are taxed separately rather
 * than being folded into the room's effective value — they are a different
 * supply, and letting a bush-dining booking push a Rs 7,000 room night onto
 * the 18% slab would be taxing accommodation at the rate of dinner.
 */
export function computeAdminQuote({
  baseNightlyRate,
  roomSlug,
  checkIn,
  checkOut,
  adults = 2,
  children = 0,
  extraBeds = 0,
  addons = [],
}) {
  const quote = computeStayQuote({
    baseNightlyRate,
    roomSlug,
    checkIn,
    checkOut,
    adults,
    children,
    extraBeds,
  });

  const addonsBreakdown = addonLines(addons, quote.nights);
  const addonsTotal = roundTo2(addonsBreakdown.reduce((s, a) => s + a.amount, 0));

  const addonGstRate = ADDON_GST_FOLLOWS_ROOM_SLAB ? quote.gstRate : GST_RATE_HIGH;
  const addonsGst = roundTo2((addonsTotal * addonGstRate) / 100);

  const subtotalBeforeGst = roundTo2(quote.taxableAmount + addonsTotal);
  const gstAmount = roundTo2(quote.totalGst + addonsGst);

  return {
    ...quote,
    roomTotal: quote.taxableAmount,
    addonsBreakdown,
    addonsTotal,
    addonGstRate,
    addonsGst,
    gstRatePct: quote.gstRate,
    subtotalBeforeGst,
    gstAmount,
    totalAmount: roundTo2(subtotalBeforeGst + gstAmount),
    // Kept as an alias so admin callers reading `subtotalInclusive` get the
    // payable figure rather than a stale pre-tax one.
    subtotalInclusive: roundTo2(subtotalBeforeGst + gstAmount),
  };
}
