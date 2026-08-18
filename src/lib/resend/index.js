import "server-only";
import { Resend } from "resend";
function requireEnv(name) {
    const value = process.env[name];
    if (!value)
        throw new Error(`Missing required env var: ${name}`);
    return value;
}
// Client is created per-call so env vars are resolved at request time, not
// at module evaluation time (which would fail during `next build`).
/**
 * True on Vercel production only.
 *
 * NODE_ENV is "production" for any built deployment, preview builds and local
 * `next start` included, so it cannot tell a real deployment from a rehearsal.
 * VERCEL_ENV can, and is the only thing the dev override is allowed to consult.
 */
function isProductionDeployment() {
    return process.env.VERCEL_ENV === "production";
}
export async function sendEmail({ to, subject, html, text, replyTo }) {
    const client = new Resend(requireEnv("RESEND_API_KEY"));
    const from = requireEnv("RESEND_FROM_EMAIL");
    const recipients = Array.isArray(to) ? to.filter(Boolean) : [to];
    if (recipients.length === 0)
        throw new Error("sendEmail called with no recipients");
    // Dev override: redirect all outgoing mail to a single address for testing.
    //
    // Ignored on production, no matter what is configured. Left live there it
    // silently swallows every guest confirmation and every staff notification
    // and redirects them to a test inbox — which is exactly what it had been
    // doing. Preview and local builds still honour it.
    let devOverride = process.env.RESEND_DEV_OVERRIDE_TO;
    if (devOverride && isProductionDeployment()) {
        console.warn(`[resend] RESEND_DEV_OVERRIDE_TO is set on production and is being ignored — remove it from the Production environment. Mail is going to its real recipients.`);
        devOverride = undefined;
    }
    const actualTo = devOverride || recipients;
    const actualSubject = devOverride
        ? `[DEV → ${recipients.join(", ")}] ${subject}`
        : subject;
    const { error } = await client.emails.send({
        from,
        to: actualTo,
        subject: actualSubject,
        html,
        ...(text ? { text } : {}),
        ...(replyTo ? { replyTo } : {}),
    });
    if (error)
        throw new Error(error.message);
}
