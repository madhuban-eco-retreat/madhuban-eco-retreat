import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Cookie-bound client for requests where the auth session matters (admin pages,
// admin API routes). Reading cookies opts the route out of static rendering —
// use ./public for anon reads on cacheable pages.
export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
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
    },
  );
}
