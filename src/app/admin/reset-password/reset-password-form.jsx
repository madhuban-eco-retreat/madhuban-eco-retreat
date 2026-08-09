"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Lock, Eye, EyeOff, CheckCircle2, ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/browser";

/**
 * Floor for a new admin password.
 *
 * Supabase's own default is six, which is short for an account that can cancel
 * bookings and issue invoices. Ten is enforced here and stated up front, so the
 * requirement is met before submitting rather than discovered by rejection.
 */
const MIN_PASSWORD_LENGTH = 10;

/**
 * How long to wait for a recovery session before calling the link dead.
 *
 * Long enough to cover the token exchange round trip, short enough that a
 * genuinely expired link does not leave someone staring at a spinner. An
 * exchange still in flight when this fires is allowed to win — the timeout
 * decides what to show, not what to stop doing.
 */
const RECOVERY_TIMEOUT_MS = 3000;

const INPUT_CLS =
    "w-full pl-10 pr-11 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-cream)] font-body text-sm text-[var(--color-charcoal)] placeholder:text-[var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-earth-brown)]/30 focus:border-[var(--color-earth-brown)] transition-colors";
const LABEL_CLS =
    "block font-body text-xs font-semibold tracking-wider uppercase text-[var(--color-charcoal)]/60 mb-2";

/**
 * Strips the credentials out of the address bar once they have been redeemed.
 *
 * A recovery token in window.location outlives the page: it goes into history,
 * and into the Referer header of anything the page loads afterwards. Replacing
 * the entry rather than pushing keeps Back from returning to a URL carrying it.
 */
function scrubUrl() {
    if (typeof window === "undefined")
        return;
    window.history.replaceState({}, document.title, window.location.pathname);
}

export function ResetPasswordForm() {
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [done, setDone] = useState(false);
    const [sessionState, setSessionState] = useState("checking");

    // One client for the lifetime of the page. Rebuilding it per effect run
    // would restart Supabase's URL detection and re-subscribe the listener.
    const [supabase] = useState(() => createClient());

    /**
     * Establishes the recovery session, whichever shape the link arrived in.
     *
     * Supabase has three, and which one a given email produces depends on the
     * template and on how the reset was requested:
     *
     *   ?code=…                  PKCE, from resetPasswordForEmail in this app
     *   ?token_hash=…&type=…     the {{ .TokenHash }} template
     *   #access_token=…&type=…   implicit, and what the dashboard's own
     *                            "Send password recovery" button produces
     *
     * The hash form never reaches the server — fragments are not sent in the
     * request — so it can only be redeemed here. detectSessionInUrl handles it
     * during client construction, and getSession waits on that initialisation,
     * so the third case needs no explicit branch; the first two do, because a
     * PKCE code may still be sitting unexchanged if the callback route could
     * not do it.
     */
    const establishSession = useCallback(async () => {
        const url = new URL(window.location.href);
        const code = url.searchParams.get("code");
        const tokenHash = url.searchParams.get("token_hash");
        const type = url.searchParams.get("type");

        if (code) {
            const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
            if (exchangeError) {
                console.error("[reset-password] code exchange failed:", exchangeError);
                return false;
            }
            return true;
        }

        if (tokenHash) {
            const { error: verifyError } = await supabase.auth.verifyOtp({
                token_hash: tokenHash,
                type: type === "invite" ? "invite" : "recovery",
            });
            if (verifyError) {
                console.error("[reset-password] token_hash verify failed:", verifyError);
                return false;
            }
            return true;
        }

        // Implicit hash, or a session already put in place by the callback
        // route. getSession awaits the client's own initialisation, which is
        // where the fragment is read, so this covers both without a race.
        const { data: { session } } = await supabase.auth.getSession();
        return !!session;
    }, [supabase]);

    useEffect(() => {
        let settled = false;

        function markReady() {
            if (settled)
                return;
            settled = true;
            setSessionState("ready");
            scrubUrl();
        }

        // Subscribed before anything is redeemed, so a PASSWORD_RECOVERY fired
        // by the client's own URL detection cannot land before anyone is
        // listening for it.
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === "PASSWORD_RECOVERY" || (session && (event === "SIGNED_IN" || event === "INITIAL_SESSION"))) {
                markReady();
            }
        });

        void (async () => {
            try {
                if (await establishSession())
                    markReady();
            }
            catch (err) {
                console.error("[reset-password] could not establish recovery session:", err);
            }
        })();

        // Only decides what to render. An exchange that resolves after this
        // still calls markReady and flips the form back on.
        const timer = setTimeout(() => {
            if (!settled)
                setSessionState("missing");
        }, RECOVERY_TIMEOUT_MS);

        return () => {
            clearTimeout(timer);
            subscription.unsubscribe();
        };
    }, [supabase, establishSession]);

    async function handleSubmit(e) {
        e.preventDefault();
        if (loading)
            return;
        if (password.length < MIN_PASSWORD_LENGTH) {
            setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
            return;
        }
        if (password !== confirm) {
            setError("Passwords do not match");
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const { error: updateError } = await supabase.auth.updateUser({ password });
            if (updateError) {
                setError(updateError.message);
                return;
            }
            // Sign out before sending them on. The recovery session was granted
            // by an email link alone and never passed the OTP step, so leaving
            // it live would be a way into the panel that skips half the login.
            await supabase.auth.signOut();
            setDone(true);
        }
        catch {
            setError("Could not reach the server. Please try again.");
        }
        finally {
            setLoading(false);
        }
    }

    if (done) {
        return (<div className="bg-white rounded-2xl border border-[var(--color-border)] p-8 shadow-sm text-center">
        <div className="w-12 h-12 bg-[var(--color-forest-green)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-5 h-5 text-[var(--color-forest-green)]" aria-hidden="true"/>
        </div>
        <h3 className="font-display text-2xl text-[var(--color-charcoal)] mb-2">
          Password updated successfully
        </h3>
        <p className="font-body text-sm text-[var(--color-charcoal)]/70">
          Please login with your email, your new password and the code we send
          you.
        </p>
        <Link href="/admin/login" className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-xl bg-[var(--color-forest-green)] font-body text-sm font-medium text-[var(--color-ivory)] transition-opacity hover:opacity-90">
          Go to login
        </Link>
      </div>);
    }

    if (sessionState === "missing") {
        return (<div className="bg-white rounded-2xl border border-[var(--color-border)] p-8 shadow-sm text-center">
        <h3 className="font-display text-2xl text-[var(--color-charcoal)] mb-2">
          This reset link has expired
        </h3>
        <p className="font-body text-sm text-[var(--color-charcoal)]/70">
          Reset links can only be used once, and they run out after a short
          while. Request a fresh one and it will work.
        </p>
        <Link href="/admin/forgot-password" className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-xl bg-[var(--color-forest-green)] font-body text-sm font-medium text-[var(--color-ivory)] transition-opacity hover:opacity-90">
          Request new link
        </Link>
        <p className="mt-4">
          <Link href="/admin/login" className="inline-flex items-center gap-1.5 font-body text-xs text-[var(--color-charcoal)]/60 transition-colors hover:text-[var(--color-charcoal)]">
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true"/>
            Back to login
          </Link>
        </p>
      </div>);
    }

    return (<div className="bg-white rounded-2xl border border-[var(--color-border)] p-8 shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="newPassword" className={LABEL_CLS}>
            New Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted)]" aria-hidden="true"/>
            <input id="newPassword" type={showPassword ? "text" : "password"} autoComplete="new-password" value={password} onChange={(e) => { setPassword(e.target.value); setError(null); }} placeholder="••••••••••" minLength={MIN_PASSWORD_LENGTH} required disabled={sessionState !== "ready"} className={INPUT_CLS}/>
            <button type="button" onClick={() => setShowPassword((v) => !v)} aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)] transition-colors hover:text-[var(--color-charcoal)]">
              {showPassword ? (<EyeOff className="w-4 h-4"/>) : (<Eye className="w-4 h-4"/>)}
            </button>
          </div>
          <p className="mt-1.5 font-body text-xs text-[var(--color-muted)]">
            At least {MIN_PASSWORD_LENGTH} characters.
          </p>
        </div>

        <div>
          <label htmlFor="confirmPassword" className={LABEL_CLS}>
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted)]" aria-hidden="true"/>
            <input id="confirmPassword" type={showPassword ? "text" : "password"} autoComplete="new-password" value={confirm} onChange={(e) => { setConfirm(e.target.value); setError(null); }} placeholder="••••••••••" required disabled={sessionState !== "ready"} className={INPUT_CLS}/>
          </div>
        </div>

        {error && (<p role="alert" className="font-body text-xs text-[var(--color-error)]">
            {error}
          </p>)}

        <button type="submit" disabled={loading || sessionState !== "ready" || !password || !confirm} className="w-full py-3 rounded-xl bg-[var(--color-forest-green)] text-[var(--color-ivory)] font-body font-medium text-sm tracking-wide transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed">
          {sessionState === "checking" ? "Verifying link…" : loading ? "Updating…" : "Update Password"}
        </button>
      </form>
    </div>);
}
