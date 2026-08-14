-- Multi-unit manual blocks
--
-- Until now a single manual_blocks row took a whole room type off sale, which is
-- only correct while every room type has one unit. Safari Tent has two and
-- Glamping Tent has four, so blocking one tent for maintenance must not close
-- the other three.
--
-- Run this in the Supabase SQL editor BEFORE deploying the accompanying code.

-- ── 1. Room inventory ────────────────────────────────────────────────────────
-- Already applied to the live database; kept here so a fresh environment lands
-- in the same state.
UPDATE rooms SET inventory_count = 2 WHERE slug = 'safari-tent';
UPDATE rooms SET inventory_count = 4 WHERE slug = 'glamping-tents';
UPDATE rooms SET inventory_count = 1 WHERE slug = 'mud-house-standard';
UPDATE rooms SET inventory_count = 1 WHERE slug = 'mud-house-premium';
UPDATE rooms SET inventory_count = 1 WHERE slug = 'pool-side-villa';
UPDATE rooms SET inventory_count = 1 WHERE slug = 'camping-tent';

-- ── 2. Per-block unit count ──────────────────────────────────────────────────
ALTER TABLE manual_blocks
  ADD COLUMN IF NOT EXISTS units_blocked integer NOT NULL DEFAULT 1;

-- Rows written under the old rule meant "the entire room type is unavailable".
-- Backfilling them to the room's inventory preserves that meaning; leaving them
-- at the default of 1 would silently reopen units nobody intended to sell.
UPDATE manual_blocks mb
   SET units_blocked = GREATEST(r.inventory_count, 1)
  FROM rooms r
 WHERE r.id = mb.room_id
   AND mb.units_blocked = 1
   AND r.inventory_count > 1;

ALTER TABLE manual_blocks
  DROP CONSTRAINT IF EXISTS manual_blocks_units_blocked_positive;
ALTER TABLE manual_blocks
  ADD CONSTRAINT manual_blocks_units_blocked_positive CHECK (units_blocked >= 1);

-- Overlap lookups are always "this room, these dates", and the availability
-- endpoints now run one on every price quote.
CREATE INDEX IF NOT EXISTS manual_blocks_room_dates_idx
  ON manual_blocks (room_id, date_from, date_to);
