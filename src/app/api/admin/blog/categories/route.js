import { NextResponse } from "next/server";
import { audit, jsonError, readJson, requireAdmin, uniqueSlug } from "@/lib/blog/api";
import { categorySchema, firstIssue } from "@/lib/blog/validation";
import { toSlug } from "@/lib/blog/derive";

/** GET /api/admin/blog/categories — all categories with their post counts. */
export async function GET() {
  const gate = await requireAdmin();
  if (gate.response) return gate.response;

  const { data, error } = await gate.supabase
    .from("blog_categories")
    .select("*")
    .order("display_order", { ascending: true });
  if (error) return jsonError(error.message, 500);

  // Counts drive the delete guard in the UI, so the button can be disabled
  // before the request rather than explaining a 409 afterwards.
  const { data: posts } = await gate.supabase.from("blogs").select("category_id");
  const counts = new Map();
  for (const post of posts ?? []) {
    if (!post.category_id) continue;
    counts.set(post.category_id, (counts.get(post.category_id) ?? 0) + 1);
  }

  return NextResponse.json(
    (data ?? []).map((c) => ({ ...c, blog_count: counts.get(c.id) ?? 0 })),
  );
}

/** POST /api/admin/blog/categories — create. */
export async function POST(req) {
  const gate = await requireAdmin();
  if (gate.response) return gate.response;

  const body = await readJson(req);
  if (body.response) return body.response;

  const incoming = {
    ...body.data,
    slug: body.data?.slug?.trim() || toSlug(body.data?.name ?? ""),
  };
  const parsed = categorySchema.safeParse(incoming);
  if (!parsed.success) return jsonError(firstIssue(parsed));

  const slug = await uniqueSlug(gate.supabase, "blog_categories", parsed.data.slug);

  // New categories go to the end of the list unless a position was given.
  let displayOrder = parsed.data.display_order;
  if (!displayOrder) {
    const { data: last } = await gate.supabase
      .from("blog_categories")
      .select("display_order")
      .order("display_order", { ascending: false })
      .limit(1)
      .maybeSingle();
    displayOrder = (last?.display_order ?? 0) + 1;
  }

  const { data, error } = await gate.supabase
    .from("blog_categories")
    .insert({ ...parsed.data, slug, display_order: displayOrder })
    .select("id, name, slug")
    .single();
  if (error) return jsonError(error.message, 500);

  await audit(gate.supabase, gate.user, "blog_category_created", "blog_category", data.id, {
    name: data.name,
    slug: data.slug,
  });
  return NextResponse.json(data, { status: 201 });
}
