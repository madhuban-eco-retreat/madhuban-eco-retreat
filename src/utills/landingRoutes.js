export const LANDING_ROUTE_PREFIXES = [
  "/escape-bhopal",
  "/day-outing-bhopal",
  "/jungle-resort-bhopal",
];

export function isLandingRoute(pathname) {
  if (!pathname) return false;
  return LANDING_ROUTE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}
