// @ts-check
/**
 * The frozen record of what a booking was sold at.
 *
 * This is the guarantee that makes an admin rate screen safe to hand over: a
 * confirmed booking keeps its price no matter what happens to the rate card
 * afterwards. Without it, re-opening an invoice after a price rise would
 * reprint the stay at today's tariff, and a guest who paid Rs 22,680 in
 * September would receive a tax document saying Rs 25,000.
 *
 * So the snapshot holds the whole derivation, not just the total: the rates
 * used, the season each night fell in, the slab each night was taxed at, the
 * discount or offer applied. Invoicing reconstructs from this. The live rate
 * card is never consulted for a booking that already exists.
 *
 * Versioned because this JSON outlives the code that wrote it — a reader years
 * from now needs to know which shape it is looking at.
 */

export const RATE_SNAPSHOT_VERSION = 2;

/**
 * Builds the snapshot for one priced stay.
 *
 * Deliberately verbose. Storage is cheap and a tax document that cannot be
 * reproduced is not; every figure an invoice might need is written down rather
 * than left to be re-derived from a rule that may since have changed.
 */
export function buildRateSnapshot({ quote, roomSlug, roomName, couponCode = null, couponAmount = 0 }) {
  const card = quote.rateCard ?? null;

  return {
    version: RATE_SNAPSHOT_VERSION,
    capturedAt: new Date().toISOString(),

    room: { slug: roomSlug, name: roomName },
    stay: {
      checkIn: quote.checkIn,
      checkOut: quote.checkOut,
      nights: quote.nights,
      adults: quote.adults,
      children: quote.children,
      infants: quote.infants,
      extraBeds: quote.extraBeds,
      adultsIncluded: quote.adultsIncluded,
    },

    // The rules in force at the moment of sale, copied rather than referenced.
    rules: card
      ? {
          baseNightlyRate: quote.baseNightlyRate,
          peakSurchargeRate: card.peakSurchargeRate,
          gst: { ...card.gst },
          longStay: { ...card.longStay },
          occupancy: {
            extraAdultRate: card.occupancy.extraAdultRate,
            childRate: card.occupancy.childRate,
            infantRate: card.occupancy.infantRate,
            extraBeddingRate: card.occupancy.extraBeddingRate,
            infantMaxAge: card.occupancy.infantMaxAge,
            childMaxAge: card.occupancy.childMaxAge,
          },
        }
      : null,

    // Per night: what it was, what season, what came off, what it was taxed at.
    nights: quote.nightLines.map((n) => ({
      date: n.date,
      season: n.season,
      seasonLabel: n.seasonLabel,
      discountBlackout: n.discountBlackout,
      discountBlackoutLabel: n.discountBlackoutLabel,
      baseRate: n.baseRate,
      seasonalBase: n.seasonalBase,
      longStayDiscount: n.longStayDiscount,
      offerDiscount: n.offerDiscount ?? 0,
      couponDiscount: n.couponDiscount,
      extraPersonCharges: n.extraPersonCharges,
      effectiveValue: n.effectiveValue,
      gstRate: n.gstRate,
      gstAmount: n.gstAmount,
    })),

    extraGuestLines: quote.extraGuestLines,

    discounts: {
      longStay: quote.longStayDiscountTotal,
      offer: quote.offerDiscountTotal ?? 0,
      appliedOffer: quote.appliedOffer ?? null,
      coupon: couponAmount,
      couponCode,
      total: quote.totalDiscount,
    },

    totals: {
      seasonalBaseTotal: quote.seasonalBaseTotal,
      extraPersonTotal: quote.extraPersonTotal,
      taxableAmount: quote.taxableAmount,
      gstRate: quote.gstRate,
      mixedGstRates: quote.mixedGstRates,
      totalGst: quote.totalGst,
      totalAmount: quote.totalAmount,
    },
  };
}

/**
 * Reads a stored snapshot back, whatever version wrote it.
 *
 * Returns null for a booking made before snapshots existed, which is the signal
 * for callers to fall back to the stored base/gst/total columns on the booking
 * row itself. Those older bookings are not re-derivable — the point here is
 * only that they are not silently re-priced either.
 */
export function readRateSnapshot(raw) {
  if (!raw || typeof raw !== "object") return null;
  if (!Array.isArray(raw.nights) || !raw.totals) return null;
  return raw;
}

/**
 * The per-night effective room value a snapshot was taxed on.
 *
 * Invoicing needs this to state the slab without re-deriving it from a rate
 * card that may have moved since.
 */
export function effectivePerNightFromSnapshot(snapshot) {
  const snap = readRateSnapshot(snapshot);
  if (!snap || snap.nights.length === 0) return null;
  const total = snap.nights.reduce((s, n) => s + Number(n.effectiveValue ?? 0), 0);
  return Math.round((total / snap.nights.length) * 100) / 100;
}
