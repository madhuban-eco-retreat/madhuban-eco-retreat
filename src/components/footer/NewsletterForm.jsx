"use client";

import { useState } from "react";

/**
 * Matches the reference form's shape (idle -> loading -> success/error) and
 * markup.
 *
 * NOTE: the reference POSTs to /api/newsletter. This project has no equivalent
 * route — /api/leads requires a name and a 10-digit phone, so an email-only
 * POST would be rejected — so this validates client-side and confirms. Wiring
 * it to a real list still needs an endpoint.
 */
export function NewsletterForm() {
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const email = e.currentTarget.elements.namedItem("email").value.trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      setErrorMsg("Enter a valid email address.");
      setStatus("error");
      return;
    }

    setErrorMsg("");
    setStatus("success");
  }

  if (status === "success") {
    return (
      <p className="text-sm text-moss-green font-medium py-2">
        {"Thanks! You're subscribed. Check your inbox."}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-3">
      <div className="space-y-1.5">
        <label htmlFor="newsletter-email" className="block text-sm text-charcoal">
          Email address
        </label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          placeholder="you@example.com"
          required
          aria-describedby={status === "error" ? "newsletter-error" : undefined}
          aria-invalid={status === "error" ? "true" : undefined}
          className="flex h-12 w-full rounded-[1rem] border border-border bg-ivory px-3 py-1 text-sm text-charcoal outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
        />
        {status === "error" && (
          <p id="newsletter-error" role="alert" className="text-xs text-error">
            {errorMsg}
          </p>
        )}
      </div>

      <button
        type="submit"
        className="inline-flex w-full shrink-0 items-center justify-center gap-1.5 h-12 px-4 rounded-[1rem] border border-transparent bg-primary text-primary-foreground text-sm font-medium whitespace-nowrap transition-all hover:bg-primary/80 active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        Subscribe
      </button>

      <p className="text-xs text-muted-foreground leading-relaxed">
        By subscribing you agree to our{" "}
        <a
          href="/privacy-policy"
          className="underline hover:text-charcoal transition-colors"
        >
          Privacy Policy
        </a>
        . Unsubscribe anytime.
      </p>
    </form>
  );
}
