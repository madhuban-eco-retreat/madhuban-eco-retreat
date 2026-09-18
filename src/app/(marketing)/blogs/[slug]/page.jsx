export const revalidate = 3600;
import { buildMetadata } from "@/lib/seo";
import CommonFaqs from "@/common-components/faqs/CommonFaqs";
import DecorativeHeading from "@/common-components/heading/DecorativeHeading";
import BlogDescription from "@/components/blog/BlogDescription";
import BlogArticleHero from "@/components/blog/BlogArticleHero";
import AuthorBio from "@/components/blog/AuthorBio";
import SEO from "@/components/seo/Seo";
import Card from "@/common-components/card/Card";
import { notFound } from "next/navigation";
import {
  getBlogBySlug,
  getRelatedBlogs,
  getPublishedBlogSlugs,
  incrementBlogViews,
} from "@/lib/blog/queries";

const BASE_URL = "https://www.madhubanecoretreat.com";

function toDateOnly(iso) {
  if (!iso) return undefined;
  return iso.split("T")[0];
}

export function buildFaqSchema(faqs = []) {
  if (!faqs?.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

export function buildBlogSchema(blog) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog?.meta_title || blog?.title,
    description: blog?.meta_description || blog?.excerpt,
    image: blog?.featured_image_url,
    author: {
      "@type": "Person",
      name: blog?.blog_authors?.name,
    },
    publisher: {
      "@type": "Organization",
      name: "Madhuban Eco Retreat",
      logo: {
        "@type": "ImageObject",
        url: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/logo/madhuban-eco-retreat-bhopal-logo.png",
      },
    },
    datePublished: toDateOnly(blog?.published_at),
    dateModified: toDateOnly(blog?.updated_at),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${BASE_URL}/blogs/${blog?.slug}`,
    },
  };
}

// BreadcrumbList schema: distinct from the visible breadcrumb HeroSection
// already renders — this is the structured-data version search engines use
// to show a breadcrumb trail directly in results.
function buildBreadcrumbSchema(blog) {
  const items = [
    { name: "Home", url: BASE_URL },
    { name: "Blogs", url: `${BASE_URL}/blogs` },
  ];
  if (blog?.blog_categories?.name) {
    items.push({
      name: blog.blog_categories.name,
      url: `${BASE_URL}/blogs/category/${blog.blog_categories.slug}`,
    });
  }
  items.push({ name: blog?.title, url: `${BASE_URL}/blogs/${blog?.slug}` });

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

const BlogDesc = async ({ params }) => {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) notFound();

  const [related] = await Promise.all([
    getRelatedBlogs(blog.id, blog.category_id, 3),
    incrementBlogViews(slug),
  ]);

  const faqSchema = buildFaqSchema(blog.faq);
  const blogSchema = buildBlogSchema(blog);
  const breadcrumbSchema = buildBreadcrumbSchema(blog);

  const breadcom = [{ title: "Blogs", url: "/blogs" }];
  if (blog.blog_categories?.name) {
    breadcom.push({
      title: blog.blog_categories.name,
      url: `/blogs/category/${blog.blog_categories.slug}`,
    });
  }
  breadcom.push({ title: blog.title });

  return (
    <div>
      <SEO schemas={[blogSchema, breadcrumbSchema, ...(faqSchema ? [faqSchema] : [])]} />

      <BlogArticleHero blog={blog} breadcrumb={breadcom} />

      <BlogDescription blog={blog} />

      {Array.isArray(blog.faq) && blog.faq?.[0]?.question?.length > 0 && (
        <CommonFaqs
          faqs={blog.faq}
          bgColor="bg-warm-beige/20"
          accordionBg="#FEFCF8"
          accordionColor="var(--color-earth-brown)"
          dense
          maxWidth="max-w-3xl"
        />
      )}

      {blog.blog_authors?.name && (
        <div className="bg-warm-beige/20 py-8 md:py-10">
          <div className="custom-container">
            <AuthorBio author={blog.blog_authors} headingLevel="h2" />
          </div>
        </div>
      )}

      {related.length > 0 && (
        <div className="bg-warm-beige/20 py-8 md:py-10">
          <div className="custom-container">
            <DecorativeHeading text="Related Stories" as="h2" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 mt-8">
              {related.map((post) => (
                <Card
                  key={post.id}
                  cardkey={post.id}
                  imageUrl={post.featured_image_url}
                  altText={post.featured_image_alt || post.title}
                  hrefLink={`/blogs/${post.slug}`}
                  title={post.title}
                  createdAt={
                    post.published_at ? post.published_at.split("T")[0] : ""
                  }
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogDesc;

export async function generateStaticParams() {
  const posts = await getPublishedBlogSlugs();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    return buildMetadata({
      title: "Blog not found",
      description: "This blog post is not available.",
      path: `/blogs/${slug}`,
      noIndex: true,
    });
  }

  return buildMetadata({
    title: blog.meta_title || blog.title,
    description: blog.meta_description || blog.excerpt,
    path: blog.canonical_url
      ? new URL(blog.canonical_url).pathname
      : `/blogs/${slug}`,
    keywords: blog.keywords || blog.tags,
    ogImage: blog.og_image_url || blog.featured_image_url,
    ogImageAlt: blog.featured_image_alt,
    ogType: "article",
  });
}
