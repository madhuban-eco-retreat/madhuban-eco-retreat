import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { startOfMonth, endOfMonth, startOfDay, eachDayOfInterval, format, addDays, nextSaturday, isSaturday, isSunday, } from "date-fns";
// ─── Helpers ──────────────────────────────────────────────────────────────────
const ACTIVE_STATUSES = ["CONFIRMED", "CHECKED_IN", "CHECKED_OUT"];
const REVENUE_STATUSES = ["CONFIRMED", "CHECKED_IN", "CHECKED_OUT", "PENDING_PAYMENT"];
function toIso(d) {
    return format(d, "yyyy-MM-dd");
}
// Count bookings that overlap a given date (checkin <= date < checkout)
function countOverlapping(bookings, date, roomId) {
    return bookings.filter((b) => b.checkin <= date &&
        b.checkout > date &&
        (roomId === undefined || b.room_id === roomId)).length;
}
// ─── Parallel fetches ─────────────────────────────────────────────────────────
export async function fetchDashboardData(now = new Date()) {
    const supabase = createAdminClient();
    const today = toIso(now);
    const monthStart = toIso(startOfMonth(now));
    const monthEnd = toIso(endOfMonth(now));
    const lastMonthStart = toIso(startOfMonth(new Date(now.getFullYear(), now.getMonth() - 1, 1)));
    const lastMonthEnd = toIso(endOfMonth(new Date(now.getFullYear(), now.getMonth() - 1, 1)));
    // Fetch all rooms and current-month bookings in parallel
    const [roomsResult, monthBookingsResult, recentBookingsResult, pendingCountResult] = await Promise.all([
        supabase
            .from("rooms")
            .select("id, name, slug, is_active, inventory_count")
            .eq("is_active", true)
            .order("sort_order", { ascending: true }),
        supabase
            .from("bookings")
            .select(`
          id, booking_ref, checkin, checkout, status, total_amount,
          num_adults, num_children, created_at, room_id,
          guests!guest_id ( name, email ),
          rooms!room_id ( name, slug )
        `)
            .not("status", "in", '("CANCELLED","NO_SHOW")')
            .lte("checkin", monthEnd)
            .gt("checkout", monthStart),
        supabase
            .from("bookings")
            .select(`
          id, booking_ref, checkin, checkout, status, total_amount,
          num_adults, num_children, created_at, room_id,
          guests!guest_id ( name, email ),
          rooms!room_id ( name, slug )
        `)
            .order("created_at", { ascending: false })
            .limit(5),
        supabase
            .from("bookings")
            .select("id", { count: "exact", head: true })
            .eq("status", "PENDING_PAYMENT"),
    ]);
    const rooms = (roomsResult.data ?? []);
    const monthBookings = (monthBookingsResult.data ?? []);
    const recentBookings = (recentBookingsResult.data ?? []);
    const pendingCount = pendingCountResult.count ?? 0;
    const totalInventory = rooms.reduce((sum, r) => sum + r.inventory_count, 0);
    // ── Stat Card 1: Tonight's check-ins + in-house ──────────────────────────
    const tonightCheckins = monthBookings.filter((b) => b.checkin === today && b.status === "CONFIRMED").length;
    const inHouseCount = monthBookings.filter((b) => b.status === "CHECKED_IN").length;
    // ── Stat Card 2: Revenue this month vs last month ─────────────────────────
    const thisMonthRevenue = monthBookings
        .filter((b) => b.created_at >= `${monthStart}T00:00:00` &&
        b.created_at < `${monthEnd}T23:59:59` &&
        REVENUE_STATUSES.includes(b.status))
        .reduce((sum, b) => sum + Number(b.total_amount), 0);
    // Fetch last-month revenue separately (different date range)
    const { data: lastMonthData } = await supabase
        .from("bookings")
        .select("total_amount, status")
        .not("status", "in", '("CANCELLED","NO_SHOW")')
        .gte("created_at", `${lastMonthStart}T00:00:00`)
        .lte("created_at", `${lastMonthEnd}T23:59:59`);
    const lastMonthRevenue = (lastMonthData ?? []).reduce((sum, b) => sum + Number(b.total_amount), 0);
    // ── Stat Card 3: Monthly occupancy + today's free rooms ──────────────────
    const daysUpToToday = eachDayOfInterval({
        start: startOfMonth(now),
        end: startOfDay(now),
    });
    const dailyOccupancies = daysUpToToday.map((day) => {
        const dayStr = toIso(day);
        const occupied = countOverlapping(monthBookings, dayStr);
        return totalInventory > 0 ? occupied / totalInventory : 0;
    });
    const monthlyOccupancyPct = dailyOccupancies.length > 0
        ? Math.round((dailyOccupancies.reduce((a, b) => a + b, 0) / dailyOccupancies.length) * 100)
        : 0;
    const todayOccupied = countOverlapping(monthBookings, today);
    const todayFreeRooms = Math.max(0, totalInventory - todayOccupied);
    // ── Room availability tonight (per room) ─────────────────────────────────
    const roomAvailability = rooms.map((room) => ({
        id: room.id,
        name: room.name,
        inventory: room.inventory_count,
        occupied: countOverlapping(monthBookings.filter((b) => ACTIVE_STATUSES.slice(0, 2).includes(b.status)), today, room.id),
    }));
    // ── Calendar heatmap for current month ───────────────────────────────────
    const firstOfMonth = startOfMonth(now);
    const lastOfMonth = endOfMonth(now);
    const allDays = eachDayOfInterval({ start: firstOfMonth, end: lastOfMonth });
    const calendarDays = allDays.map((day) => {
        const dayStr = toIso(day);
        const occupied = countOverlapping(monthBookings, dayStr);
        return {
            date: dayStr,
            occupancyPct: totalInventory > 0 ? Math.round((occupied / totalInventory) * 100) : 0,
            isToday: dayStr === today,
            isCurrentMonth: true,
        };
    });
    // ── Weekend occupancy alert ───────────────────────────────────────────────
    let weekendAlert = null;
    if (totalInventory > 0) {
        // Find next Saturday (skip current day if it's a weekend — use next weekend)
        let sat;
        if (isSaturday(now)) {
            sat = addDays(now, 7);
        }
        else if (isSunday(now)) {
            sat = addDays(now, 6);
        }
        else {
            sat = nextSaturday(now);
        }
        const sun = addDays(sat, 1);
        const satStr = toIso(sat);
        const sunStr = toIso(sun);
        // Need weekend bookings — fetch if not in monthBookings range
        const weekendBookings = satStr >= monthStart && sunStr <= monthEnd
            ? monthBookings
            : await fetchWeekendBookings(supabase, satStr, sunStr);
        const satOccupied = countOverlapping(weekendBookings.filter((b) => ["CONFIRMED", "CHECKED_IN"].includes(b.status)), satStr);
        const sunOccupied = countOverlapping(weekendBookings.filter((b) => ["CONFIRMED", "CHECKED_IN"].includes(b.status)), sunStr);
        const avgWeekendPct = Math.round(((satOccupied + sunOccupied) / (totalInventory * 2)) * 100);
        if (avgWeekendPct >= 90) {
            weekendAlert = { saturday: satStr, sunday: sunStr, pct: avgWeekendPct };
        }
    }
    return {
        stats: {
            tonightCheckins,
            inHouseCount,
            thisMonthRevenue,
            lastMonthRevenue,
            monthlyOccupancyPct,
            todayFreeRooms,
            pendingCount,
            totalInventory,
        },
        recentBookings,
        roomAvailability,
        calendarDays,
        weekendAlert,
        currentMonth: format(now, "MMMM yyyy"),
        calendarStartDow: firstOfMonth.getDay(), // 0=Sun for grid offset
    };
}
async function fetchWeekendBookings(
// eslint-disable-next-line @typescript-eslint/no-explicit-any
supabase, satStr, sunStr) {
    const { data } = await supabase
        .from("bookings")
        .select("id, checkin, checkout, status, room_id")
        .not("status", "in", '("CANCELLED","NO_SHOW")')
        .lte("checkin", sunStr)
        .gt("checkout", satStr);
    return (data ?? []);
}
// ─── Formatters (shared with UI) ─────────────────────────────────────────────
export function formatIndianCurrency(amount) {
    if (amount >= 100_000) {
        const lakhs = amount / 100_000;
        return `₹${lakhs % 1 === 0 ? lakhs.toFixed(0) : lakhs.toFixed(1)}L`;
    }
    return `₹${amount.toLocaleString("en-IN")}`;
}
export function revenueDirection(current, last) {
    if (last === 0)
        return { pct: 0, direction: "neutral" };
    const pct = Math.round(((current - last) / last) * 100);
    return {
        pct: Math.abs(pct),
        direction: pct > 0 ? "up" : pct < 0 ? "down" : "neutral",
    };
}
export function bookingStatusVariant(status) {
    switch (status) {
        case "CONFIRMED": return "confirmed";
        case "CHECKED_IN": return "info";
        case "PENDING_PAYMENT": return "pending";
        case "CANCELLED":
        case "NO_SHOW": return "cancelled";
        default: return "neutral";
    }
}
export function bookingStatusLabel(status) {
    const map = {
        PENDING_PAYMENT: "Pending",
        CONFIRMED: "Confirmed",
        CHECKED_IN: "Checked In",
        CHECKED_OUT: "Checked Out",
        CANCELLED: "Cancelled",
        NO_SHOW: "No-Show",
    };
    return map[status] ?? status;
}
export function initialsFromName(name) {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1)
        return (parts[0]?.[0] ?? "?").toUpperCase();
    return ((parts[0]?.[0] ?? "") + (parts[parts.length - 1]?.[0] ?? "")).toUpperCase();
}
export function avatarColor(name) {
    const colors = [
        "bg-[#E8D5B7] text-[#6E6146]",
        "bg-[#D4E8D7] text-[#2D5A35]",
        "bg-[#D7DCE8] text-[#2D3B6E]",
        "bg-[#E8D7DC] text-[#6E2D3A]",
        "bg-[#E8E4D7] text-[#5A4B2D]",
        "bg-[#D7E8E4] text-[#2D5A52]",
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++)
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length] ?? colors[0];
}
export function formatCheckinDate(iso) {
    return new Date(iso + "T00:00:00").toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
    });
}
