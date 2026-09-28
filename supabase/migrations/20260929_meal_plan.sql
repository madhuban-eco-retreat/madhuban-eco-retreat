-- Meal plan on bookings (2026-27 tariff)
--
-- OPTIONAL and safe to run at any time. The site works without it: a booking's
-- meal plan is also written into bookings.internal_notes as "Meal plan: MAP (...)",
-- and every reader falls back to that note when the column is absent. Running this
-- gives the plan its own column for reporting and backfills any booking that was
-- taken while the column did not exist.
--
-- Take a pg_dump backup first, as with any schema change.

-- 1. The column. NULL means the booking predates the meal-plan tariff (or is a
--    room with no plan, such as the camping tent) and prices under the old rules.
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS meal_plan text;

ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_meal_plan_check;
ALTER TABLE bookings ADD CONSTRAINT bookings_meal_plan_check
  CHECK (meal_plan IS NULL OR meal_plan IN ('MAP', 'AP'));

-- 2. Backfill from the staff note for bookings taken before this ran.
UPDATE bookings
   SET meal_plan = substring(internal_notes FROM 'Meal plan: (MAP|AP)')
 WHERE meal_plan IS NULL
   AND internal_notes ~ 'Meal plan: (MAP|AP)';

-- 3. CHECK THIS: rooms.base_price_per_night must be the ROOM RENT, excluding
--    meals. The engine adds the meal supplement on top, so if a row holds the
--    meal-inclusive rate from the tariff sheet (10,200 for Mud House Standard)
--    guests are charged the meals twice.
--
--    Expected:  mud-house-standard 9000 | mud-house-premium 10000 |
--               glamping-tents 7500 | safari-tent 12000 | pool-side-villa 12000
SELECT slug, base_price_per_night FROM rooms ORDER BY slug;

-- If any of the five differ, correct them (uncomment and run):
-- UPDATE rooms SET base_price_per_night = 9000  WHERE slug = 'mud-house-standard';
-- UPDATE rooms SET base_price_per_night = 10000 WHERE slug = 'mud-house-premium';
-- UPDATE rooms SET base_price_per_night = 7500  WHERE slug = 'glamping-tents';
-- UPDATE rooms SET base_price_per_night = 12000 WHERE slug = 'safari-tent';
-- UPDATE rooms SET base_price_per_night = 12000 WHERE slug = 'pool-side-villa';
