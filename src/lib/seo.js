const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.madhubanecoretreat.com';
const SITE_NAME = 'Madhuban Eco Retreat';
const DEFAULT_OG_IMAGE =
    'https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/logo/madhuban-og-social-1200x630.jpg';
/**
 * Builds Next.js Metadata for a page. Use in every page's generateMetadata() or as a static export.
 *
 * @example
 * export const metadata = buildMetadata({
 *   title: 'Safari Tent Accommodation',
 *   description: 'Sleep under canvas in our safari tent...',
 *   path: '/stay/safari-tent',
 *   keywords: ['safari tent near bhopal', 'eco stay ratapani'],
 * });
 */
export function buildMetadata({ title, description, path, ogImage, ogImageAlt, noIndex = false, titleOverride, keywords, ogType = 'website', }) {
    const canonical = `${BASE_URL}${path}`;
    // Social scrapers (Facebook, WhatsApp, LinkedIn) do not decode AVIF, and
    // WhatsApp is unreliable with WebP. An unreadable og:image makes the
    // scraper fall back to crawling the page for any image it can parse, which
    // is how unrelated icons end up as the preview. Anything in those formats
    // is swapped for the dedicated 1200x630 JPEG social card.
    const requested = ogImage ?? DEFAULT_OG_IMAGE;
    const scraperSafe = !/\.(avif|webp)(\?|$)/i.test(requested);
    const image = scraperSafe ? requested : DEFAULT_OG_IMAGE;
    // Only the dedicated card is known to be exactly 1200x630. Declaring those
    // dimensions for an arbitrary photo misreports it to the scraper, so they
    // are emitted only when they are actually true.
    const isDefaultCard = image === DEFAULT_OG_IMAGE;
    const imageAlt = ogImageAlt ?? 'Madhuban Eco Retreat — Eco-Luxury Forest Resort near Bhopal';
    return {
        metadataBase: new URL(BASE_URL),
        title: titleOverride ? { absolute: titleOverride } : title,
        description,
        ...(keywords?.length && { keywords }),
        alternates: {
            canonical,
            languages: {
                'en-IN': canonical,
                'x-default': canonical,
            },
        },
        openGraph: {
            title: titleOverride ?? title,
            description,
            url: canonical,
            siteName: SITE_NAME,
            images: [
                isDefaultCard
                    ? { url: image, width: 1200, height: 630, alt: imageAlt }
                    : { url: image, alt: imageAlt },
            ],
            locale: 'en_IN',
            type: ogType,
        },
        twitter: {
            card: 'summary_large_image',
            site: '@madhubanretreat',
            title: titleOverride ?? title,
            description,
            images: [{ url: image, alt: imageAlt }],
        },
        ...(noIndex && {
            robots: {
                index: false,
                follow: false,
            },
        }),
    };
}
