import { notFound } from "next/navigation";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import SEO from "@/components/seo/Seo";
import { getAllBlogs, getAllCategories } from "@/lib/blog/queries";
import { BlogCard } from "@/components/blog/BlogCard";

export const revalidate = 300;

const SITE_URL = "https://www.madhubanecoretreat.com";

async function findCategory(slug) {
  const categories = await getAllCategories();
  return categories.find((c) => c.slug === slug) ?? null;
}

export async function generateStaticParams() {
  try {
    const categories = await getAllCategories();
    return categories.map((c) => ({ slug: c.slug }));
  } catch (error) {
    console.error("[blogs/category] generateStaticParams failed:", error);
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const category = await findCategory(slug);
  if (!category) return { title: "Category not found | Madhuban Eco Retreat" };

  return buildMetadata({
    title: category.meta_title || `${category.name} Stories`,
    titleOverride: category.meta_title || undefined,
    description:
      category.meta_description ||
      category.description ||
      `Read ${category.name} stories from Madhuban Eco Retreat near Ratapani Tiger Reserve.`,
    path: `/blogs/category/${category.slug}`,
    ogImage: category.image_url || undefined,
  });
}

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  const category = await findCategory(slug);
  if (!category) notFound();

  const { blogs, total } = await getAllBlogs({ page: 1, limit: 24, category: slug });

  const listSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${SITE_URL}/blogs/category/${category.slug}`,
    name: category.name,
    description: category.description || undefined,
    url: `${SITE_URL}/blogs/category/${category.slug}`,
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

  return (
    <main className="min-h-screen bg-[#FBF9F5]">
      <SEO schemas={[listSchema]} />

      <section className="bg-[#F5F0E8] px-4 pb-12 pt-28 sm:pt-32">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[rgb(110,97,70)]">
            Category
          </p>
          <h1 className="font-[family-name:var(--font-primary)] text-3xl text-[rgb(110,97,70)] sm:text-4xl">
            {category.name}
          </h1>
          {category.description && (
            <p className="max-w-2xl text-base leading-relaxed text-[#3a3d45]/75">
              {category.description}
            </p>
          )}
          <p className="text-xs uppercase tracking-[0.18em] text-[#3a3d45]/50">
            {total} {total === 1 ? "story" : "stories"}
          </p>
        </div>
      </section>

      <section className="px-4 py-14">
        <div className="mx-auto max-w-6xl">
          <nav aria-label="Breadcrumb" className="mb-8 text-xs text-[#3a3d45]/55">
            <Link href="/blogs" className="hover:text-[rgb(110,97,70)]">
              Blogs
            </Link>
            <span aria-hidden="true"> / </span>
            <span>{category.name}</span>
          </nav>

          {blogs.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <p className="text-sm text-[#3a3d45]/60">
                No stories in {category.name} yet.
              </p>
              <Link
                href="/blogs"
                className="rounded-full bg-[rgb(110,97,70)] px-5 py-2 text-sm font-medium text-white"
              >
                Browse all stories
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {blogs.map((blog, index) => (
                <BlogCard key={blog.id} blog={blog} priority={index < 3} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
