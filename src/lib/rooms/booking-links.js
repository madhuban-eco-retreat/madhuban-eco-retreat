/**
 * Where every "Book Now" / "Book Your Stay" CTA on the site points.
 *
 * Kept in one module because these links were previously all hardcoded to
 * /booking, and the room slugs they depend on are the same strings the rooms
 * table stores. When a slug is re-slugged, this file and the redirect list in
 * next.config.mjs are the two places that must move together.
 */

/** Slugs as stored in the rooms table — these form the /book/[slug] routes. */
export const ROOM_SLUGS = {
  safariTent: "safari-tent",
  glampingTent: "glamping-tents",
  mudHouseStandard: "mud-house-standard",
  mudHousePremium: "mud-house-premium",
  poolSideVilla: "pool-side-villa",
};

/** Room index — the destination for a CTA that names no particular room. */
export const ALL_ROOMS_URL = "/stay-in-ratapani-tiger-reserve";

/** Booking-engine URL for a bookable room. */
export function bookUrl(slug) {
  return `/book/${slug}`;
}

/**
 * Camping is sold per person on request rather than per room-night, so it has
 * no row in the booking engine and no /book/[slug] route. Enquiries go to
 * WhatsApp instead.
 */
export const CAMPING_WHATSAPP_URL =
  "https://wa.me/919770558419?text=Hi%2C%20I%20am%20interested%20in%20Camping%20at%20Madhuban%20Eco%20Retreat.%20Please%20share%20availability%20and%20details.";

/**
 * Marketing stay page for a booking-engine room slug.
 *
 * The two sets are not one-to-one: the mud house has a single marketing page
 * covering both room types, so mud-house-premium has no page of its own and
 * borrows the standard one. Anything unrecognised falls back to the index
 * rather than producing a 404.
 */
export function stayPageForRoomSlug(slug) {
  const pages = {
    "safari-tent": "safari-tent",
    "glamping-tents": "glamping-tents",
    "camping-tent": "camping-tent",
    "pool-side-villa": "pool-side-villa",
    "mud-house-standard": "mud-house-standard",
    "mud-house-premium": "mud-house-standard",
  };
  const page = pages[slug];
  return page ? `${ALL_ROOMS_URL}/${page}` : ALL_ROOMS_URL;
}

/**
 * Per-accommodation CTA config, keyed by the marketing page slug in
 * Stay.functions.jsx. The mud house page sells two distinct room types from a
 * single page, so it carries two CTAs; camping carries an external one.
 */
export const STAY_PAGE_CTAS = {
  "safari-tent": [{ label: "Book Your Stay", href: bookUrl(ROOM_SLUGS.safariTent) }],
  "glamping-tents": [
    { label: "Book Your Stay", href: bookUrl(ROOM_SLUGS.glampingTent) },
  ],
  "pool-side-villa": [
    { label: "Book Your Stay", href: bookUrl(ROOM_SLUGS.poolSideVilla) },
  ],
  "mud-house-standard": [
    {
      label: "Book Standard (₹9,000/night)",
      href: bookUrl(ROOM_SLUGS.mudHouseStandard),
    },
    {
      label: "Book Premium (₹10,000/night)",
      href: bookUrl(ROOM_SLUGS.mudHousePremium),
    },
  ],
  "camping-tent": [
    {
      label: "Enquire on WhatsApp",
      href: CAMPING_WHATSAPP_URL,
      external: true,
    },
  ],
};
