import { NextResponse } from "next/server";
import { audit, jsonError, requireAdmin } from "@/lib/blog/api";
import { refreshAuthorCounts } from "@/lib/blog/author-counts";
import { BLOG_STATUSES } from "@/lib/blog/validation";

/**
 * POST /api/admin/blog/[id]/publish
 *
 * Body: { status } — defaults to "published". Kept separate from PATCH so the
 * list page can flip status without sending a whole post back, and so the
 * status change lands in the audit log as its own action.
 */
export async function POST(req, { params }) {
  const gate = await requireAdmin();
  if (gate.response) return gate.response;

  const { id } = await params;
  let status = "published";
  try {
    const body = await req.json();
    if (body?.status) status = body.status;
  } catch {
    // No body means "publish", which is the default.
  }

  if (!BLOG_STATUSES.includes(status)) {
    return jsonError(`Status must be one of ${BLOG_STATUSES.join(", ")}`);
  }

  const { data: existing } = await gate.supabase
    .from("blogs")
    .select("id, title, status, published_at")
    .eq("id", id)
    .maybeSingle();
  if (!existing) return jsonError("Blog not found", 404);

  const patch = { status };
  // Stamped only on the first publish: re-publishing an archived post keeps its
  // original date rather than jumping it to the top of the blog index.
  if (status === "published" && !existing.published_at) {
    patch.published_at = new Date().toISOString();
  }

  const { data, error } = await gate.supabase
    .from("blogs")
    .update(patch)
    .eq("id", id)
    .select("id, slug, status, published_at")
    .single();
  if (error) return jsonError(error.message, 500);

  await audit(gate.supabase, gate.user, `blog_${status}`, "blog", id, {
    title: existing.title,
    from: existing.status,
    to: status,
  });

  await refreshAuthorCounts(gate.supabase);
  return NextResponse.json(data);
}
