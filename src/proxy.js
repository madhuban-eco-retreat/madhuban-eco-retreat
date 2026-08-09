import { NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_TTL_SECONDS,
  issueAdminSessionToken,
  readAdminSession,
  sessionCookieOptions,
} from "@/lib/admin/session";

/**
 * Admin paths that must stay reachable without a live admin window — the login
 * itself, the two password-recovery screens, and the callback that puts a
 * recovery session in place. Gating these would lock out the very people they
 * exist to let back in.
 */
const PUBLIC_ADMIN_PATHS = [
  "/admin/login",
  "/admin/forgot-password",
  "/admin/reset-password",
  "/admin/auth",
];

function isProtectedAdminPath(pathname) {
  if (!pathname.startsWith("/admin")) return false;
  return !PUBLIC_ADMIN_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
}

/**
 * Slides the 24-hour admin window forward, or bounces an expired one.
 *
 * The expiry lives in the cookie's own signed payload, so it cannot be extended
 * by the browser — only re-issued here, and only for a request that presented a
 * still-valid one. That gives a session in continuous use an indefinite life
 * and one left alone exactly twenty-four hours, which is the reading of the
 * requirement that does not sign someone out in the middle of a booking.
 *
 * startedAt is carried across re-issues so how long ago a login actually began
 * stays on the record even as the deadline moves.
 */
async function refreshAdminWindow(request, response) {
  const { pathname } = request.nextUrl;
  if (!isProtectedAdminPath(pathname)) return response;

  const marker = await readAdminSession(
    request.cookies.get(ADMIN_SESSION_COOKIE)?.value,
  );

  if (!marker) {
    // Only pages live under /admin — the panel's API surface is /api/admin/*,
    // which this never sees and which assertAdmin() gates on the same cookie.
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = "?expired=1";
    const redirect = NextResponse.redirect(url);
    redirect.cookies.set(ADMIN_SESSION_COOKIE, "", sessionCookieOptions(0));
    return redirect;
  }

  response.cookies.set(
    ADMIN_SESSION_COOKIE,
    await issueAdminSessionToken(marker.email, marker.startedAt ?? Date.now()),
    sessionCookieOptions(ADMIN_SESSION_TTL_SECONDS),
  );
  return response;
}

// Next 16 replaced middleware.js with proxy.js, and a project gets exactly one.
// The booking engine's Supabase session refresh is therefore merged in here
// rather than added as a second file. Redirects run first and return early;
// only pass-through requests pay for the auth refresh.
export async function proxy(request) {
  const { pathname } = request.nextUrl;
  if (pathname.includes("hotel")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Only apply to homepage
  if (request.nextUrl.pathname === "/") {
    const url = request.nextUrl.clone();
    const trackingParams = ["sa", "ved", "fbclid", "gclid"];

    let hasTrackingParams = false;
    trackingParams.forEach((param) => {
      if (url.searchParams.has(param)) {
        hasTrackingParams = true;
        url.searchParams.delete(param);
      }
    });

    if (hasTrackingParams) {
      return NextResponse.redirect(url);
    }
  }

  // Refresh the Supabase auth session so admin routes see a live cookie.
  // updateSession never throws and is capped at 3s — a Supabase outage must not
  // take the public site down with it.
  const response = NextResponse.next({ request });
  const refreshed = await updateSession(request, response);

  // Then the admin window on top. Runs second so an expired admin login is
  // bounced with the Supabase cookies already brought up to date, rather than
  // being redirected and then refreshed on the next request.
  return refreshAdminWindow(request, refreshed);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|css|js|ico|woff|woff2)$).*)",
  ],
};
