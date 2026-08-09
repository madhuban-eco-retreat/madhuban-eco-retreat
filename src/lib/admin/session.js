/**
 * Signed, short-lived cookies backing the two-step admin login.
 *
 * Supabase's own session cookie says "this browser holds a valid Supabase
 * session". It cannot say "this browser got past the password step" or "this
 * login is nine hours old", and both of those are things the admin panel now
 * needs to know. Rather than a second session store, each fact is carried in a
 * cookie the server signs with HMAC-SHA256 and refuses to read if the signature
 * or the expiry does not hold up.
 *
 * The payload is not secret — it is an email address and a timestamp the
 * browser already knows. What the signature buys is integrity: a browser cannot
 * award itself a password-verified marker, move the login clock backwards, or
 * swap in another admin's address.
 *
 * Built on Web Crypto rather than node:crypto, and on btoa/atob rather than
 * Buffer, because proxy.js reads these cookies and middleware runs on the Edge
 * runtime where neither Node API exists. That is what makes every function here
 * async — the one real cost of being usable from both runtimes.
 */

/** Marks a browser as having cleared the password step, pending its OTP. */
export const OTP_PENDING_COOKIE = "madhuban_admin_otp_pending";
/** Records when the current admin login began, for the 24-hour ceiling. */
export const ADMIN_SESSION_COOKIE = "madhuban_admin_session";

/**
 * How long a password-verified browser has to enter its code.
 *
 * Matched to the ten-minute Supabase OTP expiry so the two cannot disagree — a
 * marker outliving the code it belongs to would let someone resend indefinitely
 * off a single password entry.
 */
export const OTP_PENDING_TTL_SECONDS = 600;

/**
 * Idle ceiling on an admin session, in seconds.
 *
 * Re-issued on every authenticated request, so a session in continuous use
 * never expires; twenty-four hours after the last one it does. That is the
 * reading of "lasts 24 hours" that does not sign someone out mid-task.
 */
export const ADMIN_SESSION_TTL_SECONDS = 24 * 60 * 60;

const encoder = new TextEncoder();
let keyPromise = null;

/**
 * HMAC key. ADMIN_JWT_SECRET is the project's existing admin-side secret; the
 * service role key is a fallback so a deployment that never set the former is
 * not silently left signing with a constant. Refusing to sign at all would take
 * down login, so an absent secret throws loudly at use rather than degrading to
 * something forgeable.
 */
function getKey() {
    if (keyPromise)
        return keyPromise;
    const secret = process.env.ADMIN_JWT_SECRET ?? process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!secret) {
        return Promise.reject(new Error("[admin/session] ADMIN_JWT_SECRET (or SUPABASE_SERVICE_ROLE_KEY) must be set to sign admin session cookies"));
    }
    keyPromise = crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
    return keyPromise;
}

function bytesToBase64Url(bytes) {
    let binary = "";
    for (const byte of bytes)
        binary += String.fromCharCode(byte);
    return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlToBytes(value) {
    const padded = value.replace(/-/g, "+").replace(/_/g, "/");
    const binary = atob(padded + "=".repeat((4 - (padded.length % 4)) % 4));
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1)
        bytes[i] = binary.charCodeAt(i);
    return bytes;
}

async function sign(payload) {
    const signature = await crypto.subtle.sign("HMAC", await getKey(), encoder.encode(payload));
    return bytesToBase64Url(new Uint8Array(signature));
}

/** Builds `<base64url(json)>.<signature>` for a payload with an absolute expiry. */
export async function issueSignedToken(data, ttlSeconds) {
    const body = { ...data, exp: Date.now() + ttlSeconds * 1000 };
    const payload = bytesToBase64Url(encoder.encode(JSON.stringify(body)));
    return `${payload}.${await sign(payload)}`;
}

/**
 * Returns the payload of a token whose signature and expiry both hold, else
 * null. Every failure — malformed, re-signed, expired — returns the same null
 * so a caller cannot use the distinction to probe the format. subtle.verify
 * does the comparison, which keeps it constant-time.
 */
export async function readSignedToken(token) {
    if (!token || typeof token !== "string")
        return null;
    const dot = token.lastIndexOf(".");
    if (dot <= 0)
        return null;
    const payload = token.slice(0, dot);
    const signature = token.slice(dot + 1);
    try {
        const ok = await crypto.subtle.verify("HMAC", await getKey(), base64UrlToBytes(signature), encoder.encode(payload));
        if (!ok)
            return null;
        const body = JSON.parse(new TextDecoder().decode(base64UrlToBytes(payload)));
        if (typeof body?.exp !== "number" || body.exp < Date.now())
            return null;
        return body;
    }
    catch {
        return null;
    }
}

/** Cookie attributes shared by both markers. Secure everywhere but local dev. */
export function sessionCookieOptions(maxAgeSeconds) {
    return {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: maxAgeSeconds,
    };
}

export function issueOtpPendingToken(email) {
    return issueSignedToken({ email: email.toLowerCase(), scope: "otp_pending" }, OTP_PENDING_TTL_SECONDS);
}

/** The email a browser cleared the password step for, or null. */
export async function readOtpPendingEmail(token) {
    const body = await readSignedToken(token);
    if (!body || body.scope !== "otp_pending" || typeof body.email !== "string")
        return null;
    return body.email;
}

/**
 * Session marker. `startedAt` is carried forward across refreshes so the
 * absolute age of a login stays auditable even though the expiry slides.
 */
export function issueAdminSessionToken(email, startedAt = Date.now()) {
    return issueSignedToken({ email: email.toLowerCase(), scope: "admin_session", startedAt }, ADMIN_SESSION_TTL_SECONDS);
}

export async function readAdminSession(token) {
    const body = await readSignedToken(token);
    if (!body || body.scope !== "admin_session" || typeof body.email !== "string")
        return null;
    return { email: body.email, startedAt: body.startedAt ?? null, exp: body.exp };
}
