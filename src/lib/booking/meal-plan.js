// @ts-check
/**
 * Reading and recording a booking's meal plan.
 *
 * A booking's meal plan lives in two places on purpose. The `meal_plan` column
 * is the record; the staff note `Meal plan: MAP (...)` in `internal_notes` is
 * the safety net. The column ships in a SQL migration, and a deploy that lands
 * before the migration runs must not lose the plan a guest chose — nor leave an
 * invoice unable to tell whether a booking was priced on the meal-plan tariff.
 * Everything that needs the plan asks `resolveBookingMealPlan`, which reads the
 * column and falls back to the note.
 *
 * A booking with neither predates the meal-plan tariff. That is `null`, and
 * null is meaningful: it prices under the legacy regime (no meal supplement,
 * bedding-only extra-guest rates), so an invoice raised today for a stay sold
 * last month reproduces what the guest actually paid.
 *
 * Rooms with no published tariff (the camping tent) never get a plan.
 */

import { MEAL_PLANS, DEFAULT_MEAL_PLAN } from "@/lib/pricing/config.mjs";
import { hasTariff } from "@/lib/pricing/rate-card.mjs";

const NOTE_PREFIX = "Meal plan:";
const NOTE_RE = /Meal plan:\s*(MAP|AP)\b/;

/**
 * The plan a new booking for `roomSlug` should be priced on.
 *
 * `requested` is whatever the guest or admin chose (possibly undefined). A room
 * that is not on the tariff sheet gets null regardless: camping is sold per
 * person with food included and has no meal supplement to add.
 */
export function planForRoom(roomSlug, requested) {
  if (!hasTariff(roomSlug)) return null;
  const plan = requested ?? DEFAULT_MEAL_PLAN;
  if (!Object.prototype.hasOwnProperty.call(MEAL_PLANS, plan)) {
    throw new Error("Unknown meal plan");
  }
  return plan;
}

/** "Meal plan: MAP (Breakfast, lunch/dinner)" — the note stored beside the column. */
export function mealPlanNote(plan) {
  if (!plan) return null;
  return `${NOTE_PREFIX} ${plan} (${MEAL_PLANS[plan].includes})`;
}

/** The plan recorded on a booking row: column first, staff note second, else null. */
export function resolveBookingMealPlan(booking) {
  const fromColumn = booking?.meal_plan;
  if (fromColumn && Object.prototype.hasOwnProperty.call(MEAL_PLANS, fromColumn)) {
    return fromColumn;
  }
  const match = NOTE_RE.exec(String(booking?.internal_notes ?? ""));
  return match ? match[1] : null;
}

/**
 * The plan a booking was sold on, as the three fields a confirmation needs:
 * { mealPlan, mealPlanLabel, mealPlanIncludes } — all null for a legacy booking
 * or a room with no plan, so a template can simply skip the row.
 */
export function mealPlanFacts(booking) {
  const plan = resolveBookingMealPlan(booking);
  return plan
    ? {
        mealPlan: plan,
        mealPlanLabel: MEAL_PLANS[plan].label,
        mealPlanIncludes: MEAL_PLANS[plan].includes,
      }
    : { mealPlan: null, mealPlanLabel: null, mealPlanIncludes: null };
}

/** Joins the staff notes a booking is created with, or null when there are none. */
export function joinInternalNotes(...parts) {
  const joined = parts.filter(Boolean).join(" · ");
  return joined || null;
}

/**
 * True when an insert failed because the meal_plan column does not exist yet —
 * either Postgres ("column does not exist") or PostgREST ("could not find the
 * column in the schema cache"). The caller retries without the column.
 */
export function isMissingMealPlanColumn(error) {
  if (!error) return false;
  return (
    error.code === "42703" ||
    error.code === "PGRST204" ||
    /meal_plan/i.test(String(error.message ?? ""))
  );
}
