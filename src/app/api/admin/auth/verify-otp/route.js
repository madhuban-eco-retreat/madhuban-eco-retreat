import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { checkRateLimit, getClientIP } from "@/lib/ratelimit";
import {
    OTP_PENDING_COOKIE,
    ADMIN_SESSION_COOKIE,
    ADMIN_SESSION_TTL_SECONDS,
    issueAdminSessionToken,
    readOtpPendingEmail,
    sessionCookieOptions,
} from "@/lib/admin/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const INVALID_OTP = "Invalid or expired OTP";

/**
 * Step two: exchange the emailed code for the real session.
 *
 * The address is taken from the signed password-step marker, never from the
 * request body. Trusting the body would make this endpoint a plain email-OTP
 * login — anyone could post an address they had a code for and skip the
 * password entirely, which is the one thing the two-step flow exists to
 * prevent.
 *
 * This is the first point in the flow that writes Supabase auth cookies, and it
 * is where the 24-hour admin session clock starts.
 */
export async function POST(req) {
    const limit = await checkRateLimit(req, "adminOtp");
    if (limit.limited) {
        return NextResponse.json({ error: "Too many attempts. Please request a new code." }, { status: 429, headers: { "Retry-After": String(limit.retryAfter ?? 900) } });
    }

    const cookieStore = await cookies();
    const email = await readOtpPendingEmail(cookieStore.get(OTP_PENDING_COOKIE)?.value);
    if (!email) {
        return NextResponse.json({ error: "Your login attempt expired. Please sign in again." }, { status: 440 });
    }

    let body;
    try {
        body = await req.json();
    }
    catch {
        return NextResponse.json({ error: INVALID_OTP }, { status: 400 });
    }
    // Guests paste codes with stray spaces out of the email; strip anything
    // that is not a digit rather than failing them on formatting.
    const token = typeof body?.token === "string" ? body.token.replace(/\D/g, "") : "";
    if (token.length !== 6) {
        return NextResponse.json({ error: INVALID_OTP }, { status: 400 });
    }

    // Cookie-bound client: a successful verify writes the Supabase session here.
    const supabase = await createClient();
    const { data, error } = await supabase.auth.verifyOtp({ email, token, type: "email" });
    if (error || !data?.user) {
        console.warn(`[admin/auth/verify-otp] failed attempt for ${email} from ${getClientIP(req)}`);
        return NextResponse.json({ error: INVALID_OTP }, { status: 401 });
    }

    const res = NextResponse.json({ ok: true });
    // Spent — a code must not be reusable for a second session.
    res.cookies.set(OTP_PENDING_COOKIE, "", sessionCookieOptions(0));
    res.cookies.set(ADMIN_SESSION_COOKIE, await issueAdminSessionToken(email), sessionCookieOptions(ADMIN_SESSION_TTL_SECONDS));
    return res;
}
