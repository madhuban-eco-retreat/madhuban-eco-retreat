"use client";

// Error boundary for /admin/*. Without one, any throw in an admin Server
// Component renders the framework's bare "server error" screen, which gives an
// admin no way to tell a transient blip from a broken deployment.
//
// Next strips Server Component error messages in production and leaves only
// `digest`, so this cannot show the underlying text — it shows the digest,
// which is what correlates the screen with the hosting platform's logs.
export default function AdminError({ error, reset }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-cream)] px-6 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl border border-[var(--color-border)] p-8 shadow-sm">
        <h1 className="font-display text-3xl text-[var(--color-earth-brown)] mb-3">
          Something went wrong
        </h1>
        <p className="font-body text-sm text-[var(--color-charcoal)]/70 mb-6">
          The admin panel could not load. If this persists, check the
          deployment logs — a build missing its Supabase credentials fails this
          way and is only fixed by redeploying.
        </p>

        {error?.digest && (
          <p className="font-body text-xs text-[var(--color-muted)] mb-6">
            Reference:{" "}
            <span className="font-mono text-[var(--color-charcoal)]">
              {error.digest}
            </span>
          </p>
        )}

        <button
          onClick={reset}
          className="w-full py-3 rounded-xl bg-[var(--color-forest-green)] text-[var(--color-ivory)] font-body font-medium text-sm tracking-wide transition-opacity hover:opacity-90"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
