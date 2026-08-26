import { NextResponse } from "next/server";
import { audit, jsonError, readJson, requireAdmin, uniqueSlug } from "@/lib/blog/api";
import { blogCreateSchema, firstIssue } from "@/lib/blog/validation";
import { toSlug } from "@/lib/blog/derive";
import { buildRow } from "@/lib/blog/build-row";

const LIST_COLUMNS = `
  id, title, slug, status, published_at, updated_at, created_at,
  reading_time, views, featured_image_url,
  blog_authors ( id, name, slug ),
  blog_categories ( id, name, slug )
`;

const SORTS = {
  newest: { column: "created_at", ascending: false },
  oldest: { column: "created_at", ascending: true },
  most_viewed: { column: "views", ascending: false },
  title: { column: "title", ascending: true },
};

/** GET /api/admin/blog — paginated list with status, search, category and sort. */
export async function GET(req) {
  const gate = await requireAdmin();
  if (gate.response) return gate.response;

  const params = req.nextUrl.searchParams;
  const page = Math.max(1, Number(params.get("page")) || 1);
  const limit = Math.min(100, Math.max(1, Number(params.get("limit")) || 20));
  const status = params.get("status");
  const search = params.get("search")?.trim();
  const category = params.get("category");
  const sort = SORTS[params.get("sort")] ?? SORTS.newest;
  const from = (page - 1) * limit;

  let query = gate.supabase
    .from("blogs")
    .select(LIST_COLUMNS, { count: "exact" })
    .order(sort.column, { ascending: sort.ascending })
    .range(from, from + limit - 1);

  if (status && status !== "all") query = query.eq("status", status);
  if (category && category !== "all") query = query.eq("category_id", category);
  // Title-only substring match. The weighted search_vector is tuned for reader
  // relevance across the whole body; an editor hunting for a post they wrote is
  // looking for a title they half-remember.
  if (search) query = query.ilike("title", `%${search}%`);

  const { data, count, error } = await query;
  if (error) return jsonError(error.message, 500);

  const total = count ?? 0;
  return NextResponse.json({
    blogs: data ?? [],
    total,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  });
}

/** POST /api/admin/blog — create a post. */
export async function POST(req) {
  const gate = await requireAdmin();
  if (gate.response) return gate.response;

  const body = await readJson(req);
  if (body.response) return body.response;

  // A new post is usually saved before its slug field is ever touched.
  const incoming = {
    ...body.data,
    slug: body.data?.slug?.trim() || toSlug(body.data?.title ?? ""),
  };

  const parsed = blogCreateSchema.safeParse(incoming);
  if (!parsed.success) return jsonError(firstIssue(parsed));

  const input = parsed.data;
  const slug = await uniqueSlug(gate.supabase, "blogs", input.slug);
  const row = await buildRow(gate.supabase, input, { slug });

  const { data, error } = await gate.supabase
    .from("blogs")
    .insert(row)
    .select("id, slug, status")
    .single();
  if (error) return jsonError(error.message, 500);

  await audit(gate.supabase, gate.user, "blog_created", "blog", data.id, {
    title: input.title,
    slug: data.slug,
    status: data.status,
  });

  return NextResponse.json(data, { status: 201 });
}
