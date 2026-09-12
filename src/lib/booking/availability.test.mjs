// @ts-check
/**
 * Which bookings hold a unit.
 *
 * The rule changed: money, not just status. An unpaid booking — an abandoned
 * online attempt, or a walk-in entered before payment — used to take a room off
 * sale indefinitely. It no longer does, and the row is kept in full either way.
 *
 * That second half matters as much as the first. "Stops blocking" must never
 * become "is deleted"; these tests pin the distinction.
 */

import test from "node:test";
import assert from "node:assert/strict";

import {
  occupiesInventory,
  minAvailableUnits,
  OCCUPYING_STATUSES,
  PAID_PAYMENT_STATUSES,
} from "./block-units.js";

const booking = (over) => ({
  id: "b1",
  checkin: "2026-08-10",
  checkout: "2026-08-12",
  status: "CONFIRMED",
  payment_status: "paid",
  ...over,
});

/* -- what holds a unit ----------------------------------------------------- */

test("a paid confirmed booking holds a unit", () => {
  assert.equal(occupiesInventory(booking()), true);
  assert.equal(occupiesInventory(booking({ status: "CHECKED_IN" })), true);
});

test("a part-paid booking holds a unit — the advance bought the room", () => {
  assert.equal(occupiesInventory(booking({ payment_status: "partial" })), true);
});

test("an unpaid booking no longer holds a unit", () => {
  assert.equal(occupiesInventory(booking({ payment_status: "pending" })), false);
  assert.equal(occupiesInventory(booking({ status: "PENDING_PAYMENT", payment_status: "pending" })), false);
});

test("a confirmed-but-unpaid booking no longer blocks — this is the fix", () => {
  // The case that cost the property inventory: staff or an abandoned checkout
  // left a CONFIRMED row with no money against it, and the room stayed shut.
  assert.equal(occupiesInventory(booking({ status: "CONFIRMED", payment_status: "pending" })), false);
});

test("cancelled and no-show bookings never hold a unit", () => {
  for (const status of ["CANCELLED", "NO_SHOW", "CHECKED_OUT"]) {
    assert.equal(occupiesInventory(booking({ status })), false, status);
  }
});

test("a row with no payment_status is treated as holding — fail safe", () => {
  // Older rows, or a projection that did not select the column. Withholding a
  // room is recoverable; double-selling one is not.
  assert.equal(occupiesInventory(booking({ payment_status: undefined })), true);
  assert.equal(occupiesInventory(booking({ payment_status: null })), true);
});

test("payment status is matched case-insensitively", () => {
  assert.equal(occupiesInventory(booking({ payment_status: "PAID" })), true);
  assert.equal(occupiesInventory(booking({ payment_status: "Partial" })), true);
});

test("nothing is lost — the predicate reads rows, it does not remove them", () => {
  // The rows an admin list would show, including the ones that no longer block.
  const rows = [
    booking({ id: "paid", payment_status: "paid" }),
    booking({ id: "unpaid", payment_status: "pending" }),
    booking({ id: "cancelled", status: "CANCELLED" }),
  ];
  const blocking = rows.filter(occupiesInventory);

  assert.equal(rows.length, 3, "every booking is still in the list");
  assert.equal(blocking.length, 1, "but only one closes the calendar");
  assert.equal(blocking[0].id, "paid");
});

/* -- the arithmetic that uses it ------------------------------------------- */

test("availability counts only paid bookings against inventory", () => {
  const bookings = [
    booking({ id: "paid", payment_status: "paid" }),
    booking({ id: "unpaid-1", payment_status: "pending" }),
    booking({ id: "unpaid-2", payment_status: "pending" }),
  ];

  // A two-unit Safari Tent: one paid booking, two unpaid. One unit is gone,
  // not three.
  const free = minAvailableUnits({
    inventoryCount: 2,
    checkIn: "2026-08-10",
    checkOut: "2026-08-12",
    bookings,
    blocks: [],
    roomId: "r1",
  });
  assert.equal(free, 1);
});

test("three unpaid bookings leave a single-unit room fully sellable", () => {
  const free = minAvailableUnits({
    inventoryCount: 1,
    checkIn: "2026-08-10",
    checkOut: "2026-08-12",
    bookings: [
      booking({ id: "a", payment_status: "pending" }),
      booking({ id: "b", payment_status: "pending" }),
      booking({ id: "c", status: "PENDING_PAYMENT", payment_status: "pending" }),
    ],
    blocks: [],
    roomId: "r1",
  });
  assert.equal(free, 1);
});

test("a manual block still closes a room with no bookings at all", () => {
  const free = minAvailableUnits({
    inventoryCount: 1,
    checkIn: "2026-08-10",
    checkOut: "2026-08-12",
    bookings: [],
    blocks: [{ room_id: "r1", date_from: "2026-08-09", date_to: "2026-08-15", units_blocked: 1 }],
    roomId: "r1",
  });
  assert.equal(free, 0);
});

test("paid bookings and manual blocks combine", () => {
  const free = minAvailableUnits({
    inventoryCount: 4,
    checkIn: "2026-08-10",
    checkOut: "2026-08-12",
    bookings: [
      booking({ id: "p1", payment_status: "paid" }),
      booking({ id: "p2", payment_status: "partial" }),
      booking({ id: "u1", payment_status: "pending" }),
    ],
    blocks: [{ room_id: "r1", date_from: "2026-08-10", date_to: "2026-08-11", units_blocked: 1 }],
    roomId: "r1",
  });
  // 4 inventory − 2 paid − 1 blocked = 1. The unpaid one is not counted.
  assert.equal(free, 1);
});

test("the status and payment vocabularies are what the rest of the app uses", () => {
  assert.deepEqual(OCCUPYING_STATUSES, ["CONFIRMED", "CHECKED_IN"]);
  assert.deepEqual(PAID_PAYMENT_STATUSES, ["paid", "partial"]);
});
