/**
 * Everything the packages page says about price, in one place.
 * Package prices come from the printed Ratapani safari package sheet; the
 * nightly "from" prices on the room cards are computed from the booking engine.
 * Confirm these with the office whenever the season's tariff changes.
 */
export const SEASON = "2026–27";
export const UPDATED_ISO = "2026-10-15";
export const UPDATED_LABEL = "15 October 2026";

export const DAY_PRICE = 3500;

export const TWO_DAY = [
  { name: "Safari Tent", price: 16500 },
  { name: "Poolside Villa", price: 16500 },
  { name: "Mud House", price: 14500 },
  { name: "Glamping Tent", price: 13500 },
];

export const THREE_DAY = [
  { name: "Safari Tent", price: 35000 },
  { name: "Mud House", price: 32000 },
  { name: "Glamping Tent", price: 30000 },
  { name: "Poolside Villa", price: 25000 },
];

export const lowest = (list) => Math.min(...list.map((o) => o.price));
