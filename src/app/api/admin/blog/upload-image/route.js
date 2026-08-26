import { NextResponse } from "next/server";
import sharp from "sharp";
import { audit, jsonError, requireAdmin } from "@/lib/blog/api";
import { uploadBlogImage } from "@/lib/blog/r2";

/**
 * POST /api/admin/blog/upload-image — multipart upload from the editor.
 *
 * Everything is re-encoded to WebP before it reaches the bucket. next/image
 * would convert on delivery anyway, but a writer pasting a 4 MB phone JPEG
 * would otherwise leave that 4 MB sitting in R2 for the life of the post.
 * Re-encoding also strips EXIF, which routinely carries GPS coordinates.
 */

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
// Beyond this, detail is invisible on screen and only costs bandwidth.
const MAX_DIMENSION = 2400;

// Node runtime, not edge: sharp is a native binding.
export const runtime = "nodejs";

export async function POST(req) {
  const gate = await requireAdmin();
  if (gate.response) return gate.response;

  let form;
  try {
    form = await req.formData();
  } catch {
    return jsonError("Expected a multipart form upload");
  }

  const file = form.get("file");
  if (!file || typeof file.arrayBuffer !== "function") {
    return jsonError('No file received — send it as the "file" field');
  }

  if (!ALLOWED.has(file.type)) {
    return jsonError(
      `${file.type || "That file type"} is not supported. Use JPG, PNG, WebP or GIF.`,
    );
  }

  // Checked before reading the body into memory where the size is declared.
  if (file.size > MAX_BYTES) {
    return jsonError(
      `Image is ${(file.size / 1024 / 1024).toFixed(1)} MB. The limit is 5 MB — ` +
        `resize it and try again.`,
      413,
    );
  }

  const input = Buffer.from(await file.arrayBuffer());
  if (input.length > MAX_BYTES) {
    return jsonError("Image exceeds the 5 MB limit", 413);
  }

  const altText = String(form.get("altText") ?? "").trim();
  const blogId = String(form.get("blogId") ?? "").trim() || null;
  const requestedName = String(form.get("fileName") ?? "").trim() || file.name;

  let output;
  let info;
  try {
    // Animated GIFs need every frame, or the result is a still first frame.
    const animated = file.type === "image/gif";
    const pipeline = sharp(input, { animated }).rotate(); // honour EXIF orientation
    const meta = await pipeline.metadata();

    const resized =
      (meta.width ?? 0) > MAX_DIMENSION || (meta.pageHeight ?? meta.height ?? 0) > MAX_DIMENSION
        ? pipeline.resize({
            width: MAX_DIMENSION,
            height: MAX_DIMENSION,
            fit: "inside",
            withoutEnlargement: true,
          })
        : pipeline;

    const result = await resized
      .webp({ quality: 82, effort: 4 })
      .toBuffer({ resolveWithObject: true });
    output = result.data;
    info = result.info;
  } catch (error) {
    console.error("[blog-admin] image processing failed:", error);
    return jsonError("That image could not be processed — it may be corrupt", 422);
  }

  const now = new Date();
  const folder = `blogs/images/${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, "0")}`;

  let uploaded;
  try {
    uploaded = await uploadBlogImage(output, {
      contentType: "image/webp",
      fileName: requestedName,
      folder,
      altText,
    });
  } catch (error) {
    console.error("[blog-admin] R2 upload failed:", error);
    return jsonError("Upload to storage failed. Check the R2 credentials.", 502);
  }

  // sharp reports the true post-resize dimensions; for an animated WebP the
  // header height covers all frames stacked, so pageHeight is the frame height.
  const width = info.width ?? uploaded.width;
  const height = info.pageHeight ?? info.height ?? uploaded.height;

  const { data: row, error } = await gate.supabase
    .from("blog_images")
    .insert({
      blog_id: blogId,
      r2_key: uploaded.key,
      url: uploaded.url,
      alt_text: altText || null,
      file_name: uploaded.key.split("/").pop(),
      width,
      height,
      size_bytes: output.length,
      format: "webp",
    })
    .select("id")
    .single();

  // The bytes are already in R2 and usable. Losing the bookkeeping row costs a
  // future orphan sweep, not the writer's image.
  if (error) {
    console.error("[blog-admin] blog_images insert failed:", error);
  }

  await audit(gate.supabase, gate.user, "blog_image_uploaded", "blog_image", row?.id ?? null, {
    r2_key: uploaded.key,
    blog_id: blogId,
    original_bytes: input.length,
    stored_bytes: output.length,
  });

  return NextResponse.json({
    id: row?.id ?? null,
    url: uploaded.url,
    r2Key: uploaded.key,
    width,
    height,
    altText,
    sizeBytes: output.length,
    format: "webp",
  });
}
