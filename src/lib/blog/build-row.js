import "server-only";
import {
  buildSchemaMarkup,
  deriveExcerpt,
  deriveMetaDescription,
  deriveMetaTitle,
  readingTimeFromHtml,
} from "./derive";

/**
 * Fills in everything the editor did not supply.
 *
 * The derived fields are recomputed here rather than trusted from the client so
 * that a post saved through the API directly still gets a correct reading time
 * and schema block.
 */
export async function buildRow(supabase, input, { slug, existing = null } = {}) {
  const content = input.content ?? existing?.content ?? "";
  const title = input.title ?? existing?.title ?? "";
  const excerpt = input.excerpt ?? deriveExcerpt(content);
  const status = input.status ?? existing?.status ?? "draft";

  const authorId = input.author_id !== undefined ? input.author_id : existing?.author_id;
  const categoryId =
    input.category_id !== undefined ? input.category_id : existing?.category_id;

  // One round trip for both lookups; only the names are needed, for JSON-LD.
  const [author, category] = await Promise.all([
    authorId
      ? supabase.from("blog_authors").select("name, slug").eq("id", authorId).maybeSingle()
      : Promise.resolve({ data: null }),
    categoryId
      ? supabase
          .from("blog_categories")
          .select("name, slug")
          .eq("id", categoryId)
          .maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  const metaTitle = input.meta_title ?? deriveMetaTitle(title);
  const metaDescription = input.meta_description ?? deriveMetaDescription(excerpt, content);
  const featuredImageUrl =
    input.featured_image_url !== undefined
      ? input.featured_image_url
      : existing?.featured_image_url;

  // published_at is the article's date of record: set when it first goes live,
  // and never moved by a later edit — a corrected typo should not reorder the
  // blog index or change the date crawlers already indexed.
  let publishedAt = existing?.published_at ?? null;
  if (input.published_at) publishedAt = input.published_at;
  else if (status === "published" && !publishedAt) publishedAt = new Date().toISOString();

  const row = {
    title,
    slug,
    status,
    content,
    excerpt,
    featured_image_url: featuredImageUrl ?? null,
    featured_image_r2_key:
      input.featured_image_r2_key !== undefined
        ? input.featured_image_r2_key
        : (existing?.featured_image_r2_key ?? null),
    featured_image_alt:
      input.featured_image_alt ?? existing?.featured_image_alt ?? title ?? null,
    category_id: categoryId ?? null,
    author_id: authorId ?? null,
    meta_title: metaTitle,
    meta_description: metaDescription,
    focus_keyword: input.focus_keyword ?? existing?.focus_keyword ?? null,
    keywords: input.keywords ?? existing?.keywords ?? null,
    tags: input.tags ?? existing?.tags ?? [],
    faq: input.faq ?? existing?.faq ?? [],
    canonical_url: input.canonical_url ?? existing?.canonical_url ?? null,
    og_image_url: input.og_image_url ?? existing?.og_image_url ?? featuredImageUrl ?? null,
    reading_time: readingTimeFromHtml(content),
    published_at: publishedAt,
  };

  row.schema_markup = buildSchemaMarkup({
    title,
    slug,
    excerpt,
    metaDescription,
    featuredImageUrl: row.featured_image_url,
    authorName: author.data?.name,
    authorSlug: author.data?.slug,
    categoryName: category.data?.name,
    categorySlug: category.data?.slug,
    publishedAt,
    updatedAt: new Date().toISOString(),
    faq: row.faq,
  });

  return row;
}
