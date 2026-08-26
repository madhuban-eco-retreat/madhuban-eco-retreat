import { NextResponse } from "next/server";
import { audit, jsonError, readJson, requireAdmin, uniqueSlug } from "@/lib/blog/api";
import { authorUpdateSchema, firstIssue } from "@/lib/blog/validation";

/**
 * PATCH /api/admin/blog/authors/[id]
 *
 * Also the deactivate path — { is_active: false }. There is no DELETE: authors
 * are referenced by published articles, and removing one would strip the byline
 * from every post they wrote.
 */
export async function PATCH(req, { params }) {
  const gate = await requireAdmin();
  if (gate.response) return gate.response;

  const { id } = await params;
  const body = await readJson(req);
  if (body.response) return body.response;

  const parsed = authorUpdateSchema.safeParse(body.data);
  if (!parsed.success) return jsonError(firstIssue(parsed));

  const { data: existing } = await gate.supabase
    .from("blog_authors")
    .select("id, slug, name, is_active")
    .eq("id", id)
    .maybeSingle();
  if (!existing) return jsonError("Author not found", 404);

  const patch = { ...parsed.data };
  if (patch.slug && patch.slug !== existing.slug) {
    patch.slug = await uniqueSlug(gate.supabase, "blog_authors", patch.slug, id);
  }

  const { data, error } = await gate.supabase
    .from("blog_authors")
    .update(patch)
    .eq("id", id)
    .select("id, name, slug, is_active")
    .single();
  if (error) return jsonError(error.message, 500);

  const deactivated = existing.is_active && data.is_active === false;
  await audit(
    gate.supabase,
    gate.user,
    deactivated ? "blog_author_deactivated" : "blog_author_updated",
    "blog_author",
    id,
    { name: data.name },
  );
  return NextResponse.json(data);
}
