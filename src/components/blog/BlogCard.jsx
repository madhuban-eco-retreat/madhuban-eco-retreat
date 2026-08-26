import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { formatBlogDate } from "@/lib/blog/render";

const FALLBACK_IMAGE =
  "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/no-image/no-image.png";

/**
 * Blog grid card.
 *
 * The whole card is one link, so the "Read More" affordance is a span rather
 * than a nested anchor — nesting interactive elements is invalid markup and
 * breaks keyboard navigation.
 */
export function BlogCard({ blog, priority = false }) {
  const author = blog.blog_authors;
  const category = blog.blog_categories;

  return (
    <article className="h-full">
      <Link
        href={`/blogs/${blog.slug}`}
        className="group flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-black/[0.04] transition-shadow duration-300 hover:shadow-lg"
      >
        <div className="relative h-48 w-full overflow-hidden bg-[#F5F0E8]">
          <Image
            src={blog.featured_image_url || FALLBACK_IMAGE}
            alt={blog.featured_image_alt || blog.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={priority}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {category?.name && (
            <span className="absolute left-3 top-3 rounded-full bg-[rgb(110,97,70)] px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-white">
              {category.name}
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-2 p-5">
          <h3 className="line-clamp-2 font-[family-name:var(--font-primary)] text-lg leading-snug text-[#3a3d45] transition-colors group-hover:text-[rgb(110,97,70)]">
            {blog.title}
          </h3>
          {blog.excerpt && (
            <p className="line-clamp-3 text-sm leading-relaxed text-[#3a3d45]/70">
              {blog.excerpt}
            </p>
          )}

          <div className="mt-auto flex items-center gap-3 pt-4">
            {author?.avatar_url ? (
              <Image
                src={author.avatar_url}
                alt=""
                width={32}
                height={32}
                className="h-8 w-8 flex-shrink-0 rounded-full object-cover"
              />
            ) : (
              <span
                aria-hidden="true"
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#F5F0E8] text-xs font-semibold text-[rgb(110,97,70)]"
              >
                {(author?.name ?? "M").charAt(0)}
              </span>
            )}
            <div className="min-w-0 flex-1">
              {author?.name && (
                <p className="truncate text-xs font-medium text-[#3a3d45]">{author.name}</p>
              )}
              <p className="flex items-center gap-1.5 text-[11px] text-[#3a3d45]/55">
                {formatBlogDate(blog.published_at)}
                {blog.reading_time ? (
                  <>
                    <span aria-hidden="true">·</span>
                    <Clock className="h-3 w-3" aria-hidden="true" />
                    {blog.reading_time} min
                  </>
                ) : null}
              </p>
            </div>
            <span
              aria-hidden="true"
              className="flex items-center gap-1 text-xs font-medium text-[rgb(110,97,70)] transition-transform group-hover:translate-x-0.5"
            >
              Read
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

/** Matches BlogCard's geometry so swapping one for the other causes no shift. */
export function BlogCardSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="h-full overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-black/[0.04]"
    >
      <div className="h-48 w-full animate-pulse bg-[#F5F0E8]" />
      <div className="flex flex-col gap-3 p-5">
        <div className="h-5 w-4/5 animate-pulse rounded bg-[#F5F0E8]" />
        <div className="h-3 w-full animate-pulse rounded bg-[#F5F0E8]" />
        <div className="h-3 w-11/12 animate-pulse rounded bg-[#F5F0E8]" />
        <div className="h-3 w-2/3 animate-pulse rounded bg-[#F5F0E8]" />
        <div className="mt-4 flex items-center gap-3">
          <div className="h-8 w-8 animate-pulse rounded-full bg-[#F5F0E8]" />
          <div className="flex-1 space-y-1.5">
            <div className="h-2.5 w-24 animate-pulse rounded bg-[#F5F0E8]" />
            <div className="h-2.5 w-32 animate-pulse rounded bg-[#F5F0E8]" />
          </div>
        </div>
      </div>
    </div>
  );
}
