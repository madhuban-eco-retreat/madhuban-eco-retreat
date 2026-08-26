import "server-only";
import { getAllBlogs as getLegacyBlogs } from "@/services/blog/blogServices";

/**
 * Emergency read-through to the retired MongoDB backend.
 *
 * Supabase is the system of record — it holds all twelve posts, a superset of
 * what MongoDB ever had. This exists only so that a Supabase outage or a
 * misapplied RLS policy degrades the blog index to stale content instead of an
 * empty page, and it fires ONLY when Supabase returns zero rows without error.
 *
 * Two things to know before relying on it:
 *
 * 1. It is stale by construction. Nothing published in the admin panel since
 *    the Phase 1 migration exists in MongoDB, so a reader in this state sees an
 *    older blog than the one that is actually live.
 * 2. Legacy featured images are inline base64 data: URIs, several hundred KB
 *    each, which next/image cannot serve. They are dropped rather than
 *    rendered, so fallback cards show the placeholder image.
 *
 * Because a silent fallback hides the outage that triggered it, every use is
 * logged at error level. If this ever appears in production logs, the fix is to
 * repair Supabase, not to improve this path.
 */
export async function fetchLegacyBlogs(limit = 9) {
  try {
    const response = await getLegacyBlogs(1, limit);
    const posts = Array.isArray(response?.blogs) ? response.blogs : [];
    if (posts.length === 0) return { blogs: [], total: 0, legacy: true };

    console.error(
      `[blog] Supabase returned no posts — serving ${posts.length} stale posts ` +
        `from the retired MongoDB backend. Investigate Supabase.`,
    );

    return {
      blogs: posts.map(normaliseLegacyPost),
      total: Number(response?.totalblogs) || posts.length,
      legacy: true,
    };
  } catch (error) {
    console.error("[blog] legacy fallback also failed:", error);
    return { blogs: [], total: 0, legacy: true };
  }
}

/** Reshapes a MongoDB post into the shape BlogCard expects. */
function normaliseLegacyPost(post) {
  const image = post?.featuredImage?.url ?? "";
  // A data: URI cannot go through next/image, and these run to 250KB.
  const usableImage = image.startsWith("data:") ? null : image || null;

  return {
    id: post?._id ?? post?.uid,
    title: post?.title ?? "Untitled",
    slug: post?.uid,
    excerpt:
      post?.meta?.description ??
      String(post?.description ?? "")
        .replace(/<[^>]*>/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 200),
    featured_image_url: usableImage,
    featured_image_alt: post?.featuredImage?.altText ?? post?.title ?? "",
    published_at: post?.createdAt ?? null,
    reading_time: null,
    blog_authors: post?.authorName ? { name: post.authorName, slug: null } : null,
    blog_categories: post?.category?.name ? { name: post.category.name, slug: null } : null,
  };
}
