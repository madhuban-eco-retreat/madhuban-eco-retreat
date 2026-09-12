// @ts-check
/**
 * Day one must be a no-op.
 *
 * The migration seeds the rate tables from the values config.mjs already holds,
 * so applying it must not move a single price. That claim is worth a test
 * rather than a promise: it is the difference between a rate screen that is
 * safe to hand over and one that silently reprices the whole tariff the moment
 * the SQL runs.
 *
 * The seeds are parsed out of the migration FILE, not re-typed here. Re-typing
 * them would only prove that two copies of my own assumption agree; reading the
 * file proves that what will actually be executed against the database
 * reproduces the shipped rate card.
 */

import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import { rateCardFromRows, DEFAULT_RATE_CARD } from "./rate-card.mjs";
import { computeStayQuote } from "./quote.mjs";
import { BASE_NIGHTLY_RATES, ROOM_CATEGORIES } from "./config.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const MIGRATION = join(HERE, "../../../supabase/migrations/20260912_admin_rates_offers.sql");

const sql = readFileSync(MIGRATION, "utf8");

/* -- parse the seeds out of the migration ---------------------------------- */

/** Every `(...)` tuple inside the VALUES list that follows `marker`. */
function tuplesAfter(marker) {
  const start = sql.indexOf(marker);
  if (start === -1) throw new Error(`Migration marker not found: ${marker}`);
  const tail = sql.slice(start);

  // The VALUES list ends at the statement terminator, but several clauses that
  // follow it carry parentheses of their own — ON CONFLICT (col), the AS seed
  // alias, WHERE NOT EXISTS (...). Those are not seed tuples, so the block is
  // cut at whichever comes first.
  const end = Math.min(
    ...[";", "ON CONFLICT", "AS seed(", "WHERE NOT EXISTS"]
      .map((token) => tail.indexOf(token))
      .filter((i) => i !== -1),
  );
  const block = tail.slice(0, end);
  const values = block.slice(block.search(/VALUES/i));
  return [...values.matchAll(/\(([^()]*)\)/g)].map((m) =>
    m[1].split(",").map((v) => v.trim().replace(/^'(.*)'$/, "$1").replace(/^DATE\s+'(.*)'$/, "$1")),
  );
}

const roomRateSeeds = tuplesAfter("INSERT INTO room_rates").map(
  ([room_slug, label, regular_rate, peak_rate, sort_order]) => ({
    room_slug,
    label,
    regular_rate: Number(regular_rate),
    peak_rate: Number(peak_rate),
    sort_order: Number(sort_order),
    is_active: true,
  }),
);

const [gstSeed] = tuplesAfter("INSERT INTO gst_rules").map(([, threshold, rate_low, rate_high]) => ({
  threshold: Number(threshold),
  rate_low: Number(rate_low),
  rate_high: Number(rate_high),
}));

const [occSeed] = tuplesAfter("INSERT INTO occupancy_rules").map(
  ([
    ,
    extra_adult_rate,
    child_rate,
    infant_rate,
    extra_bedding_rate,
    infant_max_age,
    child_max_age,
    default_adults_included,
    default_max_adults,
  ]) => ({
    extra_adult_rate: Number(extra_adult_rate),
    child_rate: Number(child_rate),
    infant_rate: Number(infant_rate),
    extra_bedding_rate: Number(extra_bedding_rate),
    infant_max_age: Number(infant_max_age),
    child_max_age: Number(child_max_age),
    default_adults_included: Number(default_adults_included),
    default_max_adults: Number(default_max_adults),
  }),
);

const [longStaySeed] = tuplesAfter("INSERT INTO long_stay_rules").map(
  ([, discount_rate, min_nights, applies_on_peak]) => ({
    discount_rate: Number(discount_rate),
    min_nights: Number(min_nights),
    applies_on_peak: applies_on_peak === "false" ? false : applies_on_peak === "true",
    is_active: true,
  }),
);

// The peak row is a SELECT rather than a VALUES tuple, so it is read from the
// literal list in that statement.
const peakSeed = (() => {
  const m = sql.match(
    /SELECT\s+'peak',\s*'([^']+)',\s*true,\s*(\d+),\s*(\d+),\s*(\d+),\s*(\d+),\s*([\d.]+),\s*(\d+)/,
  );
  if (!m) throw new Error("Peak season seed not found in migration");
  return {
    kind: "peak",
    label: m[1],
    is_recurring: true,
    start_month: Number(m[2]),
    start_day: Number(m[3]),
    end_month: Number(m[4]),
    end_day: Number(m[5]),
    surcharge_rate: Number(m[6]),
    is_active: true,
  };
})();

const blackoutSeeds = tuplesAfter("INSERT INTO pricing_seasons (kind, label, is_recurring, start_date")
  .filter((t) => t[0] === "blackout")
  .map(([kind, label, is_recurring, start_date, end_date, sort_order]) => ({
    kind,
    label,
    is_recurring: is_recurring === "true",
    start_date,
    end_date,
    sort_order: Number(sort_order),
    is_active: true,
  }));

/** The rate card exactly as the database will hold it the moment the SQL runs. */
const SEEDED_CARD = rateCardFromRows({
  roomRates: roomRateSeeds,
  gstRules: gstSeed,
  occupancyRules: occSeed,
  seasons: [peakSeed, ...blackoutSeeds],
  longStayRules: longStaySeed,
  offers: [], // the offers table ships empty
});

/* -- the seeds themselves match the shipped config ------------------------- */

test("the migration file seeds every room category at its config rate", () => {
  assert.equal(roomRateSeeds.length, ROOM_CATEGORIES.length);
  for (const seed of roomRateSeeds) {
    assert.equal(
      seed.regular_rate,
      BASE_NIGHTLY_RATES[seed.room_slug],
      `${seed.room_slug} regular rate`,
    );
    // Peak is seeded AT the +20% figure, so the relationship is preserved until
    // someone deliberately breaks it on the screen.
    assert.equal(
      seed.peak_rate,
      Math.round(BASE_NIGHTLY_RATES[seed.room_slug] * DEFAULT_RATE_CARD.peakSurchargeRate),
      `${seed.room_slug} peak rate`,
    );
  }
});

test("the migration file seeds the GST slabs, occupancy and long-stay rules unchanged", () => {
  assert.equal(gstSeed.threshold, DEFAULT_RATE_CARD.gst.threshold);
  assert.equal(gstSeed.rate_low, DEFAULT_RATE_CARD.gst.rateLow);
  assert.equal(gstSeed.rate_high, DEFAULT_RATE_CARD.gst.rateHigh);

  assert.equal(occSeed.extra_adult_rate, DEFAULT_RATE_CARD.occupancy.extraAdultRate);
  assert.equal(occSeed.child_rate, DEFAULT_RATE_CARD.occupancy.childRate);
  assert.equal(occSeed.extra_bedding_rate, DEFAULT_RATE_CARD.occupancy.extraBeddingRate);
  assert.equal(occSeed.infant_max_age, DEFAULT_RATE_CARD.occupancy.infantMaxAge);
  assert.equal(occSeed.child_max_age, DEFAULT_RATE_CARD.occupancy.childMaxAge);
  assert.equal(occSeed.default_adults_included, DEFAULT_RATE_CARD.occupancy.defaultAdultsIncluded);
  assert.equal(occSeed.default_max_adults, DEFAULT_RATE_CARD.occupancy.defaultMaxAdults);

  assert.equal(longStaySeed.discount_rate, DEFAULT_RATE_CARD.longStay.rate);
  assert.equal(longStaySeed.min_nights, DEFAULT_RATE_CARD.longStay.minNights);
  assert.equal(longStaySeed.applies_on_peak, DEFAULT_RATE_CARD.longStay.appliesOnPeak);
});

test("the migration file seeds the same seasons the code ships with", () => {
  assert.equal(peakSeed.surcharge_rate, DEFAULT_RATE_CARD.peakSurchargeRate);
  assert.equal(peakSeed.start_month, DEFAULT_RATE_CARD.recurringPeak.from.month);
  assert.equal(peakSeed.start_day, DEFAULT_RATE_CARD.recurringPeak.from.day);
  assert.equal(peakSeed.end_month, DEFAULT_RATE_CARD.recurringPeak.to.month);
  assert.equal(peakSeed.end_day, DEFAULT_RATE_CARD.recurringPeak.to.day);

  assert.equal(blackoutSeeds.length, DEFAULT_RATE_CARD.blackoutPeriods.length);
  for (const shipped of DEFAULT_RATE_CARD.blackoutPeriods) {
    const seeded = blackoutSeeds.find((b) => b.label === shipped.label);
    assert.ok(seeded, `${shipped.label} is seeded`);
    assert.equal(seeded.start_date, shipped.start, `${shipped.label} start`);
    assert.equal(seeded.end_date, shipped.end, `${shipped.label} end`);
  }
});

/* -- and every quote is identical ------------------------------------------ */

/**
 * The real proof: price the same stays both ways and diff the totals.
 *
 * Every category, regular and peak, one night and three, bare and with an extra
 * adult — the combinations that move the GST slab and the long-stay discount
 * between them.
 */
test("day one is a no-op: every quote matches pre-migration output exactly", () => {
  const REGULAR = "2026-08-10";
  const PEAK = "2026-12-24";
  const BLACKOUT = "2026-11-07";

  const cases = [];
  for (const { slug } of ROOM_CATEGORIES) {
    for (const [season, checkIn] of [["regular", REGULAR], ["peak", PEAK], ["blackout", BLACKOUT]]) {
      for (const nights of [1, 3]) {
        for (const adults of [2, 3]) {
          cases.push({ slug, season, checkIn, nights, adults });
        }
      }
    }
  }

  const diffs = [];
  for (const c of cases) {
    const checkOut = new Date(Date.parse(`${c.checkIn}T00:00:00Z`) + c.nights * 86400000)
      .toISOString()
      .slice(0, 10);

    const args = {
      roomSlug: c.slug,
      checkIn: c.checkIn,
      checkOut,
      adults: c.adults,
    };

    // Pre-migration: the engine reading config.mjs, exactly as it does today.
    const before = computeStayQuote({ ...args, baseNightlyRate: BASE_NIGHTLY_RATES[c.slug] });
    // Post-migration: the engine reading the card the SQL will have created.
    const after = computeStayQuote({ ...args, rateCard: SEEDED_CARD });

    for (const field of [
      "seasonalBaseTotal",
      "longStayDiscountTotal",
      "extraPersonTotal",
      "taxableAmount",
      "gstRate",
      "totalGst",
      "totalAmount",
      "peakNights",
      "blackoutNights",
    ]) {
      if (before[field] !== after[field]) {
        diffs.push(
          `${c.slug} ${c.season} ${c.nights}n ${c.adults}a — ${field}: ${before[field]} -> ${after[field]}`,
        );
      }
    }
  }

  assert.deepEqual(diffs, [], `Migration changes prices:\n${diffs.join("\n")}`);
  // Guard against the comparison silently covering nothing.
  assert.equal(cases.length, ROOM_CATEGORIES.length * 3 * 2 * 2);
  assert.equal(cases.length, 60);
});

test("the offers table ships empty, so no campaign is live on day one", () => {
  assert.match(sql, /No offers are seeded/);
  assert.equal(SEEDED_CARD.offers.length, 0);
});
