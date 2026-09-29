import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createRazorpayOrder } from "@/lib/razorpay";

const BOOKING_WINDOW_MINUTES = 60;

/**
 * One Razorpay order covering several bookings created in the same visit
 * (multiple rooms and/or multiple room categories, same checkout session).
 *
 * Mirrors /api/booking/create-order but for an array of bookingIds instead of
 * one: sums their total_amount, opens a single order for that sum, and writes
 * one payment row per booking — all sharing the same razorpay_order_id, each
 * for that booking's own amount, so per-booking accounting stays correct.
 */
export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const bookingIds = Array.isArray(body?.bookingIds) ? body.bookingIds.filter((x) => typeof x === "string") : [];
  if (bookingIds.length < 2) {
    return NextResponse.json({ error: "bookingIds must have at least 2 entries" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data: bookings, error } = await supabase
    .from("bookings")
    .select(`
      id, booking_ref, status, total_amount, created_at,
      guests!guest_id ( name, email, mobile ),
      rooms!room_id ( name )
    `)
    .in("id", bookingIds);

  if (error || !bookings || bookings.length !== bookingIds.length) {
    return NextResponse.json({ error: "One or more bookings not found" }, { status: 404 });
  }

  for (const b of bookings) {
    if (b.status !== "PENDING_PAYMENT") {
      return NextResponse.json({ error: `Booking ${b.booking_ref} is already ${b.status.toLowerCase()}` }, { status: 409 });
    }
    const ageMinutes = (Date.now() - new Date(b.created_at).getTime()) / 60000;
    if (ageMinutes > BOOKING_WINDOW_MINUTES) {
      return NextResponse.json({ error: "This booking has expired. Please start again." }, { status: 410 });
    }
  }

  const totalAmount = bookings.reduce((s, b) => s + Number(b.total_amount), 0);
  if (totalAmount <= 0) {
    return NextResponse.json({
      error: "Use /api/booking/confirm-free for zero-amount bookings",
      zeroAmount: true,
    }, { status: 400 });
  }

  const groupRef = bookings.map((b) => b.booking_ref).join("+");
  const amountPaise = Math.round(totalAmount * 100);

  let orderId, amountFromOrder;
  try {
    const order = await createRazorpayOrder({
      amountPaise,
      receipt: groupRef.slice(0, 40),
      notes: { bookingIds: bookingIds.join(",") },
    });
    orderId = order.id;
    amountFromOrder = order.amount;
  } catch (err) {
    console.error("[create-group-order] Razorpay error:", err);
    return NextResponse.json({ error: "Failed to create payment order" }, { status: 500 });
  }

  // One payment row per booking, same order id, each for its own amount.
  await supabase.from("payments").insert(
    bookings.map((b) => ({
      booking_id: b.id,
      razorpay_order_id: orderId,
      amount: Number(b.total_amount),
      status: "pending",
      payment_type: "full",
    })),
  );

  const first = bookings[0];
  const guest = Array.isArray(first.guests) ? first.guests[0] : first.guests;

  return NextResponse.json({
    orderId,
    amount: amountFromOrder,
    currency: "INR",
    keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? "",
    totalAmountRupees: totalAmount,
    bookingRefs: bookings.map((b) => b.booking_ref),
    roomNames: bookings.map((b) => (Array.isArray(b.rooms) ? b.rooms[0]?.name : b.rooms?.name)),
    prefill: {
      name: guest?.name ?? "",
      email: guest?.email ?? "",
      contact: guest?.mobile ?? "",
    },
  });
}
