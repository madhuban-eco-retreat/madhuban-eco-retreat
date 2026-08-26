import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Clock, Eye } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import SEO from "@/components/seo/Seo";
import {
  getBlogBySlug,
  getPublishedBlogSlugs,
  getRelatedBlogs,
} from "@/lib/blog/queries";
import { formatBlogDate, prepareArticleHtml } from "@/lib/blog/render";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { ShareButtons } from "@/components/blog/ShareButtons";
import { FaqAccordion } from "@/components/blog/FaqAccordion";
import { AuthorBioCard } from "@/components/blog/AuthorBioCard";
import { BlogCard } from "@/components/blog/BlogCard";
import "@/styles/blog-content.css";

export const revalidate = 300;

const SITE_URL = "https://www.madhubanecoretreat.com";
const FALLBACK_IMAGE =
  "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/no-image/no-image.png";
const ORG_LOGO =
  "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/logo/madhuban-tree-logo-transparent-512.png";

/**
 * The dynamic segment is still named [id] because that is the live, indexed URL
 * shape; the value it carries is the post's slug.
 */
export async function generateStaticParams() {
  try {
    const posts = await getPublishedBlogSlugs();
    return posts.map((post) => ({ id: post.slug }));
  } catch (error) {
    // Prerendering is an optimisation. Failing the whole build because the
    // database was briefly unreachable is worse than rendering on demand.
    console.error("[blogs/[id]] generateStaticParams failed:", error);
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const blog = await getBlogBySlug(id);
  if (!blog) return { title: "Story not found | Madhuban Eco Retreat" };

  return buildMetadata({
    title: blog.meta_title || blog.title,
    titleOverride: blog.meta_title || undefined,
    description: blog.meta_description || blog.excerpt || undefined,
    path: `/blogs/${blog.slug}`,
    // buildMetadata swaps WebP and AVIF for the JPEG social card, because
    // WhatsApp and Facebook cannot reliably decode those formats.
    ogImage: blog.featured_image_url || undefined,
    ogImageAlt: blog.featured_image_alt || blog.title,
    ogType: "article",
    keywords: blog.keywords?.length ? blog.keywords : undefined,
  });
}

function buildArticleSchema(blog) {
  const url = `${SITE_URL}/blogs/${blog.slug}`;
  const author = blog.blog_authors;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    description: blog.meta_description || blog.excerpt || undefined,
    image: blog.featured_image_url || undefined,
    datePublished: blog.published_at || undefined,
    dateModified: blog.updated_at || blog.published_at || undefined,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    ...(author && {
      author: {
        "@type": "Person",
        name: author.name,
        url: `${SITE_URL}/blogs/author/${author.slug}`,
      },
    }),
    publisher: {
      "@type": "Organization",
      name: "Madhuban Eco Retreat",
      logo: { "@type": "ImageObject", url: ORG_LOGO },
    },
    ...(blog.blog_categories?.name && { articleSection: blog.blog_categories.name }),
    ...(blog.tags?.length && { keywords: blog.tags.join(", ") }),
  };
}

function buildFaqSchema(faq, slug) {
  const entries = (faq ?? []).filter((f) => f?.question?.trim() && f?.answer?.trim());
  if (entries.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${SITE_URL}/blogs/${slug}#faq`,
    mainEntity: entries.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

function buildBreadcrumbSchema(blog) {
  const category = blog.blog_categories;
  const items = [
    { name: "Home", item: SITE_URL },
    { name: "Blogs", item: `${SITE_URL}/blogs` },
    ...(category
      ? [{ name: category.name, item: `${SITE_URL}/blogs/category/${category.slug}` }]
      : []),
    { name: blog.title, item: `${SITE_URL}/blogs/${blog.slug}` },
  ];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: entry.name,
      item: entry.item,
    })),
  };
}

export default async function BlogDetailPage({ params }) {
  const { id } = await params;
  const blog = await getBlogBySlug(id);
  if (!blog) notFound();

  const { html, headings } = prepareArticleHtml(blog.content);
  const related = await getRelatedBlogs(blog.id, blog.category_id, 3);

  const author = blog.blog_authors;
  const category = blog.blog_categories;
  const url = `${SITE_URL}/blogs/${blog.slug}`;

  const schemas = [
    buildArticleSchema(blog),
    buildBreadcrumbSchema(blog),
    buildFaqSchema(blog.faq, blog.slug),
  ].filter(Boolean);

  return (
    <main className="min-h-screen bg-[#FBF9F5]">
      <SEO schemas={schemas} />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <div className="relative h-[50vh] min-h-[20rem] w-full bg-[#F5F0E8]">
        <Image
          src={blog.featured_image_url || FALLBACK_IMAGE}
          alt={blog.featured_image_alt || blog.title}
          fill
          // The LCP element on this page.
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent"
        />
        {category?.name && (
          <Link
            href={`/blogs/category/${category.slug}`}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-[rgb(110,97,70)] px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-white"
          >
            {category.name}
          </Link>
        )}
      </div>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
        <nav aria-label="Breadcrumb" className="mb-6 text-xs text-[#3a3d45]/55">
          <Link href="/" className="hover:text-[rgb(110,97,70)]">
            Home
          </Link>
          <span aria-hidden="true"> / </span>
          <Link href="/blogs" className="hover:text-[rgb(110,97,70)]">
            Blogs
          </Link>
          {category && (
            <>
              <span aria-hidden="true"> / </span>
              <Link
                href={`/blogs/category/${category.slug}`}
                className="hover:text-[rgb(110,97,70)]"
              >
                {category.name}
              </Link>
            </>
          )}
        </nav>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,3fr)]">
          {/* ── Article ────────────────────────────────────────────── */}
          <article className="min-w-0">
            <h1 className="font-[family-name:var(--font-primary)] text-3xl leading-tight text-[rgb(110,97,70)] sm:text-4xl">
              {blog.title}
            </h1>

            <div className="mt-5 flex flex-wrap items-center gap-3 border-b border-[#c8b99a]/40 pb-6">
              {author?.avatar_url ? (
                <Image
                  src={author.avatar_url}
                  alt=""
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <span
                  aria-hidden="true"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F5F0E8] text-sm font-semibold text-[rgb(110,97,70)]"
                >
                  {(author?.name ?? "M").charAt(0)}
                </span>
              )}
              <div>
                {author && (
                  <Link
                    href={`/blogs/author/${author.slug}`}
                    className="text-sm font-medium text-[#3a3d45] hover:text-[rgb(110,97,70)]"
                  >
                    {author.name}
                  </Link>
                )}
                <p className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-[#3a3d45]/55">
                  {blog.published_at && (
                    <time dateTime={blog.published_at}>
                      {formatBlogDate(blog.published_at)}
                    </time>
                  )}
                  {blog.reading_time ? (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3 w-3" aria-hidden="true" />
                        {blog.reading_time} min read
                      </span>
                    </>
                  ) : null}
                  {blog.views > 0 && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="inline-flex items-center gap-1">
                        <Eye className="h-3 w-3" aria-hidden="true" />
                        {blog.views} views
                      </span>
                    </>
                  )}
                </p>
              </div>
            </div>

            {/*
              Editor-authored HTML from TipTap, written by admins behind the
              panel's auth — not reader input. Heading ids and table scroll
              wrappers are added server-side by prepareArticleHtml.
            */}
            <div
              className="blog-content mt-8"
              dangerouslySetInnerHTML={{ __html: html }}
            />

            <FaqAccordion faq={blog.faq} />
            <AuthorBioCard author={author} />
          </article>

          {/* ── Sidebar ────────────────────────────────────────────── */}
          <aside className="min-w-0">
            <div className="flex flex-col gap-8 lg:sticky lg:top-24">
              <TableOfContents headings={headings} />
              <ShareButtons title={blog.title} url={url} />

              {related.length > 0 && (
                <nav aria-labelledby="related-sidebar" className="flex flex-col gap-3">
                  <h2
                    id="related-sidebar"
                    className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(110,97,70)]"
                  >
                    Related stories
                  </h2>
                  <ul className="flex flex-col gap-3">
                    {related.map((post) => (
                      <li key={post.id}>
                        <Link href={`/blogs/${post.slug}`} className="group flex gap-3">
                          <span className="relative h-14 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-[#F5F0E8]">
                            <Image
                              src={post.featured_image_url || FALLBACK_IMAGE}
                              alt=""
                              fill
                              sizes="80px"
                              className="object-cover"
                            />
                          </span>
                          <span className="line-clamp-3 text-xs leading-snug text-[#3a3d45]/80 group-hover:text-[rgb(110,97,70)]">
                            {post.title}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              )}
            </div>
          </aside>
        </div>

        {/* ── Related, full width ──────────────────────────────────── */}
        {related.length > 0 && (
          <section aria-labelledby="related-heading" className="mt-16">
            <h2
              id="related-heading"
              className="font-[family-name:var(--font-primary)] text-2xl text-[rgb(110,97,70)]"
            >
              More stories like this
            </h2>
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((post) => (
                <BlogCard key={post.id} blog={post} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
