import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/lib/supabase/env";

/**
 * Exchanges a Supabase email link for a session.
 *
 * Now used only by the password-reset flow. Login no longer arrives here — it
 * goes through the password check and the OTP endpoints — but a recovery link
 * still has to be redeemed before a new password can be set.
 *
 * Recovery links come in three shapes and this route can only redeem two of
 * them:
 *
 *   ?code=…                PKCE, from resetPasswordForEmail in this app
 *   ?token_hash=…&type=…   the {{ .TokenHash }} email template
 *   #access_token=…        implicit, and what the Supabase dashboard's own
 *                          "Send password recovery" button produces
 *
 * A fragment is never transmitted in an HTTP request, so the third form
 * arrives here looking like a bare URL with no credentials at all. Treating
 * that as a failure — which it previously was — bounced the visitor to
 * /admin/login?error=auth_failed and made dashboard-issued reset links
 * unusable, which is precisely how the first admin password gets set. Instead
 * the request is forwarded to `next`, and the browser re-attaches the fragment
 * across the redirect for the reset page to redeem client-side.
 *
 * Note what this route does NOT do: it does not set the admin session cookie.
 * A session obtained from an emailed link has not cleared the password or the
 * OTP step, so it gets a visitor as far as /admin/reset-password and no
 * further — the admin layout refuses it. Granting panel access here would
 * leave a one-click way in that bypasses both new factors.
 */
export async function GET(request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code");
    const tokenHash = searchParams.get("token_hash");
    const type = searchParams.get("type");

    // Only same-site paths are honoured, so a crafted link cannot turn this
    // route into an open redirect onto someone else's host.
    const nextParam = searchParams.get("next");
    const hasNext = !!nextParam && nextParam.startsWith("/") && !nextParam.startsWith("//");
    const next = hasNext ? nextParam : "/admin";

    if (code || tokenHash) {
        const cookieStore = await cookies();
        const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
                },
            },
        });

        const { error } = tokenHash
            ? await supabase.auth.verifyOtp({
                token_hash: tokenHash,
                type: type === "invite" ? "invite" : "recovery",
            })
            : await supabase.auth.exchangeCodeForSession(code);

        if (!error) {
            return NextResponse.redirect(`${origin}${next}`);
        }

        // A PKCE exchange fails when the verifier cookie is absent — which is
        // the normal case for a link requested on one device and opened on
        // another. The reset page can still redeem a fragment, so hand off
        // rather than dead-ending on the login screen.
        console.error("[admin/auth/callback] token exchange failed:", error);
        if (hasNext) {
            return NextResponse.redirect(`${origin}${next}`);
        }
    }
    else if (hasNext) {
        // No credentials in the query at all: either an implicit link whose
        // fragment is invisible to us, or a stray hit. Either way `next` knows
        // how to deal with it, and will say so if there is nothing to redeem.
        return NextResponse.redirect(`${origin}${next}`);
    }

    return NextResponse.redirect(`${origin}/admin/login?error=auth_failed`);
}
