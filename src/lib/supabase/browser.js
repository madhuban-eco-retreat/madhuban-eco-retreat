import { createBrowserClient } from "@supabase/ssr";

// Browser client for "use client" modules (admin login, magic-link flow).
// Uses the anon key only — RLS is what protects the data here.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}
