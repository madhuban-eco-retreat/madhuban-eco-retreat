import "server-only";

/**
 * Recomputes blog_authors.article_count, one author at a time.
 *
 * Each UPDATE is scoped by .eq(), which is what pg-safeupdate requires: the
 * refresh_blog_author_counts() RPC does a set-wide update and stays unusable on
 * any database that has not had 20260826_blog_cms_fixes.sql applied. Counts are
 * a display detail, so a failure here is logged rather than surfaced.
 */
export async function refreshAuthorCounts(supabase) {
  try {
    const { data: authors } = await supabase.from("blog_authors").select("id");
    for (const author of authors ?? []) {
      const { count } = await supabase
        .from("blogs")
        .select("id", { count: "exact", head: true })
        .eq("author_id", author.id)
        .eq("status", "published");
      await supabase
        .from("blog_authors")
        .update({ article_count: count ?? 0 })
        .eq("id", author.id);
    }
  } catch (error) {
    console.error("[blog-admin] author count refresh failed:", error);
  }
}
