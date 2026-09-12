import { NextResponse } from "next/server";
import { assertAdmin } from "@/lib/admin/auth";
import { loadRateCard } from "@/lib/pricing/rate-card-db";
import { computeStayQuote } from "@/lib/pricing/quote.mjs";
import { validateOfferPayload, normaliseOffer } from "@/lib/admin/offers";

/**
 * "3-night Safari Tent in August = ₹X" — the sample quote shown before saving.
 *
 * Prices a real stay through the real engine with the unsaved offer spliced in,
 * so what staff see is what a guest would be charged rather than a mock-up that
 * can drift from the pricing code.
 *
 * Two quotes are returned, with and without the offer, because the number that
 * actually matters to whoever is about to publish a campaign is the difference
 * — and whether the offer won at all. An offer that loses to the standing
 * long-stay discount is a common and easily-missed mistake; this is where it
 * becomes visible.
 */
export async function POST(req) {
  const user = await assertAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { offer, sample } = body ?? {};

  const errors = validateOfferPayload(offer);
  if (errors.length > 0) return NextResponse.json({ error: errors[0], errors }, { status: 400 });

  const roomSlug = sample?.roomSlug ?? "safari-tent";
  const checkIn = sample?.checkIn ?? defaultCheckIn();
  const nights = Math.max(1, Number(sample?.nights ?? 3));
  const checkOut = addDays(checkIn, nights);
  const adults = Math.max(1, Number(sample?.adults ?? 2));
  const rooms = Math.max(1, Number(sample?.rooms ?? 1));

  try {
    const card = await loadRateCard({ includeOffers: false });
    const baseNightlyRate = card.baseRates[roomSlug];
    if (baseNightlyRate === undefined) {
      return NextResponse.json({ error: `No rate configured for ${roomSlug}` }, { status: 400 });
    }

    const stay = {
      baseNightlyRate,
      roomSlug,
      checkIn,
      checkOut,
      adults,
      rooms,
      rateCard: card,
      // Previewing is "what would this cost if booked today".
      bookedOn: new Date().toISOString().slice(0, 10),
    };

    // The offer is normalised but NOT saved — this is a dry run against a draft.
    const candidate = { ...normaliseOffer(offer), id: "preview", is_active: true };

    const without = computeStayQuote({ ...stay, offers: [] });
    const withOffer = computeStayQuote({ ...stay, offers: [candidate] });

    const saving = Math.round((without.totalAmount - withOffer.totalAmount) * 100) / 100;

    return NextResponse.json({
      sample: { roomSlug, checkIn, checkOut, nights, adults, rooms, baseNightlyRate },
      without: summarise(without),
      with: summarise(withOffer),
      saving,
      offerWon: Boolean(withOffer.appliedOffer),
      // Why it did not win, when it did not. Usually "every night is peak or
      // blackout" or "the long-stay discount already saves more".
      reason: explain(withOffer, without),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not price the sample";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

function summarise(q) {
  return {
    nights: q.nights,
    seasonalBaseTotal: q.seasonalBaseTotal,
    longStayDiscountTotal: q.longStayDiscountTotal,
    offerDiscountTotal: q.offerDiscountTotal ?? 0,
    appliedOffer: q.appliedOffer,
    taxableAmount: q.taxableAmount,
    gstRate: q.gstRate,
    mixedGstRates: q.mixedGstRates,
    totalGst: q.totalGst,
    totalAmount: q.totalAmount,
    peakNights: q.peakNights,
    blackoutNights: q.blackoutNights,
    nightLines: q.nightLines.map((n) => ({
      date: n.date,
      season: n.season,
      discountBlackout: n.discountBlackout,
      seasonalBase: n.seasonalBase,
      longStayDiscount: n.longStayDiscount,
      offerDiscount: n.offerDiscount ?? 0,
      effectiveValue: n.effectiveValue,
      gstRate: n.gstRate,
    })),
  };
}

function explain(withOffer, without) {
  if (withOffer.appliedOffer) return null;
  const candidate = (withOffer.offerCandidates ?? [])[0];
  if (candidate?.skipped) return candidate.skipped;
  if (without.longStayDiscountTotal > 0) {
    return `The standing ${Math.round(
      without.longStayDiscountRate * 100,
    )}% long-stay discount already saves more, so it wins instead. Only one applies.`;
  }
  return "No nights in this sample qualify.";
}

/** The 10th of next month — a neutral regular-season date for a sample. */
function defaultCheckIn() {
  const now = new Date();
  const next = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 10));
  return next.toISOString().slice(0, 10);
}

function addDays(date, days) {
  return new Date(Date.parse(`${date}T00:00:00Z`) + days * 86400000).toISOString().slice(0, 10);
}
