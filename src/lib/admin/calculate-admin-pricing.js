import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { computeAdminQuote } from "@/lib/pricing/admin-quote.mjs";
import { loadRateCard } from "@/lib/pricing/rate-card-db";
import { buildRateSnapshot } from "@/lib/pricing/snapshot.mjs";

/**
 * Authoritative pricing for an admin-created booking.
 *
 * The rate card itself is src/lib/pricing; all this does is fetch the room and
 * hand the stay over. It previously multiplied the base rate by the nights and
 * read the GST slab straight off `base_price_per_night`, which ignored the
 * season, the long-stay discount and the guest count alike — a walk-in booked
 * over Christmas was written into the ledger at the regular tariff and taxed
 * at the wrong slab on top of it.
 */
export async function calculateAdminPricing(params) {
    const { roomId, checkIn, checkOut, adults = 2, children = 0, extraBeds = 0, addons } = params;
    const supabase = createAdminClient();
    const { data: room, error } = await supabase
        .from("rooms")
        .select("id, name, slug, base_price_per_night")
        .eq("id", roomId)
        .single();
    if (error || !room)
        throw new Error("Room not found");

    // The admin-edited rate card, same as the public engine uses. room_rates is
    // the authority on price once staff have set one; the rooms table stays the
    // fallback so a category with no rate row still sells.
    const card = await loadRateCard();

    const quote = computeAdminQuote({
        rateCard: card,
        offers: card.offers,
        bookedOn: new Date().toISOString().slice(0, 10),
        baseNightlyRate: card.baseRates[room.slug] ?? Number(room.base_price_per_night),
        roomSlug: room.slug,
        checkIn,
        checkOut,
        adults,
        children,
        extraBeds,
        addons,
    });

    return {
        ...quote,
        roomId: room.id,
        roomName: room.name,
        basePricePerNight: card.baseRates[room.slug] ?? Number(room.base_price_per_night),
        // Frozen so a walk-in priced today keeps today's card even if staff
        // edit rates tomorrow — the same guarantee the public flow gets.
        rateSnapshot: buildRateSnapshot({
            quote,
            roomSlug: room.slug,
            roomName: room.name,
        }),
    };
}
