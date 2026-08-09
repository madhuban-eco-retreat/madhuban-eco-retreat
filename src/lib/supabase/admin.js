import "server-only";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL } from "./env";

// Service-role client: bypasses RLS. Server-only — never import from a
// "use client" module or the key ends up in the browser bundle.
export function createAdminClient() {
  // SUPABASE_SERVICE_ROLE_KEY carries no NEXT_PUBLIC_ prefix, so unlike the URL
  // it is read at request time rather than baked into the bundle — the two can
  // fail independently and are reported separately here.
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const missing = [
    SUPABASE_URL ? null : "NEXT_PUBLIC_SUPABASE_URL",
    serviceRoleKey ? null : "SUPABASE_SERVICE_ROLE_KEY",
  ].filter(Boolean);

  if (missing.length > 0) {
    throw new Error(
      `Supabase admin client unavailable — ${missing.join(" and ")} not set.`,
    );
  }

  return createClient(SUPABASE_URL, serviceRoleKey);
}
