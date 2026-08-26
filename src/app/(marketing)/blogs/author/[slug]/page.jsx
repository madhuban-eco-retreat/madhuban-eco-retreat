import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Instagram, Linkedin, Twitter } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import SEO from "@/components/seo/Seo";
import { getAuthorBySlug, getBlogsByAuthor } from "@/lib/blog/queries";
import { BlogCard } from "@/components/blog/BlogCard";

export const revalidate = 300;

const SITE_URL = "https://www.madhubanecoretreat.com";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const author = await getAuthorBySlug(slug);
  if (!author) return { title: "Author not found | Madhuban Eco Retreat" };

  return buildMetadata({
    title: `${author.name} — Stories & Guides`,
    description:
      author.bio?.slice(0, 160) ||
      `Read ${author.name}'s nature, wildlife and travel writing for Madhuban Eco Retreat.`,
    path: `/blogs/author/${author.slug}`,
    ogImage: author.avatar_url || undefined,
    ogImageAlt: author.avatar_alt || author.name,
    ogType: "profile",
  });
}

export default async function AuthorPage({ params }) {
  const { slug } = await params;
  const author = await getAuthorBySlug(slug);
  if (!author) notFound();

  const { blogs, total } = await getBlogsByAuthor(author.id, { limit: 24 });

  const socials = [
    { href: author.twitter_url, icon: Twitter, label: `${author.name} on X` },
    { href: author.linkedin_url, icon: Linkedin, label: `${author.name} on LinkedIn` },
    { href: author.instagram_url, icon: Instagram, label: `${author.name} on Instagram` },
  ].filter((s) => s.href);

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: author.name,
    url: `${SITE_URL}/blogs/author/${author.slug}`,
    ...(author.designation && { jobTitle: author.designation }),
    ...(author.bio && { description: author.bio }),
    ...(author.avatar_url && { image: author.avatar_url }),
    ...(socials.length > 0 && { sameAs: socials.map((s) => s.href) }),
    worksFor: { "@type": "Organization", name: "Madhuban Eco Retreat", url: SITE_URL },
  };

  return (
    <main className="min-h-screen bg-[#FBF9F5]">
      <SEO schemas={[personSchema]} />

      <section className="bg-[#F5F0E8] px-4 pb-14 pt-28 sm:pt-32">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
          {author.avatar_url ? (
            <Image
              src={author.avatar_url}
              alt={author.avatar_alt || author.name}
              width={112}
              height={112}
              priority
              className="h-28 w-28 rounded-full object-cover"
            />
          ) : (
            <span
              aria-hidden="true"
              className="flex h-28 w-28 items-center justify-center rounded-full bg-white text-3xl font-semibold text-[rgb(110,97,70)]"
            >
              {author.name.charAt(0)}
            </span>
          )}

          <h1 className="font-[family-name:var(--font-primary)] text-3xl text-[rgb(110,97,70)] sm:text-4xl">
            {author.name}
          </h1>
          {author.designation && (
            <p className="text-sm font-medium text-[#3a3d45]/70">{author.designation}</p>
          )}
          {author.bio && (
            <p className="max-w-2xl text-base leading-relaxed text-[#3a3d45]/75">
              {author.bio}
            </p>
          )}

          <div className="mt-1 flex items-center gap-3">
            {socials.map(({ href, icon: Icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-[rgb(110,97,70)] transition-colors hover:bg-[rgb(110,97,70)] hover:text-white"
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
              </a>
            ))}
          </div>

          <p className="text-xs uppercase tracking-[0.18em] text-[#3a3d45]/50">
            {total} article{total === 1 ? "" : "s"} published
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
            <span>{author.name}</span>
          </nav>

          {blogs.length === 0 ? (
            <p className="py-12 text-center text-sm text-[#3a3d45]/60">
              {author.name} has not published a story yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {blogs.map((blog) => (
                <BlogCard
                  key={blog.id}
                  // The author query omits the join, but every post here is by
                  // this author — the card would otherwise show no byline.
                  blog={{ ...blog, blog_authors: author }}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
