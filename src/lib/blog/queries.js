import "server-only";
import { createPublicClient, DataUnavailableError, PGRST_NO_ROWS } from "../supabase/public";
import { createAdminClient } from "../supabase/admin";

/**
 * Read paths for the blog.
 *
 * Public reads go through createPublicClient() rather than a module-level
 * createClient() so that blog pages can still declare `export const revalidate`
 * — the cookie-bound server client opts a route out of static rendering. Admin
 * reads use the service-role client, which sees drafts that RLS hides.
 */

const LIST_FIELDS = `
  id, title, slug, excerpt,
  featured_image_url, featured_image_alt,
  reading_time, views, published_at, tags,
  blog_authors ( name, slug, avatar_url ),
  blog_categories ( name, slug )
`;

/** Wraps a PostgREST error in the type the room pages already handle. */
function fail(context, error) {
  throw new DataUnavailableError(`${context}: ${error.message}`, { cause: error });
}

/**
 * Published posts, newest first.
 *
 * `category` is a category slug; "all" and null both mean unfiltered.
 * `search` runs against the generated tsvector column — websearch syntax, so a
 * visitor typing `tiger "rock art"` gets what they expect rather than a syntax
 * error from to_tsquery.
 */
export async function getAllBlogs({
  page = 1,
  limit = 9,
  category = null,
  search = null,
} = {}) {
  // Search is answered by a ranked RPC rather than a plain filter — see
  // searchBlogs(). Category is ignored in that mode; a search box and a
  // category tab are separate ways of narrowing the same list.
  if (search) return searchBlogs(search, { page, limit });

  const supabase = createPublicClient();
  const from = (page - 1) * limit;

  // An inner join on the category resolves the slug in the same round trip;
  // looking the id up first would double the queries on every listing render.
  const shouldFilterCategory = Boolean(category) && category !== "all";
  const selection = shouldFilterCategory
    ? LIST_FIELDS.replace("blog_categories (", "blog_categories!inner (")
    : LIST_FIELDS;

  let query = supabase
    .from("blogs")
    .select(selection, { count: "exact" })
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .range(from, from + limit - 1);

  if (shouldFilterCategory) query = query.eq("blog_categories.slug", category);

  const { data, count, error } = await query;
  if (error) fail("Could not load blogs", error);

  const total = count ?? 0;
  return {
    blogs: data ?? [],
    total,
    page,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
}

/**
 * Relevance-ranked search.
 *
 * Uses the search_blogs() RPC because ts_rank cannot be expressed as a
 * PostgREST filter, and an unranked match list is misleading on this content —
 * the articles cross-link constantly, so a plain filter for "bhimbetka" returns
 * the Bhimbetka post behind four others that merely mention it.
 *
 * Falls back to the unranked filter when the RPC is absent, so a database that
 * has not had 20260826_blog_cms_fixes.sql applied still returns results.
 */
export async function searchBlogs(term, { page = 1, limit = 9 } = {}) {
  const supabase = createPublicClient();
  const from = (page - 1) * limit;

  const { data, error } = await supabase.rpc("search_blogs", {
    search_query: term,
    result_limit: limit,
    result_offset: from,
  });

  if (error) {
    // PGRST202 — function not found in the schema cache.
    if (error.code === "PGRST202") return searchBlogsUnranked(term, { page, limit });
    fail(`Search failed for "${term}"`, error);
  }

  const rows = data ?? [];
  const total = Number(rows[0]?.total_count ?? 0);
  return {
    // Reshaped to match getAllBlogs so callers do not branch on which path ran.
    blogs: rows.map((row) => ({
      id: row.id,
      title: row.title,
      slug: row.slug,
      excerpt: row.excerpt,
      featured_image_url: row.featured_image_url,
      featured_image_alt: row.featured_image_alt,
      reading_time: row.reading_time,
      views: row.views,
      published_at: row.published_at,
      blog_authors: row.author_slug
        ? { name: row.author_name, slug: row.author_slug }
        : null,
      blog_categories: row.category_slug
        ? { name: row.category_name, slug: row.category_slug }
        : null,
    })),
    total,
    page,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
}

async function searchBlogsUnranked(term, { page, limit }) {
  const supabase = createPublicClient();
  const from = (page - 1) * limit;
  const { data, count, error } = await supabase
    .from("blogs")
    .select(LIST_FIELDS, { count: "exact" })
    .eq("status", "published")
    .textSearch("search_vector", term, { type: "websearch" })
    .order("published_at", { ascending: false })
    .range(from, from + limit - 1);

  if (error) fail(`Search failed for "${term}"`, error);

  const total = count ?? 0;
  return {
    blogs: data ?? [],
    total,
    page,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
}

/** One published post by slug, or null when no such post exists. */
export async function getBlogBySlug(slug) {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("blogs")
    .select("*, blog_authors (*), blog_categories (*)")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  // A genuine absence is a 404; anything else is an outage the caller should
  // surface as a retryable error rather than de-indexing a live URL.
  if (error) {
    if (error.code === PGRST_NO_ROWS) return null;
    fail(`Could not load blog "${slug}"`, error);
  }
  return data;
}

/**
 * Records one view.
 *
 * Deliberately separate from getBlogBySlug: that runs during render on a page
 * that should stay cacheable, and a write there would fire on every
 * regeneration rather than every reader. Call this from a route handler or a
 * client effect instead.
 */
export async function incrementBlogViews(slug) {
  const supabase = createPublicClient();
  const { error } = await supabase.rpc("increment_blog_views", { blog_slug: slug });
  // A missed view counter is not worth failing a request over.
  if (error) console.warn(`View count not recorded for "${slug}": ${error.message}`);
}

/** Other posts in the same category, newest first. */
export async function getRelatedBlogs(blogId, categoryId, limit = 3) {
  if (!categoryId) return [];
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("blogs")
    .select(
      `id, title, slug, excerpt, featured_image_url, featured_image_alt,
       published_at, reading_time, blog_authors ( name, slug )`,
    )
    .eq("status", "published")
    .eq("category_id", categoryId)
    .neq("id", blogId)
    .order("published_at", { ascending: false })
    .limit(limit);

  // Related posts are a nicety; a failure here should not take the article down.
  if (error) {
    console.warn(`Related posts unavailable for ${blogId}: ${error.message}`);
    return [];
  }
  return data ?? [];
}

/** Active categories in display order. */
export async function getAllCategories() {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("blog_categories")
    .select("*")
    .eq("is_active", true)
    .order("display_order");
  if (error) fail("Could not load blog categories", error);
  return data ?? [];
}

/** One active author by slug, or null. */
export async function getAuthorBySlug(slug) {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("blog_authors")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error) {
    if (error.code === PGRST_NO_ROWS) return null;
    fail(`Could not load author "${slug}"`, error);
  }
  return data;
}

/** Published posts by one author, newest first. */
export async function getBlogsByAuthor(authorId, { page = 1, limit = 9 } = {}) {
  const supabase = createPublicClient();
  const from = (page - 1) * limit;
  const { data, count, error } = await supabase
    .from("blogs")
    .select(
      `id, title, slug, excerpt, featured_image_url, featured_image_alt,
       published_at, reading_time, blog_categories ( name, slug )`,
      { count: "exact" },
    )
    .eq("status", "published")
    .eq("author_id", authorId)
    .order("published_at", { ascending: false })
    .range(from, from + limit - 1);

  if (error) fail("Could not load author's blogs", error);

  const total = count ?? 0;
  return {
    blogs: data ?? [],
    total,
    page,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
}

/** Every published slug, for the sitemap. */
export async function getPublishedBlogSlugs() {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("blogs")
    .select("slug, updated_at, published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false });
  if (error) fail("Could not load blog slugs", error);
  return data ?? [];
}

// ── Admin ────────────────────────────────────────────────────────────────────
// Service-role reads: drafts and archived posts included. Callers must have
// already passed assertAdmin() — this module does no authorisation of its own.

export async function adminGetAllBlogs({ page = 1, limit = 20, status = null } = {}) {
  const supabase = createAdminClient();
  const from = (page - 1) * limit;

  let query = supabase
    .from("blogs")
    .select(
      `id, title, slug, status, published_at, updated_at, reading_time, views,
       featured_image_url,
       blog_authors ( name, slug ),
       blog_categories ( name, slug )`,
      { count: "exact" },
    )
    .order("created_at", { ascending: false })
    .range(from, from + limit - 1);

  if (status) query = query.eq("status", status);

  const { data, count, error } = await query;
  if (error) fail("Could not load blogs for admin", error);

  const total = count ?? 0;
  return {
    blogs: data ?? [],
    total,
    page,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
}

/** One post by id regardless of status, for the editor. */
export async function adminGetBlogById(id) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("blogs")
    .select("*, blog_authors (*), blog_categories (*)")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === PGRST_NO_ROWS) return null;
    fail(`Could not load blog ${id}`, error);
  }
  return data;
}

/** Recomputes blog_authors.article_count after a publish or unpublish. */
export async function refreshAuthorCounts() {
  const supabase = createAdminClient();
  const { error } = await supabase.rpc("refresh_blog_author_counts");
  if (error) console.warn(`Author counts not refreshed: ${error.message}`);
}
