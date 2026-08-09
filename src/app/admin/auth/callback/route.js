import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

/**
 * Exchanges a Supabase email link for a session.
 *
 * Now used only by the password-reset flow. Login no longer arrives here — it
 * goes through the password check and the OTP endpoints — but the recovery link
 * still has a PKCE code that must be traded for a session before a new password
 * can be set, and this is the only place holding that exchange.
 *
 * Note what this route does NOT do: it does not set the admin session cookie.
 * A session obtained from an emailed link has not cleared the password or the
 * OTP step, so it gets a visitor as far as /admin/reset-password and no
 * further — the admin layout refuses it. That is deliberate. Granting panel
 * access here would leave a one-click way in that bypasses both new factors.
 */
export async function GET(request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code");
    // Only same-site paths are honoured, so a crafted link cannot turn this
    // route into an open redirect onto someone else's host.
    const nextParam = searchParams.get("next");
    const next = nextParam && nextParam.startsWith("/") && !nextParam.startsWith("//")
        ? nextParam
        : "/admin";

    if (code) {
        const cookieStore = await cookies();
        const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
                },
            },
        });
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
            return NextResponse.redirect(`${origin}${next}`);
        }
        console.error("[admin/auth/callback] code exchange failed:", error);
    }
    return NextResponse.redirect(`${origin}/admin/login?error=auth_failed`);
}
