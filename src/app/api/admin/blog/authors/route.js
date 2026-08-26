import { NextResponse } from "next/server";
import { audit, jsonError, readJson, requireAdmin, uniqueSlug } from "@/lib/blog/api";
import { authorSchema, firstIssue } from "@/lib/blog/validation";
import { toSlug } from "@/lib/blog/derive";

/** GET /api/admin/blog/authors — all authors, active first. */
export async function GET() {
  const gate = await requireAdmin();
  if (gate.response) return gate.response;

  const { data, error } = await gate.supabase
    .from("blog_authors")
    .select("*")
    .order("is_active", { ascending: false })
    .order("name", { ascending: true });
  if (error) return jsonError(error.message, 500);
  return NextResponse.json(data ?? []);
}

/** POST /api/admin/blog/authors — create. */
export async function POST(req) {
  const gate = await requireAdmin();
  if (gate.response) return gate.response;

  const body = await readJson(req);
  if (body.response) return body.response;

  const incoming = {
    ...body.data,
    slug: body.data?.slug?.trim() || toSlug(body.data?.name ?? ""),
  };
  const parsed = authorSchema.safeParse(incoming);
  if (!parsed.success) return jsonError(firstIssue(parsed));

  const slug = await uniqueSlug(gate.supabase, "blog_authors", parsed.data.slug);

  const { data, error } = await gate.supabase
    .from("blog_authors")
    .insert({ ...parsed.data, slug })
    .select("id, name, slug")
    .single();
  if (error) return jsonError(error.message, 500);

  await audit(gate.supabase, gate.user, "blog_author_created", "blog_author", data.id, {
    name: data.name,
    slug: data.slug,
  });
  return NextResponse.json(data, { status: 201 });
}
