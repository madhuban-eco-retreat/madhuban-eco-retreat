import { NextResponse } from "next/server";
import { audit, jsonError, readJson, requireAdmin, uniqueSlug } from "@/lib/blog/api";
import { categoryUpdateSchema, firstIssue } from "@/lib/blog/validation";

/** PATCH /api/admin/blog/categories/[id] */
export async function PATCH(req, { params }) {
  const gate = await requireAdmin();
  if (gate.response) return gate.response;

  const { id } = await params;
  const body = await readJson(req);
  if (body.response) return body.response;

  const parsed = categoryUpdateSchema.safeParse(body.data);
  if (!parsed.success) return jsonError(firstIssue(parsed));

  const { data: existing } = await gate.supabase
    .from("blog_categories")
    .select("id, slug, name")
    .eq("id", id)
    .maybeSingle();
  if (!existing) return jsonError("Category not found", 404);

  const patch = { ...parsed.data };
  if (patch.slug && patch.slug !== existing.slug) {
    patch.slug = await uniqueSlug(gate.supabase, "blog_categories", patch.slug, id);
  }

  const { data, error } = await gate.supabase
    .from("blog_categories")
    .update(patch)
    .eq("id", id)
    .select("id, name, slug")
    .single();
  if (error) return jsonError(error.message, 500);

  await audit(gate.supabase, gate.user, "blog_category_updated", "blog_category", id, {
    name: data.name,
  });
  return NextResponse.json(data);
}

/**
 * DELETE /api/admin/blog/categories/[id]
 *
 * Refused while posts still reference it. The column is ON DELETE SET NULL, so
 * deleting anyway would quietly strip the category from live articles instead
 * of failing — losing information nobody asked to discard.
 */
export async function DELETE(_req, { params }) {
  const gate = await requireAdmin();
  if (gate.response) return gate.response;

  const { id } = await params;
  const { data: existing } = await gate.supabase
    .from("blog_categories")
    .select("id, name, slug")
    .eq("id", id)
    .maybeSingle();
  if (!existing) return jsonError("Category not found", 404);

  const { count } = await gate.supabase
    .from("blogs")
    .select("id", { count: "exact", head: true })
    .eq("category_id", id);

  if ((count ?? 0) > 0) {
    return jsonError(
      `"${existing.name}" still has ${count} post${count === 1 ? "" : "s"}. Move them to another category first.`,
      409,
    );
  }

  const { error } = await gate.supabase.from("blog_categories").delete().eq("id", id);
  if (error) return jsonError(error.message, 500);

  await audit(gate.supabase, gate.user, "blog_category_deleted", "blog_category", id, {
    name: existing.name,
    slug: existing.slug,
  });
  return NextResponse.json({ ok: true });
}
