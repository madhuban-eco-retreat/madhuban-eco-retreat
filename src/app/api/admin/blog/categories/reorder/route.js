import { NextResponse } from "next/server";
import { audit, jsonError, readJson, requireAdmin } from "@/lib/blog/api";
import { categoryReorderSchema, firstIssue } from "@/lib/blog/validation";

/**
 * POST /api/admin/blog/categories/reorder
 *
 * Body: { order: [id, id, …] } — the full list in its new order. Sending the
 * whole list rather than a moved-item delta keeps the result the same whether
 * or not two editors drag at once: last write wins, with no gaps.
 */
export async function POST(req) {
  const gate = await requireAdmin();
  if (gate.response) return gate.response;

  const body = await readJson(req);
  if (body.response) return body.response;

  const parsed = categoryReorderSchema.safeParse(body.data);
  if (!parsed.success) return jsonError(firstIssue(parsed));

  const { order } = parsed.data;
  for (const [index, id] of order.entries()) {
    const { error } = await gate.supabase
      .from("blog_categories")
      .update({ display_order: index + 1 })
      .eq("id", id);
    if (error) return jsonError(error.message, 500);
  }

  await audit(gate.supabase, gate.user, "blog_categories_reordered", "blog_category", null, {
    count: order.length,
  });
  return NextResponse.json({ ok: true, count: order.length });
}
