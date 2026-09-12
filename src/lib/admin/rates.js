import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { DEFAULT_RATE_CARD } from "@/lib/pricing/rate-card.mjs";

// Re-exported so server callers have one import for the whole module.
export { validateRatePayload } from "@/lib/admin/rates-validation.mjs";

/**
 * Reads and writes for the Rates & Rules screen.
 *
 * Separate from rate-card-db.js, which builds the card the ENGINE prices with.
 * This module serves the admin form, and the difference matters: the form needs
 * the raw rows, including inactive ones and including whether a row exists at
 * all, so it can tell "the admin set this to 9000" apart from "nobody has ever
 * set this and it is falling back to config".
 */

/** Postgres "relation does not exist" — migration not applied yet. */
const UNDEFINED_TABLE = "42P01";

async function select(table, order) {
  const supabase = createAdminClient();
  let q = supabase.from(table).select("*");
  if (order) q = q.order(order, { ascending: true });
  const { data, error } = await q;
  if (error) {
    if (error.code === UNDEFINED_TABLE) return { rows: [], missing: true };
    throw new Error(`${table}: ${error.message}`);
  }
  return { rows: data ?? [], missing: false };
}

/**
 * Everything the Rates & Rules screen renders, in one round trip.
 *
 * `migrationPending` is surfaced rather than thrown on: an admin who opens this
 * page before the SQL has run should be told so plainly, not shown an error
 * page or — worse — an empty form that looks editable and silently saves
 * nothing.
 */
export async function getRatesAndRules() {
  const [rates, gst, occupancy, seasons, longStay] = await Promise.all([
    select("room_rates", "sort_order"),
    select("gst_rules"),
    select("occupancy_rules"),
    select("pricing_seasons", "sort_order"),
    select("long_stay_rules"),
  ]);

  const migrationPending =
    rates.missing || gst.missing || occupancy.missing || seasons.missing || longStay.missing;

  return {
    migrationPending,
    roomRates: rates.rows,
    gstRules: gst.rows[0] ?? null,
    occupancyRules: occupancy.rows[0] ?? null,
    seasons: seasons.rows,
    longStayRules: longStay.rows[0] ?? null,
    // The shipped values, so the form can show what a missing row falls back to.
    defaults: {
      gst: DEFAULT_RATE_CARD.gst,
      occupancy: DEFAULT_RATE_CARD.occupancy,
      longStay: DEFAULT_RATE_CARD.longStay,
      baseRates: DEFAULT_RATE_CARD.baseRates,
      peakSurchargeRate: DEFAULT_RATE_CARD.peakSurchargeRate,
    },
  };
}
