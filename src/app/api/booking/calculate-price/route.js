import { NextResponse } from "next/server";
import { calculatePriceSchema } from "@/lib/booking/schemas";
import { calculatePricing } from "@/lib/booking/pricing";
import { createAdminClient } from "@/lib/supabase/admin";
import { checkRateLimit, peekRateLimit, consumeRateLimit, getClientIP } from "@/lib/ratelimit";

const COUPON_LIMIT_MESSAGE = "Too many coupon attempts. Please try again later.";

/**
 * Keeps the first three characters and masks the rest.
 *
 * A failed attempt has to be reviewable — staff need to tell a guest fumbling a
 * real code from a script walking the keyspace — but writing whole guesses into
 * the audit log would build a plaintext list of near-miss codes for anyone who
 * can read it. Three characters is enough to recognise a pattern, not enough to
 * redeem anything.
 */
function maskCoupon(code) {
    const trimmed = code.trim().toUpperCase();
    if (trimmed.length <= 3)
        return trimmed;
    return `${trimmed.slice(0, 3)}${"*".repeat(trimmed.length - 3)}`;
}

/** Audit trail is best-effort — a logging failure must never fail a price quote. */
async function logFailedCoupon({ code, ip, roomSlug }) {
    try {
        await createAdminClient().from("audit_log").insert({
            admin_user_id: "system",
            actor_email: "system",
            action: "coupon_failed",
            entity_type: "coupon",
            entity_id: maskCoupon(code),
            // audit_log has no dedicated IP column, so the address rides in the
            // details payload alongside the masked code it belongs to.
            details: {
                ip_address: ip,
                attempted_code: maskCoupon(code),
                room_slug: roomSlug,
            },
        });
    }
    catch (err) {
        console.error("[calculate-price] coupon audit log failed:", err);
    }
}

export async function POST(req) {
    // Overall ceiling first: an exhausted caller should not reach the database
    // at all, whether or not the request carries a coupon.
    const overall = await checkRateLimit(req, "price");
    if (overall.limited) {
        return NextResponse.json({ error: "Too many requests. Please slow down and try again shortly." }, { status: 429, headers: { "Retry-After": String(overall.retryAfter ?? 600) } });
    }
    let body;
    try {
        body = await req.json();
    }
    catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }
    const parsed = calculatePriceSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
    }
    const attemptedCoupon = parsed.data.couponCode?.trim() ?? "";
    // The coupon window is charged only for wrong codes, so it is peeked here
    // and spent below once the outcome is known. Checking up front is what
    // denies an exhausted caller the lookup itself.
    if (attemptedCoupon) {
        const couponLimit = await peekRateLimit(req, "coupon");
        if (couponLimit.limited) {
            return NextResponse.json({ error: COUPON_LIMIT_MESSAGE }, { status: 429, headers: { "Retry-After": String(couponLimit.retryAfter ?? 3600) } });
        }
    }
    try {
        const pricing = await calculatePricing(parsed.data);
        // calculatePricing returns couponCode: null when the code does not exist,
        // has expired, is exhausted or misses its minimum — every one of those is
        // a failed attempt from a rate-limiting point of view.
        if (attemptedCoupon && !pricing.couponCode) {
            const ip = getClientIP(req);
            const spent = await consumeRateLimit(req, "coupon");
            await logFailedCoupon({ code: attemptedCoupon, ip, roomSlug: parsed.data.roomSlug });
            if (spent.limited) {
                return NextResponse.json({ error: COUPON_LIMIT_MESSAGE }, { status: 429, headers: { "Retry-After": String(spent.retryAfter ?? 3600) } });
            }
            // The quote itself is still valid — it is simply un-discounted — so it
            // is returned with the coupon reported as rejected rather than 4xx'd.
            return NextResponse.json({
                ...pricing,
                couponError: "That coupon code is not valid for this booking.",
                couponAttemptsRemaining: spent.remaining,
            });
        }
        return NextResponse.json(pricing);
    }
    catch (err) {
        const message = err instanceof Error ? err.message : "Unable to calculate price";
        return NextResponse.json({ error: message }, { status: 400 });
    }
}
