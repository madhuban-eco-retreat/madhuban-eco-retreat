import { format, addDays } from "date-fns";
import { createAdminClient } from "@/lib/supabase/admin";
import { getRoomAvailability } from "@/lib/admin/availability";
import { RoomsAdminClient } from "./rooms-admin-client";
export const metadata = { title: "Rooms — Madhuban Admin" };
// Today's occupancy changes through the day, so the list must not be served from
// a build-time cache.
export const dynamic = "force-dynamic";
export default async function AdminRoomsPage() {
    const supabase = createAdminClient();
    const { data } = await supabase
        .from("rooms")
        .select("id, slug, name, base_price_per_night, is_active, sort_order, hero_image, gallery, updated_at, inventory_count")
        .order("sort_order", { ascending: true });
    const rooms = (data ?? []);
    // Tonight, not "today": a stay covering tonight occupies [today, tomorrow).
    const today = new Date();
    const from = format(today, "yyyy-MM-dd");
    const to = format(addDays(today, 1), "yyyy-MM-dd");
    // Best-effort — the rooms list is still worth showing without the counts.
    let availability = {};
    try {
        availability = await getRoomAvailability(rooms.map((r) => r.id), from, to);
    }
    catch (err) {
        console.error("[admin/rooms] availability lookup failed:", err);
    }
    return <RoomsAdminClient initialRooms={rooms} availability={availability}/>;
}
