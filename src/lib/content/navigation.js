/**
 * Single source of truth for header and footer navigation.
 *
 * Structure mirrors the reference build (a short primary bar plus an "Explore"
 * dropdown, and a four-column footer). The link *targets* are this site's own —
 * every route that was in the old header and footer is still here, just
 * regrouped. The reference's Aranyashala and Souvenir Shop entries are omitted
 * because those pages do not exist in this project.
 */

import { BUSINESS } from "./business";

/** Header — always-visible bar. */
export const PRIMARY_NAV = [
  { label: "Home", href: "/" },
  { label: "Stay", href: "/stay-in-ratapani-tiger-reserve" },
  { label: "Dining", href: "/dining" },
  { label: "Day Outing", href: "/day-outing" },
];

/** Header — grouped under the "Explore" dropdown. */
export const EXPLORE_NAV = [
  { label: "About", href: "/about-us" },
  { label: "Experiences", href: "/experiences" },
  { label: "Gallery", href: "/gallery" },
  { label: "Blogs", href: "/blogs" },
  { label: "Nearby Attractions", href: "/nearby-attractions" },
  { label: "Contact", href: "/contact-us" },
];

/** Footer column 2. */
export const FOOTER_EXPLORE = [
  { label: "About", href: "/about-us" },
  { label: "Stay", href: "/stay-in-ratapani-tiger-reserve" },
  { label: "Experiences", href: "/experiences" },
  { label: "Dining", href: "/dining" },
  { label: "Gallery", href: "/gallery" },
  { label: "Blogs", href: "/blogs" },
];

/**
 * Footer column 3. The three experience detail pages used to sit behind a
 * click-to-open dropdown inside the footer; they are plain links now.
 */
export const FOOTER_VISIT = [
  { label: "Plan Your Retreat", href: "/booking" },
  { label: "Day Outing", href: "/day-outing" },
  {
    label: "Forest Walks & Nature Trails",
    href: "/experiences/forest-walks-and-nature-trails",
  },
  {
    label: "Bird Watching & Wilderness",
    href: "/experiences/bird-watching-and-wilderness",
  },
  { label: "Recreational Facilities", href: "/experiences/recreational-facilities" },
  { label: "Nearby Attractions", href: "/nearby-attractions" },
  { label: "Contact", href: "/contact-us" },
  {
    label: "View on Google Maps",
    href: `https://www.google.com/maps/search/?api=1&query=${BUSINESS.geo.latitude},${BUSINESS.geo.longitude}`,
    external: true,
  },
];

export const LEGAL_NAV = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms-and-condition" },
  { label: "Cookie Policy", href: "/cookies-and-consent-policy" },
  { label: "Disclaimer", href: "/disclaimer" },
];

export function isLinkActive(pathname, href) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export function isExploreActive(pathname) {
  return EXPLORE_NAV.some((item) => isLinkActive(pathname, item.href));
}
