import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
export { computeCellState } from "./availability-utils";
// Two queries per load — bookings overlapping range + blocks overlapping range.
// Date ranges [A,B) and [C,D) overlap when A < D AND B > C.
export async function getAvailabilityData(fromDate, // YYYY-MM-DD inclusive
toDate // YYYY-MM-DD exclusive (day after last visible day)
) {
    const supabase = createAdminClient();
    const [roomsResult, bookingsResult, blocksResult] = await Promise.all([
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
        supabase
            .from("manual_blocks")
            .select("id, room_id, date_from, date_to, reason, notes, created_at, created_by")
            .lt("date_from", toDate)
            .gt("date_to", fromDate),
    ]);
    if (roomsResult.error)
        throw new Error(roomsResult.error.message);
    if (bookingsResult.error)
        throw new Error(bookingsResult.error.message);
    if (blocksResult.error)
        throw new Error(blocksResult.error.message);
    const rooms = (roomsResult.data ?? []).map((r) => ({
        id: r.id,
        name: r.name,
        slug: r.slug,
        inventory_count: r.inventory_count,
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
    const blocks = (blocksResult.data ?? []).map((bl) => ({
        id: bl.id,
        room_id: bl.room_id,
        date_from: bl.date_from,
        date_to: bl.date_to,
        reason: bl.reason,
        notes: bl.notes ?? null,
        created_at: bl.created_at,
        created_by: bl.created_by,
    }));
    return { rooms, bookings, blocks };
}
