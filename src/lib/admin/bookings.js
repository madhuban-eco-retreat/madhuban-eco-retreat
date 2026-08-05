import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
export const BOOKINGS_PAGE_SIZE = 20;
const SORTABLE_COLUMNS = new Set([
    "checkin", "checkout", "created_at", "total_amount",
    "booking_ref", "status", "source",
]);
function parseSort(sort) {
    if (!sort)
        return { column: "created_at", ascending: false };
    const colonIdx = sort.lastIndexOf(":");
    if (colonIdx === -1)
        return { column: "created_at", ascending: false };
    const col = sort.slice(0, colonIdx);
    const dir = sort.slice(colonIdx + 1);
    return {
        column: SORTABLE_COLUMNS.has(col) ? col : "created_at",
        ascending: dir === "asc",
    };
}
function escapeLike(str) {
    return str.replace(/[%_\\]/g, "\\$&");
}
export async function getRoomTypes() {
    const supabase = createAdminClient();
    const { data } = await supabase
        .from("rooms")
        .select("id, name, slug")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });
    return data ?? [];
}
export async function resolveGuestIdsByName(q) {
    if (!q.trim())
        return [];
    const supabase = createAdminClient();
    const { data } = await supabase
        .from("guests")
        .select("id")
        .ilike("name", `%${escapeLike(q.trim())}%`);
    return data?.map((g) => g.id) ?? [];
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function applyFilters(query, params, guestIds, today) {
    if (params.from)
        query = query.gte("checkin", params.from);
    if (params.to)
        query = query.lte("checkin", params.to);
    if (params.source && params.source !== "all")
        query = query.eq("source", params.source);
    if (params.roomId)
        query = query.eq("room_id", params.roomId);
    if (params.status === "arriving_today") {
        query = query.eq("status", "CONFIRMED").eq("checkin", today);
    }
    else if (params.status === "departing_today") {
        query = query.eq("status", "CHECKED_IN").eq("checkout", today);
    }
    else if (params.status && params.status !== "all") {
        query = query.eq("status", params.status.toUpperCase());
    }
    if (params.q?.trim()) {
        const escaped = escapeLike(params.q.trim());
        if (guestIds.length > 0) {
            query = query.or(`booking_ref.ilike.%${escaped}%,guest_id.in.(${guestIds.join(",")})`);
        }
        else {
            // No matching guests by name — only search by booking_ref
            query = query.ilike("booking_ref", `%${escaped}%`);
        }
    }
    return query;
}
function computeNights(checkin, checkout) {
    const a = new Date(checkin).getTime();
    const b = new Date(checkout).getTime();
    return Math.max(1, Math.round((b - a) / 86_400_000));
}
function mapRow(row) {
    return {
        id: row.id,
        booking_ref: row.booking_ref,
        checkin: row.checkin,
        checkout: row.checkout,
        nights: computeNights(row.checkin, row.checkout),
        num_adults: row.num_adults,
        num_children: row.num_children,
        status: row.status,
        source: row.source,
        total_amount: row.total_amount,
        created_at: row.created_at,
        room_id: row.room_id,
        room_name: row.rooms?.name ?? "—",
        room_slug: row.rooms?.slug ?? "",
        guest_name: row.guests?.name ?? "—",
        guest_email: row.guests?.email ?? "",
    };
}
export async function getBookingsList(params, guestIds) {
    const supabase = createAdminClient();
    const today = new Date().toISOString().split("T")[0];
    const { column, ascending } = parseSort(params.sort);
    const page = params.page ?? 1;
    const offset = (page - 1) * BOOKINGS_PAGE_SIZE;
    let query = supabase
        .from("bookings")
        .select(`
      id, booking_ref, checkin, checkout, num_adults, num_children,
      status, source, total_amount, created_at, room_id,
      guests!guest_id(name, email),
      rooms!room_id(id, name, slug)
    `)
        .order(column, { ascending })
        .range(offset, offset + BOOKINGS_PAGE_SIZE - 1);
    query = applyFilters(query, params, guestIds, today);
    const { data } = await query;
    return (data ?? []).map(mapRow);
}
export async function getAllBookingsForExport(params, guestIds) {
    const supabase = createAdminClient();
    const today = new Date().toISOString().split("T")[0];
    const { column, ascending } = parseSort(params.sort);
    let query = supabase
        .from("bookings")
        .select(`
      id, booking_ref, checkin, checkout, num_adults, num_children,
      status, source, total_amount, created_at, room_id,
      guests!guest_id(name, email),
      rooms!room_id(id, name, slug)
    `)
        .order(column, { ascending });
    query = applyFilters(query, params, guestIds, today);
    const { data } = await query;
    return (data ?? []).map(mapRow);
}
export async function getBookingsStats(params, guestIds) {
    const supabase = createAdminClient();
    const today = new Date().toISOString().split("T")[0];
    let query = supabase
        .from("bookings")
        .select("total_amount, checkin, checkout, status");
    query = applyFilters(query, params, guestIds, today);
    const { data } = await query;
    const rows = (data ?? []);
    let totalRevenue = 0;
    let totalNights = 0;
    for (const row of rows) {
        if (row.status !== "CANCELLED" && row.status !== "NO_SHOW") {
            totalRevenue += row.total_amount;
            totalNights += computeNights(row.checkin, row.checkout);
        }
    }
    return {
        total: rows.length,
        totalRevenue,
        totalNights,
        adr: totalNights > 0 ? Math.round(totalRevenue / totalNights) : 0,
    };
}
