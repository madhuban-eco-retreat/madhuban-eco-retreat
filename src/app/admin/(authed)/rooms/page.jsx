import { createAdminClient } from "@/lib/supabase/admin";
import { RoomsAdminClient } from "./rooms-admin-client";
export const metadata = { title: "Rooms — Madhuban Admin" };
export default async function AdminRoomsPage() {
    const supabase = createAdminClient();
    const { data } = await supabase
        .from("rooms")
        .select("id, slug, name, base_price_per_night, is_active, sort_order, hero_image, gallery, updated_at, inventory_count")
        .order("sort_order", { ascending: true });
    const rooms = (data ?? []);
    return <RoomsAdminClient initialRooms={rooms}/>;
}
