import { NextResponse } from "next/server";
import { audit, jsonError, readJson, requireAdmin, uniqueSlug } from "@/lib/blog/api";
import { blogUpdateSchema, firstIssue } from "@/lib/blog/validation";
import { buildRow } from "@/lib/blog/build-row";
import { deleteBlogImage } from "@/lib/blog/r2";
import { refreshAuthorCounts } from "@/lib/blog/author-counts";

/** GET /api/admin/blog/[id] — one post, any status, for the editor. */
export async function GET(_req, { params }) {
  const gate = await requireAdmin();
  if (gate.response) return gate.response;

  const { id } = await params;
  const { data, error } = await gate.supabase
    .from("blogs")
    .select("*, blog_authors ( id, name, slug ), blog_categories ( id, name, slug )")
    .eq("id", id)
    .maybeSingle();

  if (error) return jsonError(error.message, 500);
  if (!data) return jsonError("Blog not found", 404);
  return NextResponse.json(data);
}

/** PATCH /api/admin/blog/[id] — partial update. */
export async function PATCH(req, { params }) {
  const gate = await requireAdmin();
  if (gate.response) return gate.response;

  const { id } = await params;
  const body = await readJson(req);
  if (body.response) return body.response;

  const parsed = blogUpdateSchema.safeParse(body.data);
  if (!parsed.success) return jsonError(firstIssue(parsed));

  const { data: existing, error: readError } = await gate.supabase
    .from("blogs")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (readError) return jsonError(readError.message, 500);
  if (!existing) return jsonError("Blog not found", 404);

  const input = parsed.data;
  const slug =
    input.slug && input.slug !== existing.slug
      ? await uniqueSlug(gate.supabase, "blogs", input.slug, id)
      : existing.slug;

  const row = await buildRow(gate.supabase, input, { slug, existing });

  const { data, error } = await gate.supabase
    .from("blogs")
    .update(row)
    .eq("id", id)
    .select("id, slug, status")
    .single();
  if (error) return jsonError(error.message, 500);

  await audit(gate.supabase, gate.user, "blog_updated", "blog", id, {
    title: row.title,
    // Only the interesting transitions, rather than a diff of every field.
    slug_changed: slug !== existing.slug ? { from: existing.slug, to: slug } : undefined,
    status_changed:
      row.status !== existing.status
        ? { from: existing.status, to: row.status }
        : undefined,
  });

  await refreshAuthorCounts(gate.supabase);
  return NextResponse.json(data);
}

/**
 * DELETE /api/admin/blog/[id]
 *
 * The R2 objects for this post are removed too. blog_images rows cascade with
 * the post, so without this the files would be orphaned in the bucket with
 * nothing left pointing at them.
 */
export async function DELETE(_req, { params }) {
  const gate = await requireAdmin();
  if (gate.response) return gate.response;

  const { id } = await params;
  const { data: existing } = await gate.supabase
    .from("blogs")
    .select("id, title, slug, featured_image_r2_key")
    .eq("id", id)
    .maybeSingle();
  if (!existing) return jsonError("Blog not found", 404);

  const { data: images } = await gate.supabase
    .from("blog_images")
    .select("r2_key")
    .eq("blog_id", id);

  const { error } = await gate.supabase.from("blogs").delete().eq("id", id);
  if (error) return jsonError(error.message, 500);

  // After the row is gone: a storage failure must not leave a post that the
  // panel refuses to delete. Orphaned bytes are cheaper than a stuck record.
  const keys = new Set(
    [...(images ?? []).map((i) => i.r2_key), existing.featured_image_r2_key].filter(
      Boolean,
    ),
  );
  for (const key of keys) {
    try {
      await deleteBlogImage(key);
    } catch (storageError) {
      console.error(`[blog-admin] could not delete R2 object ${key}:`, storageError);
    }
  }

  await audit(gate.supabase, gate.user, "blog_deleted", "blog", id, {
    title: existing.title,
    slug: existing.slug,
    images_removed: keys.size,
  });

  await refreshAuthorCounts(gate.supabase);
  return NextResponse.json({ ok: true, images_removed: keys.size });
}
