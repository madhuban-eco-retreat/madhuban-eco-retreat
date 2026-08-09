"use client";
import { useState, useEffect } from "react";
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

const INPUT_CLS =
    "w-full pl-10 pr-11 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-cream)] font-body text-sm text-[var(--color-charcoal)] placeholder:text-[var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-earth-brown)]/30 focus:border-[var(--color-earth-brown)] transition-colors";
const LABEL_CLS =
    "block font-body text-xs font-semibold tracking-wider uppercase text-[var(--color-charcoal)]/60 mb-2";

export function ResetPasswordForm() {
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [done, setDone] = useState(false);
    const [sessionState, setSessionState] = useState("checking");

    // The recovery session is established by the auth callback before this page
    // renders. Checking for it up front means an expired or already-used link
    // is called out immediately, rather than after the visitor has typed a
    // password twice and pressed the button.
    useEffect(() => {
        let cancelled = false;
        void (async () => {
            try {
                const supabase = createClient();
                const { data: { session } } = await supabase.auth.getSession();
                if (!cancelled)
                    setSessionState(session ? "ready" : "missing");
            }
            catch {
                if (!cancelled)
                    setSessionState("missing");
            }
        })();
        return () => { cancelled = true; };
    }, []);

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
            const supabase = createClient();
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
          Request a new link
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
          {sessionState === "checking" ? "Checking link…" : loading ? "Updating…" : "Update Password"}
        </button>
      </form>
    </div>);
}
