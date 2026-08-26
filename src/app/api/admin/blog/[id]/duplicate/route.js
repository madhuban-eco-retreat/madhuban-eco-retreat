import { NextResponse } from "next/server";
import { audit, jsonError, requireAdmin, uniqueSlug } from "@/lib/blog/api";
import { toSlug } from "@/lib/blog/derive";

/**
 * POST /api/admin/blog/[id]/duplicate
 *
 * The copy always starts as a draft with no publish date and a zeroed view
 * count — it is a new article, and inheriting the original's traffic figures or
 * publication date would misreport both.
 */
export async function POST(_req, { params }) {
  const gate = await requireAdmin();
  if (gate.response) return gate.response;

  const { id } = await params;
  const { data: source, error: readError } = await gate.supabase
    .from("blogs")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (readError) return jsonError(readError.message, 500);
  if (!source) return jsonError("Blog not found", 404);

  const title = `${source.title} (copy)`;
  const slug = await uniqueSlug(gate.supabase, "blogs", toSlug(title));

  // Explicit field list: spreading the source would carry id, created_at and
  // the generated search_vector column, all of which the insert must not set.
  const copy = {
    title,
    slug,
    status: "draft",
    content: source.content,
    excerpt: source.excerpt,
    featured_image_url: source.featured_image_url,
    // Deliberately not copying featured_image_r2_key: both posts would point at
    // one object, and deleting either would break the other's image.
    featured_image_alt: source.featured_image_alt,
    category_id: source.category_id,
    author_id: source.author_id,
    meta_title: source.meta_title,
    meta_description: source.meta_description,
    focus_keyword: source.focus_keyword,
    keywords: source.keywords,
    tags: source.tags,
    faq: source.faq,
    schema_markup: source.schema_markup,
    og_image_url: source.og_image_url,
    canonical_url: source.canonical_url,
    reading_time: source.reading_time,
    views: 0,
    published_at: null,
  };

  const { data, error } = await gate.supabase
    .from("blogs")
    .insert(copy)
    .select("id, slug, title")
    .single();
  if (error) return jsonError(error.message, 500);

  await audit(gate.supabase, gate.user, "blog_duplicated", "blog", data.id, {
    source_id: id,
    source_title: source.title,
    new_slug: data.slug,
  });

  return NextResponse.json(data, { status: 201 });
}
