import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import {
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  assertSupabaseConfigured,
} from "./env";

// Cookie-bound client for requests where the auth session matters (admin pages,
// admin API routes). Reading cookies opts the route out of static rendering —
// use ./public for anon reads on cacheable pages.
export async function createClient() {
  // Fail with a message that names the actual cause. Without this, a build
  // missing the public env vars reaches createServerClient(undefined, undefined)
  // and throws "Your project's URL and Key are required", which reads like a
  // Supabase outage and sends you looking in the wrong place. The admin error
  // boundary renders SupabaseConfigError with recovery steps.
  assertSupabaseConfigured();

  const cookieStore = await cookies();
  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {}
      },
    },
  });
}
