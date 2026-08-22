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
    const image = ogImage ?? DEFAULT_OG_IMAGE;
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
            images: [{ url: image, width: 1200, height: 630, alt: imageAlt }],
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
