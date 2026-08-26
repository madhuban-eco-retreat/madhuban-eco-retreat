import { Suspense } from "react";
import { buildMetadata } from "@/lib/seo";
import SEO from "@/components/seo/Seo";
import { getAllBlogs, getAllCategories } from "@/lib/blog/queries";
import { BlogIndexClient } from "@/components/blog/BlogIndexClient";
import { fetchLegacyBlogs } from "@/lib/blog/legacy-fallback";
import { BlogCardSkeleton } from "@/components/blog/BlogCard";

// Published posts change rarely, and the admin panel is the only writer.
export const revalidate = 300;

const SITE_URL = "https://www.madhubanecoretreat.com";
const PAGE_SIZE = 9;

export const metadata = buildMetadata({
  title: "Blog | Nature & Wildlife Stories from Ratapani",
  description:
    "Read stories about wildlife, nature, travel and sustainability from Madhuban Eco Retreat near Ratapani Tiger Reserve, Bhopal.",
  path: "/blogs",
  keywords: [
    "madhuban blog",
    "ratapani travel blog",
    "eco travel mp",
    "sustainable travel madhya pradesh",
    "nature blog bhopal",
    "ratapani guides",
  ],
});

function buildBlogsSchema(blogs) {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${SITE_URL}/blogs`,
    name: "Madhuban Eco Retreat Blogs",
    description:
      "Nature stories, eco-travel guides, wildlife insights and sustainable living tips from Madhuban Eco Retreat, Ratapani.",
    url: `${SITE_URL}/blogs`,
    publisher: {
      "@type": "Organization",
      name: "Madhuban Eco Retreat",
      logo: {
        "@type": "ImageObject",
        url: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/logo/madhuban-eco-retreat-bhopal-logo.png",
      },
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: blogs.map((blog, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${SITE_URL}/blogs/${blog.slug}`,
        name: blog.title,
      })),
    },
  };
}

function GridSkeleton() {
  return (
    <div className="px-4 py-14">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <BlogCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

/**
 * Fetches the first page and the category list together.
 *
 * Split into its own component so the shell — header, hero — streams
 * immediately and only the data-dependent part waits behind Suspense.
 */
async function BlogIndex() {
  const [supabaseResult, categories] = await Promise.all([
    getAllBlogs({ page: 1, limit: PAGE_SIZE }),
    getAllCategories(),
  ]);

  // Supabase holds every post and is the system of record. The retired MongoDB
  // backend is consulted only when Supabase answers successfully with nothing
  // at all, so an outage degrades to stale content rather than a blank page.
  // See legacy-fallback.js — it logs loudly, because this hides a real fault.
  const { blogs, total } =
    supabaseResult.blogs.length > 0
      ? supabaseResult
      : await fetchLegacyBlogs(PAGE_SIZE);

  return (
    <>
      <SEO schemas={[buildBlogsSchema(blogs)]} />
      <BlogIndexClient
        initialBlogs={blogs}
        initialTotal={total}
        categories={categories.map((c) => ({ slug: c.slug, name: c.name }))}
      />
    </>
  );
}

export default function BlogsPage() {
  return (
    <main className="min-h-screen bg-[#FBF9F5]">
      <Suspense fallback={<GridSkeleton />}>
        <BlogIndex />
      </Suspense>
    </main>
  );
}
