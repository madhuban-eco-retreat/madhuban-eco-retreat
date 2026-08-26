import { getPublishedBlogSlugs } from "@/lib/blog/queries";

const sitemapUrls = [
  { url: "/", priority: 1.0 },

  { url: "/about-us", priority: 0.8 },
  { url: "/stay-in-ratapani-tiger-reserve", priority: 0.8 },
  { url: "/experiences", priority: 0.8 },
  { url: "/dining", priority: 0.8 },
  { url: "/nearby-attractions", priority: 0.8 },
  { url: "/gallery", priority: 0.8 },
  { url: "/contact-us", priority: 0.8 },
  { url: "/booking", priority: 0.8 },
  { url: "/day-outing", priority: 0.8 },

  { url: "/experiences/forest-walks-and-nature-trails", priority: 0.8 },
  { url: "/experiences/bird-watching-and-wilderness", priority: 0.8 },
  { url: "/experiences/recreational-facilities", priority: 0.8 },

  { url: "/blogs", priority: 0.8 },
  { url: "/privacy-policy", priority: 0.8 },
  { url: "/terms-and-condition", priority: 0.8 },
  { url: "/cookies-and-consent-policy", priority: 0.8 },
  { url: "/disclaimer", priority: 0.8 },
  { url: "/stay-in-ratapani-tiger-reserve/safari-tent", priority: 0.64 },
  { url: "/stay-in-ratapani-tiger-reserve/mud-house-standard", priority: 0.64 },
  { url: "/stay-in-ratapani-tiger-reserve/pool-side-villa", priority: 0.64 },
  { url: "/stay-in-ratapani-tiger-reserve/glamping-tents", priority: 0.64 },
  { url: "/stay-in-ratapani-tiger-reserve/camping-tent", priority: 0.64 },
];

const BASE_URL = "https://www.madhubanecoretreat.com";

// Static pages carry a fixed date rather than Date.now(): stamping every URL
// with "changed today" on each build tells crawlers nothing and devalues the
// signal. Posts are different — they carry a real updated_at.
const STATIC_LASTMOD = new Date("2026-08-01").toISOString().replace("Z", "+00:00");

// Refreshed hourly so a newly published post becomes discoverable without
// waiting for the next deploy.
export const revalidate = 3600;

export default async function sitemap() {
  let blogEntries = [];
  try {
    // Sourced from Supabase. This previously called the MongoDB backend, which
    // no longer receives new posts — anything written in the admin panel would
    // have been missing from the sitemap entirely.
    const posts = await getPublishedBlogSlugs();
    blogEntries = posts.map((post) => ({
      url: `${BASE_URL}/blogs/${post.slug}`,
      lastModified: new Date(post.updated_at ?? post.published_at ?? STATIC_LASTMOD),
      changeFrequency: "weekly",
      priority: 0.64,
    }));
  } catch (error) {
    // A sitemap missing its posts beats a 500 that costs every static URL too.
    console.error("[sitemap] could not load blog posts:", error);
  }

  return [
    ...sitemapUrls.map((item) => ({
      url: `${BASE_URL}${item.url}`,
      lastModified: STATIC_LASTMOD,
      priority: item.priority,
      changeFrequency: "weekly",
    })),
    ...blogEntries,
  ];
}
