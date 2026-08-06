/**
 * Supabase connection config, resolved once and validated in one place.
 *
 * WHY THIS FILE EXISTS
 * NEXT_PUBLIC_* values are substituted by the bundler during `next build` —
 * they are not read from the environment when the request runs. A deployment
 * built while these were unset stays broken until it is REBUILT; adding them
 * in the Vercel dashboard afterwards does nothing for an already-built
 * deployment. That failure mode is invisible without a check, which is why
 * next.config.mjs asserts on these at build time.
 *
 * These must stay written as complete static `process.env.X` member
 * expressions. Destructuring (`const { NEXT_PUBLIC_... } = process.env`) or
 * dynamic lookup (`process.env[name]`) defeats the substitution and yields
 * undefined in the browser and in the proxy bundle.
 */
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** Names of the required vars that are missing; empty when fully configured. */
export function missingSupabaseEnv() {
  return [
    SUPABASE_URL ? null : "NEXT_PUBLIC_SUPABASE_URL",
    SUPABASE_ANON_KEY ? null : "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  ].filter(Boolean);
}

export function isSupabaseConfigured() {
  return missingSupabaseEnv().length === 0;
}

/**
 * Thrown instead of letting @supabase/ssr fail with its generic "URL and Key
 * are required" message, which gives no hint that the cause is a build-time
 * substitution rather than a runtime environment problem.
 */
export class SupabaseConfigError extends Error {
  constructor(missing = missingSupabaseEnv()) {
    super(
      `Supabase is not configured — ${missing.join(" and ")} ` +
        `${missing.length === 1 ? "was" : "were"} unset when this build ran. ` +
        `NEXT_PUBLIC_* values are baked in by \`next build\`, so setting them ` +
        `in the hosting dashboard is not enough: the deployment must be rebuilt.`,
    );
    this.name = "SupabaseConfigError";
    this.missing = missing;
  }
}

/** Throws SupabaseConfigError unless both public Supabase vars are present. */
export function assertSupabaseConfigured() {
  const missing = missingSupabaseEnv();
  if (missing.length > 0) throw new SupabaseConfigError(missing);
}
