"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, ArrowLeft, ShieldCheck } from "lucide-react";

const OTP_LENGTH = 6;
/** Resend stays locked for a minute so the button cannot be used as a mail cannon. */
const RESEND_COOLDOWN_SECONDS = 60;

const INPUT_CLS =
    "w-full pl-10 pr-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-cream)] font-body text-sm text-[var(--color-charcoal)] placeholder:text-[var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-earth-brown)]/30 focus:border-[var(--color-earth-brown)] transition-colors";
const LABEL_CLS =
    "block font-body text-xs font-semibold tracking-wider uppercase text-[var(--color-charcoal)]/60 mb-2";
const BUTTON_CLS =
    "w-full py-3 rounded-xl bg-[var(--color-forest-green)] text-[var(--color-ivory)] font-body font-medium text-sm tracking-wide transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed";

export function LoginForm() {
    const [step, setStep] = useState("credentials");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    function handlePasswordStepDone(verifiedEmail) {
        setEmail(verifiedEmail);
        setStep("otp");
        setError(null);
        // The password is of no further use to this page, and holding it in
        // component state through the OTP screen only widens where it can leak.
        setPassword("");
    }

    async function handleCredentials(e) {
        e.preventDefault();
        if (!email || !password || loading)
            return;
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/admin/auth/password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
                setError(data.error ?? "Invalid email or password");
                return;
            }
            handlePasswordStepDone(data.email ?? email.trim().toLowerCase());
        }
        catch {
            setError("Could not reach the server. Please try again.");
        }
        finally {
            setLoading(false);
        }
    }

    function handleBackToLogin() {
        setStep("credentials");
        setError(null);
    }

    if (step === "otp") {
        return (<OtpStep email={email} onBack={handleBackToLogin} onVerified={() => {
                // A full navigation rather than router.push: the session cookie was
                // just set on this response, and the admin layout must be rendered
                // by a request that carries it.
                window.location.assign("/admin");
            }}/>);
    }

    return (<div className="bg-white rounded-2xl border border-[var(--color-border)] p-8 shadow-sm">
      <form onSubmit={handleCredentials} className="space-y-4">
        <div>
          <label htmlFor="email" className={LABEL_CLS}>
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted)]" aria-hidden="true"/>
            <input id="email" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@madhubanecoretreat.com" required className={INPUT_CLS}/>
          </div>
        </div>

        <div>
          <label htmlFor="password" className={LABEL_CLS}>
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted)]" aria-hidden="true"/>
            <input id="password" type={showPassword ? "text" : "password"} autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required className={`${INPUT_CLS} pr-11`}/>
            <button type="button" onClick={() => setShowPassword((v) => !v)} aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)] transition-colors hover:text-[var(--color-charcoal)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-earth-brown)]/30 rounded">
              {showPassword ? (<EyeOff className="w-4 h-4"/>) : (<Eye className="w-4 h-4"/>)}
            </button>
          </div>
        </div>

        {error && (<p role="alert" className="font-body text-xs text-[var(--color-error)]">
            {error}
          </p>)}

        <button type="submit" disabled={loading || !email || !password} className={BUTTON_CLS}>
          {loading ? "Checking…" : "Login"}
        </button>

        <p className="text-center">
          <Link href="/admin/forgot-password" className="font-body text-xs text-[var(--color-earth-brown)] underline-offset-4 hover:underline">
            Forgot password?
          </Link>
        </p>
      </form>
    </div>);
}

/**
 * Six separate boxes rather than one field.
 *
 * Codes arrive to be read off an email and typed in a hurry, and the digit
 * boxes make position obvious and a mistake easy to see. The cost is that
 * paste, backspace and arrow keys all have to be wired by hand — a single
 * input gets those free — so each is handled explicitly below.
 */
function OtpStep({ email, onBack, onVerified }) {
    const [digits, setDigits] = useState(() => Array(OTP_LENGTH).fill(""));
    const [verifying, setVerifying] = useState(false);
    const [resending, setResending] = useState(false);
    const [error, setError] = useState(null);
    const [notice, setNotice] = useState(null);
    const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_SECONDS);
    const inputsRef = useRef([]);
    const submittedRef = useRef(false);

    useEffect(() => {
        inputsRef.current[0]?.focus();
    }, []);

    useEffect(() => {
        if (cooldown <= 0)
            return;
        const id = setTimeout(() => setCooldown((n) => n - 1), 1000);
        return () => clearTimeout(id);
    }, [cooldown]);

    const submit = useCallback(async (code) => {
        if (submittedRef.current)
            return;
        submittedRef.current = true;
        setVerifying(true);
        setError(null);
        setNotice(null);
        try {
            const res = await fetch("/api/admin/auth/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token: code }),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
                setError(data.error ?? "Invalid or expired OTP");
                setDigits(Array(OTP_LENGTH).fill(""));
                inputsRef.current[0]?.focus();
                return;
            }
            onVerified();
        }
        catch {
            setError("Could not reach the server. Please try again.");
        }
        finally {
            setVerifying(false);
            submittedRef.current = false;
        }
    }, [onVerified]);

    function writeDigits(next, focusIndex) {
        setDigits(next);
        if (focusIndex !== undefined) {
            inputsRef.current[Math.min(focusIndex, OTP_LENGTH - 1)]?.focus();
        }
        const code = next.join("");
        // Six digits present means there is nothing left to type — waiting for a
        // button press at that point is a step the guest has already finished.
        if (code.length === OTP_LENGTH && next.every(Boolean)) {
            void submit(code);
        }
    }

    function handleChange(index, raw) {
        const value = raw.replace(/\D/g, "");
        if (!value) {
            const next = [...digits];
            next[index] = "";
            setDigits(next);
            return;
        }
        // Typing over a filled box, or a code pasted into the middle one, both
        // arrive here — spread the digits forward from this position.
        const next = [...digits];
        for (let i = 0; i < value.length && index + i < OTP_LENGTH; i += 1) {
            next[index + i] = value[i];
        }
        writeDigits(next, index + value.length);
    }

    function handleKeyDown(index, e) {
        if (e.key === "Backspace") {
            e.preventDefault();
            const next = [...digits];
            if (next[index]) {
                next[index] = "";
                setDigits(next);
            }
            else if (index > 0) {
                next[index - 1] = "";
                setDigits(next);
                inputsRef.current[index - 1]?.focus();
            }
            return;
        }
        if (e.key === "ArrowLeft" && index > 0) {
            e.preventDefault();
            inputsRef.current[index - 1]?.focus();
        }
        if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
            e.preventDefault();
            inputsRef.current[index + 1]?.focus();
        }
    }

    function handlePaste(e) {
        const text = (e.clipboardData.getData("text") ?? "").replace(/\D/g, "").slice(0, OTP_LENGTH);
        if (!text)
            return;
        e.preventDefault();
        const next = Array(OTP_LENGTH).fill("");
        for (let i = 0; i < text.length; i += 1)
            next[i] = text[i];
        writeDigits(next, text.length);
    }

    async function handleResend() {
        if (cooldown > 0 || resending)
            return;
        setResending(true);
        setError(null);
        setNotice(null);
        try {
            const res = await fetch("/api/admin/auth/resend-otp", { method: "POST" });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
                setError(data.error ?? "Could not resend your code.");
                return;
            }
            setNotice("A new code is on its way.");
            setDigits(Array(OTP_LENGTH).fill(""));
            setCooldown(RESEND_COOLDOWN_SECONDS);
            inputsRef.current[0]?.focus();
        }
        catch {
            setError("Could not reach the server. Please try again.");
        }
        finally {
            setResending(false);
        }
    }

    const code = digits.join("");
    const complete = code.length === OTP_LENGTH && digits.every(Boolean);

    return (<div className="bg-white rounded-2xl border border-[var(--color-border)] p-8 shadow-sm">
      <div className="text-center">
        <div className="w-12 h-12 bg-[var(--color-forest-green)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShieldCheck className="w-5 h-5 text-[var(--color-forest-green)]" aria-hidden="true"/>
        </div>
        <h3 className="font-display text-2xl text-[var(--color-charcoal)] mb-2">
          Check your email
        </h3>
        <p className="font-body text-sm text-[var(--color-charcoal)]/70">
          We sent a 6-digit code to{" "}
          <span className="font-medium text-[var(--color-charcoal)]">{email}</span>
        </p>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); if (complete) void submit(code); }} className="mt-6 space-y-4">
        <div className="flex justify-center gap-2" onPaste={handlePaste}>
          {digits.map((digit, index) => (<input key={index} ref={(el) => { inputsRef.current[index] = el; }} type="text" inputMode="numeric" autoComplete={index === 0 ? "one-time-code" : "off"} maxLength={OTP_LENGTH} value={digit} disabled={verifying} onChange={(e) => handleChange(index, e.target.value)} onKeyDown={(e) => handleKeyDown(index, e)} onFocus={(e) => e.target.select()} aria-label={`Digit ${index + 1} of ${OTP_LENGTH}`} className="h-14 w-11 rounded-xl border border-[var(--color-border)] bg-[var(--color-cream)] text-center font-body text-xl font-semibold text-[var(--color-charcoal)] focus:outline-none focus:ring-2 focus:ring-[var(--color-earth-brown)]/30 focus:border-[var(--color-earth-brown)] disabled:opacity-60 transition-colors"/>))}
        </div>

        {error && (<p role="alert" className="text-center font-body text-xs text-[var(--color-error)]">
            {error}
          </p>)}
        {notice && (<p role="status" className="text-center font-body text-xs text-[var(--color-forest-green)]">
            {notice}
          </p>)}

        <button type="submit" disabled={!complete || verifying} className={BUTTON_CLS}>
          {verifying ? "Verifying…" : "Verify Code"}
        </button>
      </form>

      <p className="mt-4 text-center font-body text-xs text-[var(--color-charcoal)]/60">
        Didn&rsquo;t receive code?{" "}
        {cooldown > 0 ? (<span className="text-[var(--color-muted)]">Resend in {cooldown}s</span>) : (<button type="button" onClick={() => void handleResend()} disabled={resending} className="text-[var(--color-earth-brown)] underline-offset-4 hover:underline disabled:opacity-50">
            {resending ? "Sending…" : "Resend"}
          </button>)}
      </p>

      <p className="mt-5 text-center">
        <button type="button" onClick={onBack} className="inline-flex items-center gap-1.5 font-body text-xs text-[var(--color-charcoal)]/60 transition-colors hover:text-[var(--color-charcoal)]">
          <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true"/>
          Back to login
        </button>
      </p>

      <p className="mt-4 text-center font-body text-xs text-[var(--color-muted)]">
        The code expires in 10 minutes.
      </p>
    </div>);
}
