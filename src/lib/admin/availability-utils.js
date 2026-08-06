// Pure utilities — no server-only, safe to import in Client Components
// Computes the display state for a single room × day cell.
// Per architect decision: a single manual_blocks row blocks the whole room type.
export function computeCellState(room, date, // YYYY-MM-DD
bookings, blocks) {
    const dayBlocks = blocks.filter((b) => b.room_id === room.id && b.date_from <= date && date < b.date_to);
    const dayBookings = bookings.filter((b) => b.room_id === room.id && b.checkin <= date && date < b.checkout);
    if (dayBlocks.length > 0) {
        return {
            state: "blocked",
            occupied: dayBookings.length,
            blocked: room.inventory_count,
            bookings: dayBookings,
            blocks: dayBlocks,
        };
    }
    const occupied = dayBookings.length;
    const ratio = room.inventory_count > 0 ? occupied / room.inventory_count : 0;
    const isCheckInDay = dayBookings.some((b) => b.checkin === date);
    if (ratio >= 1.0) {
        return { state: "fully-booked", occupied, blocked: 0, bookings: dayBookings, blocks: [] };
    }
    if (isCheckInDay) {
        return { state: "check-in", occupied, blocked: 0, bookings: dayBookings, blocks: [] };
    }
    if (ratio > 0) {
        return { state: "partial", occupied, blocked: 0, bookings: dayBookings, blocks: [] };
    }
    return { state: "available", occupied: 0, blocked: 0, bookings: [], blocks: [] };
}
