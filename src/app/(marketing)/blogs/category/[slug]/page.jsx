export const dynamic = "force-dynamic";

import { buildMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";
import NewBlogPage from "@/components/blog/NewBlog";
import SEO from "@/components/seo/Seo";
import {
  getAllBlogs,
  getAllCategories,
  getCategoryBySlug,
} from "@/lib/blog/queries";

const BASE_URL = "https://www.madhubanecoretreat.com";
const LIMIT = 9;

function buildCategorySchema(category, blogs) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${BASE_URL}/blogs/category/${category.slug}`,
    name: category.meta_title || `${category.name} — Madhuban Eco Retreat Blog`,
    description: category.meta_description || category.description,
    url: `${BASE_URL}/blogs/category/${category.slug}`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: blogs.map((blog, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        url: `${BASE_URL}/blogs/${blog.slug}`,
      })),
    },
  };
}

const CategoryPage = async ({ params }) => {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const [posts, categories] = await Promise.all([
    getAllBlogs({ page: 1, limit: LIMIT, category: slug }),
    getAllCategories(),
  ]);
  const blogs = posts?.blogs ?? [];

  return (
    <>
      <SEO schemas={[buildCategorySchema(category, blogs)]} />
      <NewBlogPage
        blogs={blogs}
        posts={posts}
        categories={categories}
        activeCategorySlug={slug}
        heading={category.name}
        description={category.description}
      />
    </>
  );
};

export default CategoryPage;

export async function generateStaticParams() {
  const categories = await getAllCategories();
  return categories.map((cat) => ({ slug: cat.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return buildMetadata({
      title: "Category not found",
      description: "This blog category is not available.",
      path: `/blogs/category/${slug}`,
      noIndex: true,
    });
  }

  return buildMetadata({
    title: category.meta_title || `${category.name} — Madhuban Eco Retreat Blog`,
    description:
      category.meta_description ||
      category.description ||
      `Read ${category.name} stories, guides and insights from Madhuban Eco Retreat, Ratapani.`,
    path: `/blogs/category/${slug}`,
    ogImage: category.image_url,
    ogImageAlt: category.image_alt,
    ogType: "website",
  });
}
