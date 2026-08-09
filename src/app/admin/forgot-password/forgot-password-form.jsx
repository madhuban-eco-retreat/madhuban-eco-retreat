"use client";
import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, MailCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/browser";

const INPUT_CLS =
    "w-full pl-10 pr-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-cream)] font-body text-sm text-[var(--color-charcoal)] placeholder:text-[var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-earth-brown)]/30 focus:border-[var(--color-earth-brown)] transition-colors";

export function ForgotPasswordForm() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState(null);

    async function handleSubmit(e) {
        e.preventDefault();
        if (!email || loading)
            return;
        setLoading(true);
        setError(null);
        try {
            const supabase = createClient();
            // Routed through the auth callback rather than straight at the reset
            // page: the recovery link carries a PKCE code that has to be
            // exchanged for a session before any password can be set, and the
            // callback is the one place that already does that exchange.
            const redirectTo = `${window.location.origin}/admin/auth/callback?next=/admin/reset-password`;
            const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), { redirectTo });
            // A failure here is reported the same as a success. Saying "no such
            // account" would let anyone test which addresses hold admin rights,
            // and the person who typed their own address correctly is told to
            // go and look in their inbox either way.
            if (resetError)
                console.error("[forgot-password]", resetError);
            setSent(true);
        }
        catch {
            setError("Could not reach the server. Please try again.");
        }
        finally {
            setLoading(false);
        }
    }

    if (sent) {
        return (<div className="bg-white rounded-2xl border border-[var(--color-border)] p-8 shadow-sm text-center">
        <div className="w-12 h-12 bg-[var(--color-forest-green)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <MailCheck className="w-5 h-5 text-[var(--color-forest-green)]" aria-hidden="true"/>
        </div>
        <h3 className="font-display text-2xl text-[var(--color-charcoal)] mb-2">
          Check your email for a password reset link
        </h3>
        <p className="font-body text-sm text-[var(--color-charcoal)]/70">
          If{" "}
          <span className="font-medium text-[var(--color-charcoal)]">
            {email}
          </span>{" "}
          has an admin account, a reset link is on its way.
        </p>
        <p className="mt-6">
          <Link href="/admin/login" className="inline-flex items-center gap-1.5 font-body text-xs text-[var(--color-earth-brown)] underline-offset-4 hover:underline">
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true"/>
            Back to login
          </Link>
        </p>
      </div>);
    }

    return (<div className="bg-white rounded-2xl border border-[var(--color-border)] p-8 shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block font-body text-xs font-semibold tracking-wider uppercase text-[var(--color-charcoal)]/60 mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted)]" aria-hidden="true"/>
            <input id="email" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@madhubanecoretreat.com" required className={INPUT_CLS}/>
          </div>
        </div>

        {error && (<p role="alert" className="font-body text-xs text-[var(--color-error)]">
            {error}
          </p>)}

        <button type="submit" disabled={loading || !email} className="w-full py-3 rounded-xl bg-[var(--color-forest-green)] text-[var(--color-ivory)] font-body font-medium text-sm tracking-wide transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed">
          {loading ? "Sending…" : "Send Reset Link"}
        </button>

        <p className="text-center">
          <Link href="/admin/login" className="inline-flex items-center gap-1.5 font-body text-xs text-[var(--color-charcoal)]/60 transition-colors hover:text-[var(--color-charcoal)]">
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true"/>
            Back to login
          </Link>
        </p>
      </form>
    </div>);
}
