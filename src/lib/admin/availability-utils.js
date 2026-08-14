// Pure utilities — no server-only, safe to import in Client Components
import { blockedUnitsFor, totalBlockedUnits } from "@/lib/booking/block-units";
// Re-exported so the calendar can label an individual block without reaching
// past this module for it.
export { blockedUnitsFor };

/**
 * Display state for a single room × day cell.
 *
 * A block no longer implies the whole room type is gone — it holds however many
 * units it was written for. So the state comes from what is left over:
 * available (all free) → partial (some free) → fully-booked (none free),
 * with "blocked" reserved for a day closed out entirely by manual blocks.
 */
export function computeCellState(room, date, // YYYY-MM-DD
bookings, blocks) {
    const inventory = Math.max(room.inventory_count ?? 1, 1);
    const dayBlocks = blocks.filter((b) => b.room_id === room.id && b.date_from <= date && date < b.date_to);
    const dayBookings = bookings.filter((b) => b.room_id === room.id && b.checkin <= date && date < b.checkout);
    const occupied = dayBookings.length;
    const blocked = totalBlockedUnits(dayBlocks, room.id, inventory);
    const available = Math.max(0, inventory - occupied - blocked);
    const base = { occupied, blocked, available, inventory, bookings: dayBookings, blocks: dayBlocks };
    if (available === 0) {
        // Nothing left either way; the label follows whichever cause closed it, so
        // a maintenance closure does not read as a sold-out night.
        return { ...base, state: blocked >= inventory ? "blocked" : "fully-booked" };
    }
    if (dayBookings.some((b) => b.checkin === date)) {
        return { ...base, state: "check-in" };
    }
    if (occupied > 0 || blocked > 0) {
        return { ...base, state: "partial" };
    }
    return { ...base, state: "available" };
}
