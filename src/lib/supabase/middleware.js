import { createServerClient } from "@supabase/ssr";
import { SUPABASE_URL, SUPABASE_ANON_KEY, missingSupabaseEnv } from "./env";

// Hard cap on how long the auth refresh may block the edge proxy.
// If Supabase is slow/unreachable, we must NOT hang the request — a hung
// proxy surfaces on Vercel as 504 MIDDLEWARE_INVOCATION_TIMEOUT.
const AUTH_TIMEOUT_MS = 3000;

export async function updateSession(request, response) {
  // Guard: skip auth entirely rather than constructing a client with undefined
  // URL/key, which would hang the fetch to getUser() until the invocation
  // times out. Reaching this branch means the BUILD ran without the vars —
  // they are substituted by `next build`, never read per-request — so the
  // message says so instead of implying the running environment is at fault.
  const missing = missingSupabaseEnv();
  if (missing.length > 0) {
    console.warn(
      `[proxy] Supabase not configured — ${missing.join(" and ")} unset at ` +
        `build time; skipping session refresh. Admin routes will not ` +
        `authenticate until this deployment is REBUILT with the vars present.`,
    );
    return response;
  }

  const supabase = createServerClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Refresh the session, but never let it block longer than AUTH_TIMEOUT_MS.
  // Racing against a timeout guarantees the proxy returns even if the Supabase
  // Auth endpoint hangs. Any error (network, timeout, bad config) fails
  // silently so the request is served instead of erroring out.
  try {
    await Promise.race([
      supabase.auth.getUser(),
      new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error("supabase.auth.getUser timed out")),
          AUTH_TIMEOUT_MS,
        ),
      ),
    ]);
  } catch (error) {
    console.warn("[proxy] session refresh skipped:", error);
  }

  return response;
}
