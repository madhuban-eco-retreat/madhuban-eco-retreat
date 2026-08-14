import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { OCCUPYING_STATUSES, availableUnits, fetchOverlappingBlocks, totalBlockedUnits, } from "@/lib/booking/inventory";
export { computeCellState } from "./availability-utils";

/**
 * Units free per room over [from, to), keyed by room id.
 *
 * The rooms list shows "1 available today" next to each type, which needs the
 * same inventory − booked − blocked arithmetic the booking path uses. Three
 * queries for the whole list, not three per room.
 */
export async function getRoomAvailability(roomIds, from, to) {
    const supabase = createAdminClient();
    if (roomIds.length === 0)
        return {};
    const [roomsResult, bookingsResult, blocks] = await Promise.all([
        supabase.from("rooms").select("id, inventory_count").in("id", roomIds),
        supabase
            .from("bookings")
            .select("room_id")
            .in("room_id", roomIds)
            .in("status", OCCUPYING_STATUSES)
            .lt("checkin", to)
            .gt("checkout", from),
        fetchOverlappingBlocks(supabase, { from, to }),
    ]);
    if (roomsResult.error)
        throw new Error(roomsResult.error.message);
    if (bookingsResult.error)
        throw new Error(bookingsResult.error.message);
    const bookedByRoom = {};
    for (const b of bookingsResult.data ?? []) {
        bookedByRoom[b.room_id] = (bookedByRoom[b.room_id] ?? 0) + 1;
    }
    const result = {};
    for (const room of roomsResult.data ?? []) {
        const inventory = Math.max(room.inventory_count ?? 1, 1);
        const booked = bookedByRoom[room.id] ?? 0;
        const blocked = Math.min(totalBlockedUnits(blocks, room.id, inventory), inventory);
        result[room.id] = {
            inventory,
            booked,
            blocked,
            available: availableUnits({ inventoryCount: inventory, bookedUnits: booked, blockedUnits: blocked }),
        };
    }
    return result;
}
// Rooms, bookings and blocks overlapping the visible range.
// Date ranges [A,B) and [C,D) overlap when A < D AND B > C.
export async function getAvailabilityData(fromDate, // YYYY-MM-DD inclusive
toDate // YYYY-MM-DD exclusive (day after last visible day)
) {
    const supabase = createAdminClient();
    const [roomsResult, bookingsResult, blocks] = await Promise.all([
        supabase
            .from("rooms")
            .select("id, name, slug, inventory_count, sort_order")
            .eq("is_active", true)
            .order("sort_order", { ascending: true }),
        supabase
            .from("bookings")
            .select(`
        id, room_id, checkin, checkout, status, num_adults, num_children,
        guests!guest_id ( name )
      `)
            .not("status", "in", '("CANCELLED","NO_SHOW")')
            .lt("checkin", toDate)
            .gt("checkout", fromDate),
        fetchOverlappingBlocks(supabase, { from: fromDate, to: toDate }),
    ]);
    if (roomsResult.error)
        throw new Error(roomsResult.error.message);
    if (bookingsResult.error)
        throw new Error(bookingsResult.error.message);
    const rooms = (roomsResult.data ?? []).map((r) => ({
        id: r.id,
        name: r.name,
        slug: r.slug,
        inventory_count: Math.max(r.inventory_count ?? 1, 1),
        sort_order: r.sort_order,
    }));
    const bookings = (bookingsResult.data ?? []).map((b) => {
        const guest = Array.isArray(b.guests) ? b.guests[0] : b.guests;
        return {
            id: b.id,
            room_id: b.room_id,
            checkin: b.checkin,
            checkout: b.checkout,
            status: b.status,
            num_adults: b.num_adults,
            num_children: b.num_children,
            guest_name: guest?.name ?? "Unknown Guest",
        };
    });
    // "Who blocked it" is part of the hover summary, and created_by is only a
    // uuid. One extra lookup keyed to the ids actually on screen beats joining
    // user_profiles into every block query.
    const creatorIds = [...new Set(blocks.map((b) => b.created_by).filter(Boolean))];
    const creatorNames = new Map();
    if (creatorIds.length > 0) {
        const { data: profiles } = await supabase
            .from("user_profiles")
            .select("user_id, full_name, email")
            .in("user_id", creatorIds);
        for (const p of profiles ?? []) {
            creatorNames.set(p.user_id, p.full_name ?? p.email ?? null);
        }
    }
    const normalizedBlocks = blocks.map((bl) => ({
        id: bl.id,
        room_id: bl.room_id,
        date_from: bl.date_from,
        date_to: bl.date_to,
        // null means a pre-migration row, which meant the whole room type —
        // resolved against inventory wherever it is displayed or counted.
        units_blocked: bl.units_blocked,
        reason: bl.reason,
        notes: bl.notes ?? null,
        created_at: bl.created_at,
        created_by: bl.created_by,
        created_by_name: creatorNames.get(bl.created_by) ?? null,
    }));
    return { rooms, bookings, blocks: normalizedBlocks };
}
