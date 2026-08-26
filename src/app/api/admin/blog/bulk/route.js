import { NextResponse } from "next/server";
import { z } from "zod";
import { audit, jsonError, readJson, requireAdmin } from "@/lib/blog/api";
import { firstIssue } from "@/lib/blog/validation";
import { refreshAuthorCounts } from "@/lib/blog/author-counts";
import { deleteBlogImage } from "@/lib/blog/r2";

/**
 * POST /api/admin/blog/bulk — apply one action to a set of posts.
 *
 * Backs the list page's bulk bar. A single round trip rather than one request
 * per row: selecting forty posts and firing forty deletes would half-apply if
 * the tab were closed midway.
 */
const bulkSchema = z.object({
  action: z.enum(["publish", "draft", "archive", "delete"]),
  ids: z.array(z.string().uuid()).min(1, "Select at least one post").max(200),
});

export async function POST(req) {
  const gate = await requireAdmin();
  if (gate.response) return gate.response;

  const body = await readJson(req);
  if (body.response) return body.response;

  const parsed = bulkSchema.safeParse(body.data);
  if (!parsed.success) return jsonError(firstIssue(parsed));
  const { action, ids } = parsed.data;

  if (action === "delete") {
    const { data: images } = await gate.supabase
      .from("blog_images")
      .select("r2_key")
      .in("blog_id", ids);
    const { data: posts } = await gate.supabase
      .from("blogs")
      .select("featured_image_r2_key")
      .in("id", ids);

    const { error } = await gate.supabase.from("blogs").delete().in("id", ids);
    if (error) return jsonError(error.message, 500);

    // Storage cleanup after the rows are gone, and never fatal — see the
    // single-post DELETE for why.
    const keys = new Set(
      [
        ...(images ?? []).map((i) => i.r2_key),
        ...(posts ?? []).map((p) => p.featured_image_r2_key),
      ].filter(Boolean),
    );
    for (const key of keys) {
      try {
        await deleteBlogImage(key);
      } catch (storageError) {
        console.error(`[blog-admin] could not delete R2 object ${key}:`, storageError);
      }
    }

    await audit(gate.supabase, gate.user, "blog_bulk_deleted", "blog", null, {
      count: ids.length,
      ids,
      images_removed: keys.size,
    });
    await refreshAuthorCounts(gate.supabase);
    return NextResponse.json({ ok: true, affected: ids.length });
  }

  const status = action === "publish" ? "published" : action === "draft" ? "draft" : "archived";

  // Posts going live for the first time need a publish date; ones that already
  // have one keep it, so this cannot be a single blanket update.
  if (status === "published") {
    const { data: needStamp } = await gate.supabase
      .from("blogs")
      .select("id")
      .in("id", ids)
      .is("published_at", null);

    const stampIds = (needStamp ?? []).map((r) => r.id);
    if (stampIds.length > 0) {
      const { error } = await gate.supabase
        .from("blogs")
        .update({ status, published_at: new Date().toISOString() })
        .in("id", stampIds);
      if (error) return jsonError(error.message, 500);
    }

    const remaining = ids.filter((id) => !stampIds.includes(id));
    if (remaining.length > 0) {
      const { error } = await gate.supabase
        .from("blogs")
        .update({ status })
        .in("id", remaining);
      if (error) return jsonError(error.message, 500);
    }
  } else {
    const { error } = await gate.supabase
      .from("blogs")
      .update({ status })
      .in("id", ids);
    if (error) return jsonError(error.message, 500);
  }

  await audit(gate.supabase, gate.user, `blog_bulk_${status}`, "blog", null, {
    count: ids.length,
    ids,
  });
  await refreshAuthorCounts(gate.supabase);
  return NextResponse.json({ ok: true, affected: ids.length, status });
}
