import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { computeAdminQuote } from "@/lib/pricing/admin-quote.mjs";

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

    const quote = computeAdminQuote({
        baseNightlyRate: Number(room.base_price_per_night),
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
        basePricePerNight: Number(room.base_price_per_night),
    };
}
