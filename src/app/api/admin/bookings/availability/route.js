import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { assertAdmin } from "@/lib/admin/auth";
import { OCCUPYING_STATUSES, availableUnits, fetchOverlappingBlocks, totalBlockedUnits, } from "@/lib/booking/inventory";
export async function GET(req) {
    const user = await assertAdmin();
    if (!user)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { searchParams } = new URL(req.url);
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    if (!from || !to) {
        return NextResponse.json({ error: "from and to query params required (YYYY-MM-DD)" }, { status: 400 });
    }
    if (from >= to) {
        return NextResponse.json({ error: "to must be after from" }, { status: 400 });
    }
    const supabase = createAdminClient();
    // Fetch all active rooms
    const { data: rooms, error: roomsError } = await supabase
        .from("rooms")
        .select("id, name, slug, base_price_per_night, max_occupancy, max_occupancy_children, inventory_count")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });
    if (roomsError || !rooms) {
        return NextResponse.json({ error: "Failed to fetch rooms" }, { status: 500 });
    }
    // For each room, count overlapping confirmed/checked-in bookings
    // Date ranges overlap when: checkin < to AND checkout > from
    const { data: conflicts, error: conflictsError } = await supabase
        .from("bookings")
        .select("room_id")
        .in("status", OCCUPYING_STATUSES)
        .lt("checkin", to)
        .gt("checkout", from);
    if (conflictsError) {
        return NextResponse.json({ error: "Failed to check availability" }, { status: 500 });
    }
    // Count how many booked units per room_id
    const bookedCountByRoom = {};
    for (const c of conflicts ?? []) {
        bookedCountByRoom[c.room_id] = (bookedCountByRoom[c.room_id] ?? 0) + 1;
    }
    // Manual blocks hold however many units they were written for. Counting each
    // row as one unit — as this did — was wrong in both directions: it undercounted
    // a four-unit block and overcounted a whole-room-type block on a single-unit
    // room only by luck.
    let blocks;
    try {
        blocks = await fetchOverlappingBlocks(supabase, { from, to });
    }
    catch {
        return NextResponse.json({ error: "Failed to check availability" }, { status: 500 });
    }
    const result = rooms.map((room) => {
        const inventory = Math.max(room.inventory_count ?? 1, 1);
        const booked = bookedCountByRoom[room.id] ?? 0;
        const blocked = Math.min(totalBlockedUnits(blocks, room.id, inventory), inventory);
        return {
            id: room.id,
            name: room.name,
            slug: room.slug,
            base_price_per_night: Number(room.base_price_per_night),
            max_occupancy: room.max_occupancy,
            max_occupancy_children: room.max_occupancy_children,
            inventory_count: inventory,
            booked_units: booked,
            blocked_units: blocked,
            available_units: availableUnits({ inventoryCount: inventory, bookedUnits: booked, blockedUnits: blocked }),
        };
    });
    return NextResponse.json({ rooms: result });
}
