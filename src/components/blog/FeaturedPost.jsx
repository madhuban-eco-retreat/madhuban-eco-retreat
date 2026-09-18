import Image from "next/image";
import Link from "next/link";

const FALLBACK_IMAGE =
  "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/no-image/no-image.png";

function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-IN", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Lead post treatment for /blogs and the category archives — full-bleed
 * cinematic image with the headline overlaid, distinct from the grid below
 * it. The "hero is the first thing" principle: don't give the newest story
 * the same small card treatment as the twentieth.
 */
export default function FeaturedPost({ blog }) {
  if (!blog) return null;

  return (
    <Link
      href={`/blogs/${blog.slug}`}
      className="group relative block w-full overflow-hidden rounded-xl"
      style={{ aspectRatio: "16 / 8" }}
    >
      <Image
        src={blog.featured_image_url || FALLBACK_IMAGE}
        alt={blog.featured_image_alt || blog.title}
        fill
        priority
        sizes="100vw"
        quality={90}
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(0deg, rgba(23,19,12,0.88) 0%, rgba(23,19,12,0.4) 45%, rgba(23,19,12,0) 70%)",
        }}
      />
      <div className="absolute inset-0 p-5 md:p-10 flex flex-col justify-end">
        <div className="max-w-2xl flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {blog.blog_categories?.name && (
              <span className="inline-block px-3 py-1 rounded bg-warm-beige/95 text-earth-brown text-xs font-medium backdrop-blur-sm">
                {blog.blog_categories.name}
              </span>
            )}
            <span className="inline-block px-2.5 py-1 rounded bg-black/40 text-white text-xs backdrop-blur-sm">
              Latest
            </span>
          </div>
          <h2 className="font-primary text-2xl md:text-4xl lg:text-[2.75rem] leading-tight text-white transition-colors duration-300 group-hover:text-warm-beige">
            {blog.title}
          </h2>
          {blog.excerpt && (
            <p className="hidden md:block text-white/80 max-w-xl text-[15px] leading-relaxed line-clamp-2">
              {blog.excerpt}
            </p>
          )}
          <div className="flex items-center gap-3 text-sm text-white/85">
            {blog.published_at && <span>{formatDate(blog.published_at)}</span>}
            {blog.published_at && blog.reading_time ? (
              <span className="inline-block w-1 h-1 rounded-full bg-white/50" />
            ) : null}
            {blog.reading_time ? <span>{blog.reading_time} min read</span> : null}
          </div>
        </div>
      </div>
    </Link>
  );
}
