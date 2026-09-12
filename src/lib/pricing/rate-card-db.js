import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { rateCardFromRows, DEFAULT_RATE_CARD } from "@/lib/pricing/rate-card.mjs";

/**
 * Loads the live rate card from the database.
 *
 * Every read is individually optional. A table that does not exist yet, a query
 * that errors, or a table that is simply empty all resolve to "no override",
 * and rateCardFromRows falls back to config.mjs for that part of the card. That
 * is the property that makes the migration safe to apply in either order: code
 * deployed before the SQL quotes at the shipped rates rather than 500ing, and
 * SQL applied before the code changes nothing at all.
 *
 * Postgres error 42P01 is "relation does not exist" — the pre-migration state.
 */
const UNDEFINED_TABLE = "42P01";

/** Rows, or null when the table is absent/unreadable. Never throws. */
async function safeSelect(supabase, table, columns = "*") {
  try {
    const { data, error } = await supabase.from(table).select(columns);
    if (error) {
      if (error.code === UNDEFINED_TABLE) return null;
      console.error(`[rate-card] ${table}:`, error.message);
      return null;
    }
    return data ?? [];
  } catch (err) {
    console.error(`[rate-card] ${table}:`, err);
    return null;
  }
}

async function safeSingleton(supabase, table) {
  const rows = await safeSelect(supabase, table);
  if (rows === null) return null;
  return rows.find((r) => r.id === "singleton") ?? rows[0] ?? null;
}

/**
 * The rate card as the database currently holds it, offers included.
 *
 * `includeOffers` is false for anything that only needs rates — the admin rate
 * screen, the public tariff table — so those paths do not pay for a query they
 * will not read.
 */
export async function loadRateCard({ includeOffers = true } = {}) {
  const supabase = createAdminClient();

  const [roomRates, gstRules, occupancyRules, seasons, longStayRules, offers] = await Promise.all([
    safeSelect(supabase, "room_rates"),
    safeSingleton(supabase, "gst_rules"),
    safeSingleton(supabase, "occupancy_rules"),
    safeSelect(supabase, "pricing_seasons"),
    safeSingleton(supabase, "long_stay_rules"),
    includeOffers ? safeSelect(supabase, "offers") : Promise.resolve(null),
  ]);

  return rateCardFromRows({
    roomRates,
    gstRules,
    occupancyRules,
    seasons,
    longStayRules,
    // Only live offers reach the engine. An inactive one still competes for
    // nothing, but filtering here keeps the engine's candidate list to what a
    // guest could actually have been given.
    offers: (offers ?? []).filter((o) => o.is_active),
  });
}

/** Offers as stored, active and inactive, for the admin screen. */
export async function loadAllOffers() {
  const supabase = createAdminClient();
  const rows = await safeSelect(supabase, "offers");
  return rows ?? [];
}

export { DEFAULT_RATE_CARD };
