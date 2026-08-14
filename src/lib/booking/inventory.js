import "server-only";

/**
 * Database side of inventory availability.
 *
 * Every room type used to behave as if it had exactly one unit: one overlapping
 * booking, or one manual block, closed the whole type. Safari Tent has two units
 * and Glamping Tent has four, so both rules undersold badly — blocking one tent
 * for maintenance took all four off the market.
 *
 * The rule now is arithmetic: available = inventory − booked − blocked. The
 * arithmetic itself lives in ./block-units so the admin calendar, which runs in
 * the browser, can apply the identical rule.
 */
export { OCCUPYING_STATUSES, availableUnits, blockedUnitsFor, minAvailableUnits, totalBlockedUnits, } from "@/lib/booking/block-units";

const BLOCK_COLUMNS = "id, room_id, date_from, date_to, reason, notes, created_at, created_by, units_blocked";
// Column list as it stood before the units_blocked migration.
const BLOCK_COLUMNS_LEGACY = "id, room_id, date_from, date_to, reason, notes, created_at, created_by";

/** Postgres "column does not exist" — the migration has not been applied yet. */
const UNDEFINED_COLUMN = "42703";

/**
 * Manual blocks overlapping [from, to). Ranges [A,B) and [C,D) overlap when
 * A < D AND B > C.
 *
 * units_blocked ships in a separate SQL migration, so a deploy landing before
 * that migration runs would otherwise 500 every price quote and availability
 * check on the public site. The retry keeps those paths alive on the old schema
 * by reading such rows as `units_blocked: null`, which resolves to the room's
 * full inventory — the pre-migration meaning, and the safe direction to be wrong
 * in, since it can only withhold units rather than oversell them.
 */
export async function fetchOverlappingBlocks(supabase, { from, to, roomId }) {
    function query(columns) {
        let q = supabase.from("manual_blocks").select(columns).lt("date_from", to).gt("date_to", from);
        if (roomId)
            q = q.eq("room_id", roomId);
        return q;
    }
    let { data, error } = await query(BLOCK_COLUMNS);
    if (error?.code === UNDEFINED_COLUMN) {
        ({ data, error } = await query(BLOCK_COLUMNS_LEGACY));
        if (error)
            throw new Error(error.message);
        return (data ?? []).map((b) => ({ ...b, units_blocked: null }));
    }
    if (error)
        throw new Error(error.message);
    return (data ?? []).map((b) => ({
        ...b,
        units_blocked: typeof b.units_blocked === "number" ? b.units_blocked : null,
    }));
}
