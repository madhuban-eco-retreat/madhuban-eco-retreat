import { NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createAdminClient } from "@/lib/supabase/admin";
import { checkRateLimit, getClientIP } from "@/lib/ratelimit";
import { ADMIN_EMAIL } from "@/lib/admin/constants";
import {
    OTP_PENDING_COOKIE,
    OTP_PENDING_TTL_SECONDS,
    issueOtpPendingToken,
    sessionCookieOptions,
} from "@/lib/admin/session";

// Supabase auth calls need Node crypto and must not be cached.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * One message for every rejection.
 *
 * Distinguishing "no such account" from "wrong password" turns this endpoint
 * into a directory of who has admin access. Wrong address, wrong password and
 * an address with no admin rights all read identically from outside.
 */
const INVALID_CREDENTIALS = "Invalid email or password";

/**
 * Step one of admin login: prove the password, then send a code.
 *
 * This runs on the server, and that is the whole point. signInWithPassword
 * mints a real session the instant the password checks out — done from the
 * browser it would drop Supabase's auth cookies and the admin would already be
 * logged in, leaving the OTP screen as decoration over an open door. Here the
 * client is built with persistSession off, so the session it returns exists
 * only inside this request; nothing is written to a cookie until the code is
 * verified. The session is then explicitly revoked rather than left to expire.
 *
 * What the browser gets back is a signed, HTTP-only marker saying "this
 * browser cleared the password step for this address". Verify and resend both
 * demand it, so neither can be driven without a password first.
 */
export async function POST(req) {
    const limit = await checkRateLimit(req, "adminPassword");
    if (limit.limited) {
        return NextResponse.json({ error: "Too many login attempts. Please try again later." }, { status: 429, headers: { "Retry-After": String(limit.retryAfter ?? 900) } });
    }

    let body;
    try {
        body = await req.json();
    }
    catch {
        return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body?.password === "string" ? body.password : "";
    if (!email || !password) {
        return NextResponse.json({ error: INVALID_CREDENTIALS }, { status: 401 });
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !anonKey) {
        console.error("[admin/auth/password] Supabase env vars missing");
        return NextResponse.json({ error: "Login is temporarily unavailable." }, { status: 503 });
    }

    // Deliberately NOT the cookie-bound client from @/lib/supabase/server: that
    // one would persist the session this call creates.
    const verifier = createSupabaseClient(url, anonKey, {
        auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    });

    const { data: signIn, error: signInError } = await verifier.auth.signInWithPassword({ email, password });
    if (signInError || !signIn?.user) {
        return NextResponse.json({ error: INVALID_CREDENTIALS }, { status: 401 });
    }

    // Scope "local" revokes exactly the refresh token just minted and leaves the
    // admin's other devices signed in. A global sign-out here would mean one
    // login attempt on a phone silently kicked the same person off their desk.
    try {
        await verifier.auth.signOut({ scope: "local" });
    }
    catch (err) {
        console.error("[admin/auth/password] could not revoke verification session:", err);
    }

    // Authorisation, not just authentication. An account can hold a valid
    // password and still have no business in the panel — better it is turned
    // away here than handed a code and stopped one screen later.
    if (!(await isAuthorisedAdmin(signIn.user.id, email))) {
        return NextResponse.json({ error: INVALID_CREDENTIALS }, { status: 401 });
    }

    // signInWithPassword does not send anything on its own — that only happens
    // when Supabase MFA is enrolled. The code is requested explicitly, with
    // shouldCreateUser off so this can never provision an account.
    const { error: otpError } = await verifier.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: false },
    });
    if (otpError) {
        console.error("[admin/auth/password] OTP send failed:", otpError);
        return NextResponse.json({ error: "Could not send your verification code. Please try again." }, { status: 502 });
    }

    console.info(`[admin/auth/password] OTP issued for ${email} from ${getClientIP(req)}`);

    const res = NextResponse.json({ ok: true, email, expiresInSeconds: OTP_PENDING_TTL_SECONDS });
    res.cookies.set(OTP_PENDING_COOKIE, await issueOtpPendingToken(email), sessionCookieOptions(OTP_PENDING_TTL_SECONDS));
    return res;
}

/** Mirrors resolveAdminUser's rule: an active profile row, or the bootstrap address. */
async function isAuthorisedAdmin(userId, email) {
    if (email === ADMIN_EMAIL.toLowerCase())
        return true;
    try {
        const { data: profile } = await createAdminClient()
            .from("user_profiles")
            .select("is_active")
            .eq("user_id", userId)
            .single();
        return !!profile?.is_active;
    }
    catch (err) {
        console.error("[admin/auth/password] profile lookup failed:", err);
        return false;
    }
}
