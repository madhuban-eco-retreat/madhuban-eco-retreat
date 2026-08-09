import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { checkRateLimit } from "@/lib/ratelimit";
import {
    OTP_PENDING_COOKIE,
    OTP_PENDING_TTL_SECONDS,
    issueOtpPendingToken,
    readOtpPendingEmail,
    sessionCookieOptions,
} from "@/lib/admin/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Re-sends the code to a browser that has already cleared the password step.
 *
 * Gated on the signed marker rather than on an address in the body: an
 * unauthenticated endpoint that emails a working login code to any address
 * asked of it is a way to spam admins, and a way to fish for which addresses
 * exist. The marker is re-issued on each send so the ten-minute window tracks
 * the newest code rather than the first one.
 */
export async function POST(req) {
    const limit = await checkRateLimit(req, "adminOtp");
    if (limit.limited) {
        return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429, headers: { "Retry-After": String(limit.retryAfter ?? 900) } });
    }

    const cookieStore = await cookies();
    const email = await readOtpPendingEmail(cookieStore.get(OTP_PENDING_COOKIE)?.value);
    if (!email) {
        return NextResponse.json({ error: "Your login attempt expired. Please sign in again." }, { status: 440 });
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !anonKey) {
        return NextResponse.json({ error: "Login is temporarily unavailable." }, { status: 503 });
    }
    const client = createSupabaseClient(url, anonKey, {
        auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    });

    const { error } = await client.auth.signInWithOtp({ email, options: { shouldCreateUser: false } });
    if (error) {
        console.error("[admin/auth/resend-otp] send failed:", error);
        return NextResponse.json({ error: "Could not resend your code. Please try again." }, { status: 502 });
    }

    const res = NextResponse.json({ ok: true });
    res.cookies.set(OTP_PENDING_COOKIE, await issueOtpPendingToken(email), sessionCookieOptions(OTP_PENDING_TTL_SECONDS));
    return res;
}
