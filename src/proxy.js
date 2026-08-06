import { NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

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
  return updateSession(request, response);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|css|js|ico|woff|woff2)$).*)",
  ],
};
