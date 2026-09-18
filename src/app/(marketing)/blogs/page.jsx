// Renders on every request so a newly published blog and the correct
// totalPages (which drives the Load More button) are always current. Only
// valid in a route-segment file (page/layout/route), not a component.
export const dynamic = "force-dynamic";

import { buildMetadata } from "@/lib/seo";
import React from "react";
import NewBlogPage from "@/components/blog/NewBlog";
import SEO from "@/components/seo/Seo";
import { getAllBlogs, getAllCategories } from "@/lib/blog/queries";

const BASE_URL = "https://www.madhubanecoretreat.com";

const buildBlogsSchema = (blogs) => ({
  "@context": "https://schema.org",
  "@type": "Blog",
  "@id": `${BASE_URL}/blogs`,
  name: "Madhuban Eco Retreat Blogs",
  description:
    "Nature stories, eco-travel guides, wildlife insights and sustainable living tips from Madhuban Eco Retreat, Ratapani.",
  url: `${BASE_URL}/blogs`,
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
    itemListElement: blogs.map((blog, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      url: `${BASE_URL}/blogs/${blog.slug}`,
    })),
  },
});

const LIMIT = 9;

// Rewired from the MongoDB-backed services/blog/blogServices to the Supabase
// query layer in lib/blog/queries — the data source the admin panel actually
// writes to. This, plus renaming the [id] route to [slug], is what makes the
// sitemap's /blogs/<slug> URLs (already Supabase-sourced) resolve correctly
// instead of 404ing.
const BlogPage = async () => {
  const [posts, categories] = await Promise.all([
    getAllBlogs({ page: 1, limit: LIMIT }),
    getAllCategories(),
  ]);
  const blogs = posts?.blogs ?? [];
  const blogSchema = buildBlogsSchema(blogs);

  return (
    <>
      <SEO schemas={[blogSchema]} />
      <NewBlogPage
        blogs={blogs}
        posts={posts}
        categories={categories}
        description="Nature stories, eco-travel guides, wildlife insights and sustainable living tips from Ratapani."
      />
    </>
  );
};

export default BlogPage;

export const metadata = buildMetadata({
  title: "Madhuban Blog | Nature, Travel & Eco-Living Stories",
  description:
    "Read nature stories, travel guides, wildlife insights, and eco-living tips from Madhuban Eco Retreat. Explore Ratapani and sustainable travel through our blog.",
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
