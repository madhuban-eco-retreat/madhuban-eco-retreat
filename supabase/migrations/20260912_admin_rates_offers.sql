-- Admin-editable rates, rules and offers
--
-- Until now the rate card lived only in src/lib/pricing/config.mjs, so changing
-- a room price meant a code deploy. These tables move it into the database and
-- behind an admin screen. The engine still falls back to config.mjs for any row
-- that is missing, so a partially-applied migration cannot leave the site
-- unable to quote.
--
-- EVERY table below is seeded with the exact values config.mjs holds today, so
-- applying this migration changes no price. Day one is a no-op by design.
--
-- Run this in the Supabase SQL editor BEFORE deploying the accompanying code.


-- ── 1. Room rates ────────────────────────────────────────────────────────────
-- One row per bookable category, keyed by the slug the rooms table already uses.
--
-- peak_rate is stored, not derived, because the whole point of the screen is
-- that staff can break the +20% relationship for a single category without
-- touching the global surcharge. It is seeded AT the +20% figure, so nothing
-- moves until someone edits it.
CREATE TABLE IF NOT EXISTS room_rates (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_slug      text NOT NULL UNIQUE,
  label          text NOT NULL,
  regular_rate   numeric(10,2) NOT NULL,
  peak_rate      numeric(10,2) NOT NULL,
  sort_order     integer NOT NULL DEFAULT 0,
  is_active      boolean NOT NULL DEFAULT true,
  updated_at     timestamptz NOT NULL DEFAULT now(),
  updated_by     text,
  CONSTRAINT room_rates_regular_positive CHECK (regular_rate > 0),
  CONSTRAINT room_rates_peak_positive    CHECK (peak_rate > 0)
);

INSERT INTO room_rates (room_slug, label, regular_rate, peak_rate, sort_order) VALUES
  ('mud-house-standard', 'Mud House – Standard',  9000, 10800, 1),
  ('mud-house-premium',  'Mud House – Premium',  10000, 12000, 2),
  ('glamping-tents',     'Glamping Tent',         7500,  9000, 3),
  ('safari-tent',        'Safari Tent',          12000, 14400, 4),
  ('pool-side-villa',    'Poolside Villa',       12000, 14400, 5)
ON CONFLICT (room_slug) DO NOTHING;


-- ── 2. GST rules ─────────────────────────────────────────────────────────────
-- Singleton. The threshold is read against the EFFECTIVE per-night value — what
-- the night is actually sold for, after the peak surcharge, after any discount
-- and with extra-person charges added. See src/lib/pricing/quote.mjs.
CREATE TABLE IF NOT EXISTS gst_rules (
  id            text PRIMARY KEY DEFAULT 'singleton',
  threshold     numeric(10,2) NOT NULL,
  rate_low      numeric(5,2) NOT NULL,
  rate_high     numeric(5,2) NOT NULL,
  updated_at    timestamptz NOT NULL DEFAULT now(),
  updated_by    text,
  CONSTRAINT gst_rules_singleton   CHECK (id = 'singleton'),
  CONSTRAINT gst_rules_threshold   CHECK (threshold >= 0),
  CONSTRAINT gst_rules_rates_order CHECK (rate_low >= 0 AND rate_high >= rate_low)
);

INSERT INTO gst_rules (id, threshold, rate_low, rate_high)
VALUES ('singleton', 7500, 5, 18)
ON CONFLICT (id) DO NOTHING;


-- ── 3. Occupancy rules ───────────────────────────────────────────────────────
-- Singleton. Ages are inclusive upper bounds: infant_max_age 5 means "5 and
-- under stay free", child_max_age 12 means "6 to 12 is a child", and anyone
-- above that is an extra adult.
CREATE TABLE IF NOT EXISTS occupancy_rules (
  id                      text PRIMARY KEY DEFAULT 'singleton',
  extra_adult_rate        numeric(10,2) NOT NULL,
  child_rate              numeric(10,2) NOT NULL,
  infant_rate             numeric(10,2) NOT NULL DEFAULT 0,
  extra_bedding_rate      numeric(10,2) NOT NULL,
  infant_max_age          integer NOT NULL,
  child_max_age           integer NOT NULL,
  default_adults_included integer NOT NULL,
  default_max_adults      integer NOT NULL,
  updated_at              timestamptz NOT NULL DEFAULT now(),
  updated_by              text,
  CONSTRAINT occupancy_rules_singleton  CHECK (id = 'singleton'),
  CONSTRAINT occupancy_rules_nonneg     CHECK (
    extra_adult_rate >= 0 AND child_rate >= 0 AND infant_rate >= 0 AND extra_bedding_rate >= 0
  ),
  CONSTRAINT occupancy_rules_age_order  CHECK (child_max_age > infant_max_age),
  CONSTRAINT occupancy_rules_occupancy  CHECK (default_max_adults >= default_adults_included)
);

INSERT INTO occupancy_rules (
  id, extra_adult_rate, child_rate, infant_rate, extra_bedding_rate,
  infant_max_age, child_max_age, default_adults_included, default_max_adults
) VALUES ('singleton', 2000, 1500, 0, 2000, 5, 12, 2, 3)
ON CONFLICT (id) DO NOTHING;


-- ── 4. Seasons ───────────────────────────────────────────────────────────────
-- Two kinds in one table because they are the same shape and the engine asks
-- the same question of both:
--
--   'peak'     -> +20% surcharge AND no long-stay discount / offers
--   'blackout' -> regular rate, but no long-stay discount / offers
--
-- is_recurring rows match by month/day and apply every year, which is right for
-- the fixed 21 Dec - 04 Jan window. Dated rows are for lunar festivals, which
-- land on different Gregorian dates each year and MUST be refreshed annually.
-- A recurring row ignores start_date/end_date and vice versa.
CREATE TABLE IF NOT EXISTS pricing_seasons (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind          text NOT NULL,
  label         text NOT NULL,
  is_recurring  boolean NOT NULL DEFAULT false,
  start_date    date,
  end_date      date,
  start_month   integer,
  start_day     integer,
  end_month     integer,
  end_day       integer,
  surcharge_rate numeric(5,3),
  is_active     boolean NOT NULL DEFAULT true,
  sort_order    integer NOT NULL DEFAULT 0,
  updated_at    timestamptz NOT NULL DEFAULT now(),
  updated_by    text,
  CONSTRAINT pricing_seasons_kind CHECK (kind IN ('peak', 'blackout')),
  CONSTRAINT pricing_seasons_shape CHECK (
    (is_recurring AND start_month IS NOT NULL AND start_day IS NOT NULL
                  AND end_month IS NOT NULL AND end_day IS NOT NULL)
    OR
    (NOT is_recurring AND start_date IS NOT NULL AND end_date IS NOT NULL
                      AND end_date >= start_date)
  )
);

CREATE INDEX IF NOT EXISTS pricing_seasons_kind_active_idx
  ON pricing_seasons (kind, is_active);

-- Christmas / New Year: recurring, and the one period that carries a surcharge.
INSERT INTO pricing_seasons (kind, label, is_recurring, start_month, start_day, end_month, end_day, surcharge_rate, sort_order)
SELECT 'peak', 'Christmas & New Year', true, 12, 21, 1, 4, 1.200, 1
WHERE NOT EXISTS (SELECT 1 FROM pricing_seasons WHERE kind = 'peak');

-- Festivals / long weekends: dated, no surcharge, discount withheld.
INSERT INTO pricing_seasons (kind, label, is_recurring, start_date, end_date, sort_order)
SELECT * FROM (VALUES
  ('blackout', 'Dussehra', false, DATE '2026-10-17', DATE '2026-10-20', 1),
  ('blackout', 'Diwali',   false, DATE '2026-11-06', DATE '2026-11-14', 2),
  ('blackout', 'Holi',     false, DATE '2027-03-19', DATE '2027-03-22', 3)
) AS seed(kind, label, is_recurring, start_date, end_date, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM pricing_seasons WHERE kind = 'blackout');


-- ── 5. Long-stay discount ────────────────────────────────────────────────────
-- Singleton. Kept apart from `offers` because it is the house default rather
-- than a campaign: it has no date range and no on/off scheduling, and the
-- offers engine compares against it to decide which single reduction a guest
-- gets.
CREATE TABLE IF NOT EXISTS long_stay_rules (
  id             text PRIMARY KEY DEFAULT 'singleton',
  discount_rate  numeric(5,4) NOT NULL,
  min_nights     integer NOT NULL,
  applies_on_peak boolean NOT NULL DEFAULT false,
  is_active      boolean NOT NULL DEFAULT true,
  updated_at     timestamptz NOT NULL DEFAULT now(),
  updated_by     text,
  CONSTRAINT long_stay_singleton CHECK (id = 'singleton'),
  CONSTRAINT long_stay_rate      CHECK (discount_rate >= 0 AND discount_rate < 1),
  CONSTRAINT long_stay_nights    CHECK (min_nights >= 1)
);

INSERT INTO long_stay_rules (id, discount_rate, min_nights, applies_on_peak)
VALUES ('singleton', 0.2000, 2, false)
ON CONFLICT (id) DO NOTHING;


-- ── 6. Offers ────────────────────────────────────────────────────────────────
-- Conditions + exactly ONE reward. Only one offer is ever applied to a booking:
-- whichever saves the guest the most, the long-stay discount included in that
-- comparison. No stacking, and no coupon codes — coupons remain their own table.
--
-- reward_type:
--   'percent_off_stay'  reward_value = percent, e.g. 15 for 15% off room rent
--   'flat_off'          reward_value = rupees off the stay
--   'free_night_per_n'  reward_value = N; every Nth+1 night is free (buy N get 1)
--   'tiered_per_night'  reward_tiers = [{"night":2,"percent":20},{"night":3,"percent":50}]
--
-- room_slugs NULL means "every room type"; otherwise the offer only applies to
-- the listed slugs.
CREATE TABLE IF NOT EXISTS offers (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text NOT NULL,
  description   text,
  is_active     boolean NOT NULL DEFAULT false,

  -- Conditions
  min_nights    integer NOT NULL DEFAULT 1,
  min_rooms     integer NOT NULL DEFAULT 1,
  stay_from     date,
  stay_to       date,
  book_by       date,
  room_slugs    text[],

  -- Reward (exactly one)
  reward_type   text NOT NULL,
  reward_value  numeric(10,2),
  reward_tiers  jsonb,

  sort_order    integer NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now(),
  updated_by    text,

  CONSTRAINT offers_reward_type CHECK (
    reward_type IN ('percent_off_stay', 'flat_off', 'free_night_per_n', 'tiered_per_night')
  ),
  CONSTRAINT offers_min_nights CHECK (min_nights >= 1),
  CONSTRAINT offers_min_rooms  CHECK (min_rooms >= 1),
  CONSTRAINT offers_stay_range CHECK (stay_to IS NULL OR stay_from IS NULL OR stay_to >= stay_from),
  -- Every reward except the tiered one needs a value; the tiered one needs tiers.
  CONSTRAINT offers_reward_shape CHECK (
    (reward_type = 'tiered_per_night' AND reward_tiers IS NOT NULL)
    OR (reward_type <> 'tiered_per_night' AND reward_value IS NOT NULL AND reward_value > 0)
  ),
  CONSTRAINT offers_percent_range CHECK (
    reward_type <> 'percent_off_stay' OR (reward_value > 0 AND reward_value <= 100)
  )
);

CREATE INDEX IF NOT EXISTS offers_active_idx ON offers (is_active, stay_from, stay_to);

-- No offers are seeded. The table ships empty and inactive so that applying
-- this migration cannot change a single quote; staff switch the first one on
-- when they mean to.


-- ── 7. Rate snapshot on bookings ─────────────────────────────────────────────
-- The guarantee that makes the admin screen safe to use: a confirmed booking
-- keeps the price it was sold at, whatever happens to the rate card afterwards.
--
-- Without this, re-opening an invoice after a price rise would reprint the
-- booking at today's tariff. The snapshot holds the full per-night breakdown
-- the quote was built from — rates, GST slab, discount, any offer applied — so
-- invoicing reconstructs from the booking rather than from the catalogue.
ALTER TABLE bookings
  ADD COLUMN IF NOT EXISTS rate_snapshot jsonb;

COMMENT ON COLUMN bookings.rate_snapshot IS
  'Frozen pricing breakdown from the quote that created this booking. Invoices and '
  'reprints read this, never the live rate card. Null on bookings predating the '
  'admin rate screen; those fall back to the stored base/gst/total columns.';


-- ── 8. Availability: only paid or manually blocked holds a unit ──────────────
-- No schema change needed — bookings already carries payment_status. This index
-- matches the availability query, which now filters on status AND payment_status
-- on every price quote on the public site.
CREATE INDEX IF NOT EXISTS bookings_room_dates_status_idx
  ON bookings (room_id, checkin, checkout, status, payment_status);
