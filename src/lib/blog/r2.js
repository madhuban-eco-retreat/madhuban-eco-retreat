import "server-only";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { imageMetaFromBuffer } from "./image-meta.mjs";

/**
 * Cloudflare R2 storage for blog images.
 *
 * The blog CMS stores images in the same R2 bucket the rest of the site serves
 * from, rather than Cloudinary: the credentials already exist, next.config.mjs
 * already whitelists the r2.dev hosts for next/image, and a second asset host
 * would mean a second set of secrets to rotate. next/image handles the WebP and
 * AVIF conversion that Cloudinary's transform URLs would otherwise provide —
 * `formats: ["image/avif", "image/webp"]` is already set.
 */

/** Public base for objects in the bucket, e.g. https://pub-xxxx.r2.dev */
export const R2_PUBLIC_BASE =
  process.env.NEXT_PUBLIC_R2_BASE ??
  "https://pub-988c0a6b938742458b908a7a49295f61.r2.dev";

const BUCKET = process.env.R2_BUCKET_NAME;

/**
 * R2_ACCOUNT_ID is stored in this project as the full S3 endpoint URL
 * (https://<account>.r2.cloudflarestorage.com/) rather than the bare 32-char
 * account id. Both forms are accepted so the var can be normalised later
 * without breaking uploads in the meantime.
 */
function resolveEndpoint() {
  const raw = process.env.R2_ACCOUNT_ID;
  if (!raw) return null;
  const value = raw.trim().replace(/\/+$/, "");
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  return `https://${value}.r2.cloudflarestorage.com`;
}

let cachedClient = null;

function getClient() {
  if (cachedClient) return cachedClient;

  const endpoint = resolveEndpoint();
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

  const missing = [
    endpoint ? null : "R2_ACCOUNT_ID",
    accessKeyId ? null : "R2_ACCESS_KEY_ID",
    secretAccessKey ? null : "R2_SECRET_ACCESS_KEY",
    BUCKET ? null : "R2_BUCKET_NAME",
  ].filter(Boolean);

  if (missing.length > 0) {
    throw new Error(
      `R2 upload unavailable — ${missing.join(", ")} not set. Blog image ` +
        `uploads need these at runtime; they are not NEXT_PUBLIC_ and so are ` +
        `read per request rather than baked into the bundle.`,
    );
  }

  // R2 ignores the region but the SDK insists on one being present.
  cachedClient = new S3Client({
    region: "auto",
    endpoint,
    credentials: { accessKeyId, secretAccessKey },
  });
  return cachedClient;
}

const EXTENSION_BY_TYPE = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
  "image/svg+xml": "svg",
};

/** Filesystem- and URL-safe stem for an object key. */
export function slugifyFileName(name) {
  return (
    String(name || "")
      .replace(/\.[a-z0-9]+$/i, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "image"
  );
}

/**
 * Uploads one image to R2 and returns its public URL plus the metadata
 * blog_images records.
 *
 * A random suffix is appended to every key. Two posts can legitimately upload
 * "hero.jpg", and without it the second would overwrite the first — silently
 * changing the image on an already-published article.
 */
export async function uploadBlogImage(
  body,
  { contentType, fileName, folder = "blog", altText = "" } = {},
) {
  const buffer = Buffer.isBuffer(body) ? body : Buffer.from(body);
  const meta = imageMetaFromBuffer(buffer);
  const type = contentType || meta.mimeType || "application/octet-stream";
  const ext = EXTENSION_BY_TYPE[type] ?? "bin";
  const suffix = Math.random().toString(36).slice(2, 8);
  const key = `${folder}/${slugifyFileName(fileName)}-${suffix}.${ext}`;

  await getClient().send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: buffer,
      ContentType: type,
      // Blog images are immutable once written — the random suffix guarantees a
      // new key rather than a new version of an old one.
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );

  return {
    key,
    url: `${R2_PUBLIC_BASE.replace(/\/+$/, "")}/${key}`,
    sizeBytes: buffer.length,
    format: ext,
    contentType: type,
    width: meta.width ?? null,
    height: meta.height ?? null,
    altText,
  };
}

/** Removes an object. Safe to call for a key that is already gone. */
export async function deleteBlogImage(key) {
  if (!key) return;
  await getClient().send(
    new DeleteObjectCommand({ Bucket: BUCKET, Key: key }),
  );
}
