import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { formatBlogDate } from "@/lib/blog/render";

const FALLBACK_IMAGE =
  "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/no-image/no-image.png";

/** The most recent post, given a wide two-column treatment above the grid. */
export function FeaturedBlog({ blog }) {
  if (!blog) return null;
  const author = blog.blog_authors;
  const category = blog.blog_categories;

  return (
    <section className="px-4 pb-4 pt-12" aria-labelledby="featured-heading">
      <div className="mx-auto max-w-6xl">
        <p className="mb-4 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-[rgb(110,97,70)]">
          Latest story
        </p>
        <Link
          href={`/blogs/${blog.slug}`}
          className="group grid grid-cols-1 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/[0.04] transition-shadow hover:shadow-lg md:grid-cols-2"
        >
          <div className="relative h-64 w-full overflow-hidden bg-[#F5F0E8] md:h-full md:min-h-[22rem]">
            <Image
              src={blog.featured_image_url || FALLBACK_IMAGE}
              alt={blog.featured_image_alt || blog.title}
              fill
              // The largest image above the fold on this page, so it is the
              // LCP element and worth preloading.
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {category?.name && (
              <span className="absolute left-4 top-4 rounded-full bg-[rgb(110,97,70)] px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-white">
                {category.name}
              </span>
            )}
          </div>

          <div className="flex flex-col justify-center gap-4 p-6 sm:p-9">
            <h2
              id="featured-heading"
              className="font-[family-name:var(--font-primary)] text-2xl leading-snug text-[#3a3d45] transition-colors group-hover:text-[rgb(110,97,70)] sm:text-3xl"
            >
              {blog.title}
            </h2>
            {blog.excerpt && (
              <p className="line-clamp-4 text-sm leading-relaxed text-[#3a3d45]/70 sm:text-base">
                {blog.excerpt}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              {author?.avatar_url ? (
                <Image
                  src={author.avatar_url}
                  alt=""
                  width={36}
                  height={36}
                  className="h-9 w-9 rounded-full object-cover"
                />
              ) : (
                <span
                  aria-hidden="true"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F5F0E8] text-sm font-semibold text-[rgb(110,97,70)]"
                >
                  {(author?.name ?? "M").charAt(0)}
                </span>
              )}
              <div>
                {author?.name && (
                  <p className="text-sm font-medium text-[#3a3d45]">{author.name}</p>
                )}
                <p className="flex items-center gap-1.5 text-xs text-[#3a3d45]/55">
                  {formatBlogDate(blog.published_at)}
                  {blog.reading_time ? (
                    <>
                      <span aria-hidden="true">·</span>
                      <Clock className="h-3 w-3" aria-hidden="true" />
                      {blog.reading_time} min read
                    </>
                  ) : null}
                </p>
              </div>
            </div>
            <span
              aria-hidden="true"
              className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-[rgb(110,97,70)] transition-transform group-hover:translate-x-1"
            >
              Read the story
              <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </Link>
      </div>
    </section>
  );
}
