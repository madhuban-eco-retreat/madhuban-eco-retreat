import { createPublicClient, DataUnavailableError, PGRST_NO_ROWS } from "@/lib/supabase/public";
import { createAdminClient } from "@/lib/supabase/admin";
// Public: active rooms only, ordered by sort_order (anon key + RLS).
export async function getRooms() {
    const supabase = createPublicClient();
    const { data, error } = await supabase
        .from("rooms")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });
    if (error) {
        throw new DataUnavailableError(`rooms list failed: ${error.message}`, { cause: error });
    }
    return (data ?? []);
}
// Public: single active room by slug.
// Returns null only when the row genuinely does not exist. An unreachable or
// erroring database throws instead, so callers never mistake an outage for a
// deleted room and serve 404 on a live URL.
export async function getRoomBySlug(slug) {
    const supabase = createPublicClient();
    const { data, error } = await supabase
        .from("rooms")
        .select("*")
        .eq("slug", slug)
        .eq("is_active", true)
        .single();
    if (error) {
        if (error.code === PGRST_NO_ROWS)
            return null;
        throw new DataUnavailableError(`room lookup failed for "${slug}": ${error.message}`, {
            cause: error,
        });
    }
    return data;
}
// Public: FAQs for a room (ordered).
// FAQs are supplementary, so a failure here degrades to an empty list rather
// than denying the visitor the room page itself.
export async function getRoomFaqs(roomId) {
    const supabase = createPublicClient();
    const { data, error } = await supabase
        .from("room_faqs")
        .select("*")
        .eq("room_id", roomId)
        .order("display_order", { ascending: true });
    if (error) {
        console.error(`[rooms] FAQ fetch failed for room ${roomId}:`, error.message);
        return [];
    }
    return (data ?? []);
}
// Admin: all room slugs (for generateStaticParams — service role bypasses RLS).
export async function getAllRoomSlugs() {
    const supabase = createAdminClient();
    const { data } = await supabase
        .from("rooms")
        .select("slug")
        .eq("is_active", true);
    return (data ?? []).map((r) => r.slug);
}
