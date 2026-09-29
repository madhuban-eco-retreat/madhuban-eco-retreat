import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyPaymentSignature } from "@/lib/razorpay";
import { sendBookingConfirmationEmails } from "@/lib/booking/send-confirmation";

/**
 * Verifies one Razorpay payment and confirms every booking it covered.
 *
 * Mirrors /api/booking/verify-payment but for a group: the signature check is
 * done once (Razorpay signs the order, not any one booking), then each
 * booking + its own payment row (same order_id) is updated and emailed.
 */
export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const bookingIds = Array.isArray(body?.bookingIds) ? body.bookingIds.filter((x) => typeof x === "string") : [];
  const orderId = typeof body?.orderId === "string" ? body.orderId : "";
  const paymentId = typeof body?.paymentId === "string" ? body.paymentId : "";
  const signature = typeof body?.signature === "string" ? body.signature : "";

  if (bookingIds.length < 2 || !orderId || !paymentId || !signature) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const valid = verifyPaymentSignature(orderId, paymentId, signature);
  if (!valid) {
    const supabase = createAdminClient();
    await supabase.from("audit_log").insert({
      admin_user_id: "system",
      actor_email: "system",
      action: "payment_signature_mismatch",
      entity_type: "booking",
      entity_id: bookingIds[0],
      details: { orderId, paymentId, bookingIds },
    });
    return NextResponse.json({ ok: false, error: "Payment verification failed" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data: bookings } = await supabase
    .from("bookings")
    .select("id, booking_ref, status")
    .in("id", bookingIds);

  if (!bookings || bookings.length !== bookingIds.length) {
    return NextResponse.json({ error: "One or more bookings not found" }, { status: 404 });
  }

  // Idempotency: if the group is already confirmed, just return success.
  if (bookings.every((b) => b.status === "CONFIRMED")) {
    return NextResponse.json({ ok: true, bookingRefs: bookings.map((b) => b.booking_ref) });
  }

  for (const b of bookings) {
    if (b.status === "CONFIRMED") continue;
    await supabase.from("bookings").update({ status: "CONFIRMED", payment_status: "partial" }).eq("id", b.id);
    await supabase
      .from("payments")
      .update({ razorpay_payment_id: paymentId, status: "captured", captured_at: new Date().toISOString() })
      .eq("booking_id", b.id)
      .eq("razorpay_order_id", orderId)
      .eq("status", "pending");
    await supabase.from("audit_log").insert({
      admin_user_id: "system",
      actor_email: "system",
      action: "payment_confirmed",
      entity_type: "booking",
      entity_id: b.id,
      details: { orderId, paymentId, group: bookingIds, before: { status: "PENDING_PAYMENT" }, after: { status: "CONFIRMED" } },
    });
    await sendBookingConfirmationEmails(b.id);
  }

  return NextResponse.json({ ok: true, bookingRefs: bookings.map((b) => b.booking_ref) });
}
