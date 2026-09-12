// Pure inventory arithmetic — no server-only, so the admin calendar and the
// booking API can share one definition of "how many units are left".

/** Booking statuses that can hold a unit, before payment is considered. */
export const OCCUPYING_STATUSES = ["CONFIRMED", "CHECKED_IN"];

/**
 * Payment states that count as money received.
 *
 * "partial" is included deliberately: the online flow takes a 50% advance and
 * marks the booking partial, and a guest who has paid half has certainly bought
 * the room. Only "pending" — nothing received — fails to hold inventory.
 */
export const PAID_PAYMENT_STATUSES = ["paid", "partial"];

/**
 * Whether one booking row holds a unit against availability.
 *
 * The rule is now money, not just status. A booking that is CONFIRMED but
 * unpaid — an abandoned online attempt, or a walk-in entered ahead of payment —
 * used to take the room off sale indefinitely and quietly cost the property
 * inventory it could have sold. Only a paid or part-paid booking blocks; a
 * manual block is the tool for holding a room without payment.
 *
 * The row itself is untouched either way. Nothing here deletes or hides a
 * booking; it stays in the admin list, it simply stops closing the calendar.
 *
 * A row with no payment_status at all — an older booking, or a projection that
 * did not select the column — is treated as paid. That is the safe direction:
 * it can only withhold a room, never double-sell one.
 */
export function occupiesInventory(booking) {
  if (!booking) return false;
  if (!OCCUPYING_STATUSES.includes(booking.status)) return false;
  if (booking.payment_status === undefined || booking.payment_status === null) return true;
  return PAID_PAYMENT_STATUSES.includes(String(booking.payment_status).toLowerCase());
}

/**
 * How many units one manual block holds.
 *
 * `units_blocked: null` marks a row written before per-unit blocking existed,
 * when a single row meant the whole room type; those keep that meaning. The
 * clamp stops a block written when the room had more units — or a hand-edited
 * row — from driving availability negative.
 */
export function blockedUnitsFor(block, inventoryCount) {
    const inventory = Math.max(inventoryCount ?? 1, 1);
    if (block.units_blocked == null)
        return inventory;
    return Math.min(Math.max(block.units_blocked, 1), inventory);
}

/** Units held by every block belonging to `roomId`, capped at its inventory. */
export function totalBlockedUnits(blocks, roomId, inventoryCount) {
    const inventory = Math.max(inventoryCount ?? 1, 1);
    const total = blocks
        .filter((b) => b.room_id === roomId)
        .reduce((sum, b) => sum + blockedUnitsFor(b, inventory), 0);
    return Math.min(total, inventory);
}

/**
 * Units still sellable.
 *
 * Clamped at zero: an overbooked room type reports "none left" rather than a
 * negative count a caller might go on to subtract from.
 */
export function availableUnits({ inventoryCount, bookedUnits, blockedUnits }) {
    const inventory = Math.max(inventoryCount ?? 1, 1);
    return Math.max(0, inventory - bookedUnits - blockedUnits);
}

/**
 * A stay of more than about a year is not a real request, and the night loop
 * below is driven by caller-supplied dates. Longer spans fall back to counting
 * the whole range at once, which can only understate availability.
 */
const MAX_NIGHTS = 400;

/** Each night in [checkIn, checkOut), as YYYY-MM-DD. UTC, so DST cannot skew it. */
export function eachNight(checkIn, checkOut) {
    const nights = [];
    const end = Date.parse(`${checkOut}T00:00:00Z`);
    for (let t = Date.parse(`${checkIn}T00:00:00Z`); t < end && nights.length < MAX_NIGHTS; t += 86400000) {
        nights.push(new Date(t).toISOString().slice(0, 10));
    }
    return nights;
}

/**
 * Units free on the tightest night of a stay.
 *
 * Counting the whole range in one go would count three consecutive one-night
 * bookings as three units gone, when they are the same unit turning over and a
 * four-tent room type still has three free every night. A stay is bookable when
 * every night it covers has a unit free, so the answer is the per-night minimum.
 */
export function minAvailableUnits({ inventoryCount, checkIn, checkOut, bookings, blocks, roomId }) {
    const inventory = Math.max(inventoryCount ?? 1, 1);
    const nights = eachNight(checkIn, checkOut);
    if (nights.length === 0)
        return inventory;
    let min = inventory;
    for (const night of nights) {
        const occupied = bookings.filter(
      (b) => b.checkin <= night && night < b.checkout && occupiesInventory(b),
    ).length;
        const nightBlocks = blocks.filter((b) => b.date_from <= night && night < b.date_to);
        const blocked = totalBlockedUnits(nightBlocks, roomId, inventory);
        min = Math.min(min, availableUnits({ inventoryCount: inventory, bookedUnits: occupied, blockedUnits: blocked }));
        if (min === 0)
            break;
    }
    return min;
}
