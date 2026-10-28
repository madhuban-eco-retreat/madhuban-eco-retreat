/**
 * Browser-side helper for the blog image upload.
 *
 * Vercel rejects any request body over about 4.5 MB before our route runs, and
 * answers with a plain-text "Request Entity Too Large" (not JSON). So large
 * photos are shrunk here first, the same way the server would (WebP, longest
 * side 2400 px), and any non-JSON reply is turned into a readable message.
 * The server still re-encodes and enforces its own limits.
 */

const SAFE_BYTES = 4 * 1024 * 1024; // under Vercel's ~4.5 MB request cap
const SKIP_BELOW = 1024 * 1024; // small files are sent as they are
const MAX_SIDE = 2400;

async function shrink(file) {
  let bitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    return null; // the browser cannot decode it; let the server try
  }
  try {
    let side = MAX_SIDE;
    for (const quality of [0.82, 0.7, 0.6, 0.5]) {
      const scale = Math.min(1, side / Math.max(bitmap.width, bitmap.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(bitmap.width * scale));
      canvas.height = Math.max(1, Math.round(bitmap.height * scale));
      canvas.getContext("2d").drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/webp", quality));
      if (blob && blob.size <= SAFE_BYTES) {
        return new File([blob], file.name.replace(/\.[^.]+$/, "") + ".webp", { type: "image/webp" });
      }
      side = Math.round(side * 0.8);
    }
    return null;
  } finally {
    bitmap.close?.();
  }
}

export async function uploadBlogImageFile(file, { blogId } = {}) {
  let toSend = file;

  if (file.type === "image/gif") {
    // Animated: re-encoding in a canvas would drop every frame but the first.
    if (file.size > SAFE_BYTES) {
      throw new Error(
        `This GIF is ${(file.size / 1024 / 1024).toFixed(1)} MB. Please use a GIF under 4 MB, or a JPG/PNG.`,
      );
    }
  } else if (file.size > SKIP_BELOW) {
    const smaller = await shrink(file);
    if (smaller) toSend = smaller;
  }

  if (toSend.size > SAFE_BYTES) {
    throw new Error(
      `Image is ${(toSend.size / 1024 / 1024).toFixed(1)} MB, which is too large. Please use an image under 4 MB.`,
    );
  }

  const form = new FormData();
  form.append("file", toSend);
  form.append("fileName", toSend.name);
  if (blogId) form.append("blogId", blogId);

  let res;
  try {
    res = await fetch("/api/admin/blog/upload-image", { method: "POST", body: form });
  } catch {
    throw new Error("Could not reach the server. Check your connection and try again.");
  }

  const text = await res.text();
  let data = null;
  try {
    data = JSON.parse(text);
  } catch {
    /* not JSON: handled below */
  }

  if (!res.ok) {
    if (data?.error) throw new Error(data.error);
    if (res.status === 413) throw new Error("The image is too large for the server. Please use a smaller image.");
    throw new Error(`Upload failed (error ${res.status}). Please try again.`);
  }
  if (!data) throw new Error("The server sent an unexpected reply. Please try again.");
  return data;
}
