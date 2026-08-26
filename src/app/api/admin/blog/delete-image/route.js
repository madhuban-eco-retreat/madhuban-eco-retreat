import { NextResponse } from "next/server";
import { z } from "zod";
import { audit, jsonError, readJson, requireAdmin } from "@/lib/blog/api";
import { firstIssue } from "@/lib/blog/validation";
import { deleteBlogImage } from "@/lib/blog/r2";

/**
 * POST /api/admin/blog/delete-image — remove one image from R2 and the index.
 *
 * Body: { r2Key }. Takes a key rather than a URL so a caller cannot aim it at
 * an arbitrary bucket path; the key is checked against blog_images first, which
 * confines deletions to objects this CMS actually uploaded.
 */
const schema = z.object({
  r2Key: z.string().min(1, "r2Key is required"),
});

export async function POST(req) {
  const gate = await requireAdmin();
  if (gate.response) return gate.response;

  const body = await readJson(req);
  if (body.response) return body.response;

  const parsed = schema.safeParse(body.data);
  if (!parsed.success) return jsonError(firstIssue(parsed));
  const { r2Key } = parsed.data;

  const { data: known } = await gate.supabase
    .from("blog_images")
    .select("id, blog_id")
    .eq("r2_key", r2Key)
    .maybeSingle();

  // A featured image set before the post was first saved has no blog_images row
  // yet, so an unknown key is still deletable — but only under the CMS prefix.
  if (!known && !r2Key.startsWith("blogs/") && !r2Key.startsWith("blog/")) {
    return jsonError("That object is not managed by the blog CMS", 403);
  }

  try {
    await deleteBlogImage(r2Key);
  } catch (error) {
    console.error(`[blog-admin] R2 delete failed for ${r2Key}:`, error);
    return jsonError("Could not delete the file from storage", 502);
  }

  if (known) {
    await gate.supabase.from("blog_images").delete().eq("id", known.id);
  }

  await audit(gate.supabase, gate.user, "blog_image_deleted", "blog_image", known?.id ?? null, {
    r2_key: r2Key,
  });

  return NextResponse.json({ ok: true });
}
