import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import {
    OCCUPYING_STATUSES,
    fetchOverlappingBlocks,
    minAvailableUnits,
} from "@/lib/booking/inventory";
// Two date ranges [A,B) and [C,D) overlap when A < D AND B > C.
/**
 * Whether a room type can take `unitsRequested` more units over [checkIn, checkOut).
 *
 * This used to answer yes/no off the first overlapping row it found, which made
 * one booking of a Safari Tent close the second tent and one maintenance block
 * on a Glamping Tent close the other three. It now counts: inventory minus
 * bookings minus blocked units.
 *
 * The count is taken per night and the tightest night wins. Counting the whole
 * range at once would read three consecutive one-night bookings as three units
 * gone, when they are one unit turning over and a four-tent type still has three
 * free every night — which would refuse perfectly bookable stays.
 *
 * Returns availableUnits/totalUnits alongside the verdict so callers can show
 * "2 of 4 left" rather than a bare "unavailable".
 */
export async function checkAvailability({ roomId, checkIn, checkOut, unitsRequested = 1, }) {
    const supabase = createAdminClient();
    const { data: room, error: roomError } = await supabase
        .from("rooms")
        .select("id, inventory_count")
        .eq("id", roomId)
        .single();
    if (roomError || !room) {
        return {
            available: false,
            availableUnits: 0,
            totalUnits: 0,
            reason: "Room not found.",
        };
    }
    const totalUnits = Math.max(room.inventory_count ?? 1, 1);
    // Each overlapping booking holds one unit, but only on the nights it actually
    // covers, so the dates come back with it rather than just a row count.
    const { data: bookings, error: bookingError } = await supabase
        .from("bookings")
        .select("checkin, checkout")
        .eq("room_id", roomId)
        .in("status", OCCUPYING_STATUSES)
        .lt("checkin", checkOut)
        .gt("checkout", checkIn);
    if (bookingError)
        throw new Error(bookingError.message);
    const blocks = await fetchOverlappingBlocks(supabase, {
        from: checkIn,
        to: checkOut,
        roomId,
    });
    const remaining = minAvailableUnits({
        inventoryCount: totalUnits,
        checkIn,
        checkOut,
        bookings: bookings ?? [],
        blocks,
        roomId,
    });
    if (remaining >= unitsRequested) {
        return { available: true, availableUnits: remaining, totalUnits };
    }
    // A guest cannot act on "blocked" versus "booked" any differently, but the
    // wording still steers them: sold out invites different dates, held-back
    // inventory invites a phone call.
    const soldOut = (bookings?.length ?? 0) > 0 && blocks.length === 0;
    return {
        available: false,
        availableUnits: remaining,
        totalUnits,
        reason: soldOut
            ? "These dates are already booked. Please choose different dates."
            : "These dates are not available. Please contact us to check alternatives.",
    };
}
