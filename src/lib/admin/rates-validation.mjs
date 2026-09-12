// @ts-check
/**
 * Validation for the Rates & Rules form.
 *
 * Deliberately NOT beside the database reads in rates.js: that module is
 * server-only, and this runs in the browser too. The form calls it so a staff
 * member sees the problem before the round trip, and the API route calls it
 * again because the form is a convenience and the route is the boundary.
 *
 * Every rule here is also a database CHECK constraint. That duplication is
 * intentional — the constraint is what actually protects the data, and this is
 * what produces a sentence a person can act on instead of a Postgres error.
 */

/**
 * Field-level validation, shared by the API route and the client form.
 *
 * Returns a list of human messages rather than throwing on the first problem,
 * so a staff member fixing a form sees everything wrong with it at once.
 *
 * Every rule here is also a database CHECK constraint. That duplication is
 * deliberate: the constraint is what actually protects the data, and this is
 * what produces a sentence a person can act on instead of a Postgres error.
 */
export function validateRatePayload(kind, body) {
  const errors = [];
  const positive = (value, label) => {
    const n = Number(value);
    if (value === null || value === undefined || value === "" || !Number.isFinite(n)) {
      errors.push(`${label} is required`);
    } else if (n <= 0) {
      errors.push(`${label} must be more than zero`);
    }
  };
  const nonNegative = (value, label) => {
    const n = Number(value);
    if (value === null || value === undefined || value === "" || !Number.isFinite(n)) {
      errors.push(`${label} is required`);
    } else if (n < 0) {
      errors.push(`${label} cannot be negative`);
    }
  };

  if (kind === "room_rate") {
    positive(body.regular_rate, "Regular rate");
    positive(body.peak_rate, "Peak rate");
    if (!body.room_slug) errors.push("Room is required");
    if (
      Number.isFinite(Number(body.peak_rate)) &&
      Number.isFinite(Number(body.regular_rate)) &&
      Number(body.peak_rate) < Number(body.regular_rate)
    ) {
      errors.push("Peak rate is below the regular rate — check before saving");
    }
  }

  if (kind === "gst") {
    nonNegative(body.threshold, "GST threshold");
    nonNegative(body.rate_low, "Lower GST rate");
    nonNegative(body.rate_high, "Higher GST rate");
    if (Number(body.rate_high) < Number(body.rate_low)) {
      errors.push("The higher GST rate must not be below the lower one");
    }
    if (Number(body.rate_low) > 100 || Number(body.rate_high) > 100) {
      errors.push("GST rates are percentages and cannot exceed 100");
    }
  }

  if (kind === "occupancy") {
    nonNegative(body.extra_adult_rate, "Extra adult rate");
    nonNegative(body.child_rate, "Child rate");
    nonNegative(body.extra_bedding_rate, "Extra bedding rate");
    nonNegative(body.infant_rate, "Infant rate");
    nonNegative(body.infant_max_age, "Infant maximum age");
    nonNegative(body.child_max_age, "Child maximum age");
    if (Number(body.child_max_age) <= Number(body.infant_max_age)) {
      errors.push("Child age must be above the infant age");
    }
    positive(body.default_adults_included, "Adults included");
    positive(body.default_max_adults, "Maximum adults");
    if (Number(body.default_max_adults) < Number(body.default_adults_included)) {
      errors.push("Maximum adults cannot be below the adults already included");
    }
  }

  if (kind === "season") {
    if (!body.label || !String(body.label).trim()) errors.push("Label is required");
    if (!["peak", "blackout"].includes(body.kind)) errors.push("Season type is invalid");
    if (body.is_recurring) {
      for (const [f, label] of [
        ["start_month", "Start month"],
        ["start_day", "Start day"],
        ["end_month", "End month"],
        ["end_day", "End day"],
      ]) {
        const n = Number(body[f]);
        if (!Number.isFinite(n) || n < 1) errors.push(`${label} is required`);
      }
      if (Number(body.start_month) > 12 || Number(body.end_month) > 12) {
        errors.push("Months must be between 1 and 12");
      }
      if (Number(body.start_day) > 31 || Number(body.end_day) > 31) {
        errors.push("Days must be between 1 and 31");
      }
    } else {
      if (!body.start_date) errors.push("Start date is required");
      if (!body.end_date) errors.push("End date is required");
      if (body.start_date && body.end_date && body.end_date < body.start_date) {
        errors.push("End date is before the start date");
      }
    }
  }

  if (kind === "long_stay") {
    const rate = Number(body.discount_rate);
    if (!Number.isFinite(rate) || rate < 0 || rate >= 1) {
      errors.push("Discount must be between 0 and 99%");
    }
    const min = Number(body.min_nights);
    if (!Number.isFinite(min) || min < 1) errors.push("Minimum nights must be at least 1");
  }

  return errors;
}
