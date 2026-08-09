import { createBrowserClient } from "@supabase/ssr";
import {
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  assertSupabaseConfigured,
} from "./env";

// Browser client for "use client" modules (admin login, magic-link flow).
// Uses the anon key only — RLS is what protects the data here.
export function createClient() {
  // Same build-time substitution caveat as the server client: if the build ran
  // without the public vars, these are undefined in the browser bundle too, and
  // the magic-link submit would otherwise fail with an opaque Supabase error.
  assertSupabaseConfigured();

  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
