import Image from "next/image";
import Link from "next/link";

const FALLBACK_IMAGE =
  "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/no-image/no-image-banner.png";

function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Full-bleed article hero. Category, title and a light meta line (date,
 * read time) sit directly in the image's gradient — no floating card. Full
 * author info lives in a dedicated section after the FAQs instead, so this
 * hero isn't carrying a half-empty card just for a name and avatar.
 */
export default function BlogArticleHero({ blog, breadcrumb }) {
  return (
    <header className="relative w-full" style={{ height: "56vh" }}>
      <Image
        src={blog.featured_image_url || FALLBACK_IMAGE}
        alt={blog.featured_image_alt || blog.title}
        fill
        priority
        quality={90}
        sizes="100vw"
        className="object-cover"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(0deg, rgba(23,19,12,0.85) 0%, rgba(23,19,12,0.25) 55%, rgba(23,19,12,0.35) 100%)",
        }}
      />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="absolute top-5 left-0 right-0 px-4 md:px-10">
        <div className="flex items-center flex-wrap gap-1 text-xs text-white/80 max-w-5xl mx-auto">
          <Link href="/" className="hover:text-white">
            Home
          </Link>
          {breadcrumb.map((item, idx) => (
            <span key={idx} className="flex items-center gap-1">
              <span className="opacity-60">/</span>
              {item.url ? (
                <Link href={item.url} className="hover:text-white">
                  {item.title}
                </Link>
              ) : (
                <span className="text-white truncate max-w-[220px]">
                  {item.title}
                </span>
              )}
            </span>
          ))}
        </div>
      </nav>

      <div className="absolute bottom-0 left-0 right-0 px-4 md:px-10 pb-8 md:pb-12">
        <div className="max-w-5xl mx-auto">
          {blog.blog_categories?.name && (
            <Link
              href={`/blogs/category/${blog.blog_categories.slug}`}
              className="inline-block px-3 py-1 rounded-full bg-warm-beige text-earth-brown text-xs font-medium mb-4"
            >
              {blog.blog_categories.name}
            </Link>
          )}
          <h1 className="font-primary text-3xl md:text-5xl leading-tight text-white max-w-3xl">
            {blog.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-white/75 mt-4">
            {blog.published_at && <span>{formatDate(blog.published_at)}</span>}
            {blog.reading_time ? (
              <span>{blog.reading_time} min read</span>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}
