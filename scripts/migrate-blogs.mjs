/**
 * One-time import of the published blog posts from the legacy MongoDB backend
 * into Supabase.
 *
 *   node scripts/migrate-blogs.mjs [--dry-run] [--force] [--only <slug>]
 *
 *   --dry-run  Report what would be written; touches neither R2 nor Supabase.
 *   --force    Re-upload images for posts that were already imported.
 *   --only     Import a single post by its legacy uid.
 *
 * Run supabase/migrations/20260826_blog_cms.sql first — this script writes rows
 * but creates no tables.
 *
 * WHY THIS IS NOT A STRAIGHT FIELD COPY
 *
 * 1. The list endpoint omits `description` (the article body) entirely, so each
 *    post has to be re-fetched individually. Reading the body off the list
 *    response yields eleven empty articles.
 * 2. Most images are inline base64 data: URIs rather than URLs — seven featured
 *    images plus twenty-five embedded in the HTML, about 6.6 MB in total, with
 *    one post's body alone at 2.6 MB. They are decoded, uploaded to R2, and the
 *    HTML is rewritten to point at the uploaded copies.
 * 3. Two posts use images hosted on third-party Cloudinary accounts that this
 *    project does not control; those are re-hosted onto R2 as well, falling
 *    back to the original URL if the fetch fails.
 * 4. Real SEO metadata already exists under `meta` and is preserved. Generated
 *    titles and descriptions are only used where a field is genuinely blank.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import readingTime from "reading-time";
import { imageMetaFromBuffer, decodeDataUri } from "../src/lib/blog/image-meta.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const MONGO_BASE = "https://madhuban-backend-s1l7.onrender.com";
const SITE_NAME = "Madhuban Eco Retreat";

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const FORCE = args.includes("--force");
const ONLY = args.includes("--only") ? args[args.indexOf("--only") + 1] : null;

// ── Environment ──────────────────────────────────────────────────────────────
// Next.js loads .env.local automatically; a bare node script does not.
function loadEnvLocal() {
  const file = path.join(ROOT, ".env.local");
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const match = /^([A-Za-z0-9_]+)=(.*)$/.exec(line);
    if (!match) continue;
    const value = match[2].trim().replace(/^["']|["']$/g, "");
    if (!process.env[match[1]]) process.env[match[1]] = value;
  }
}
loadEnvLocal();

function requireEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var ${name} (.env.local)`);
  return value;
}

const supabase = createClient(
  requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
  requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
  { auth: { persistSession: false } },
);

const R2_PUBLIC_BASE = requireEnv("NEXT_PUBLIC_R2_BASE").replace(/\/+$/, "");
const R2_BUCKET = requireEnv("R2_BUCKET_NAME");
const r2 = new S3Client({
  region: "auto",
  // Stored in this project as a full endpoint URL rather than a bare account id.
  endpoint: requireEnv("R2_ACCOUNT_ID").trim().replace(/\/+$/, ""),
  credentials: {
    accessKeyId: requireEnv("R2_ACCESS_KEY_ID"),
    secretAccessKey: requireEnv("R2_SECRET_ACCESS_KEY"),
  },
});

// ── Mapping tables ───────────────────────────────────────────────────────────
const AUTHOR_BY_NAME = {
  "Mousam Kourav": "mousam-kourav",
  "Mitali Pawar": "mitali-pawar",
  "Anuj Sharma": "anuj-sharma",
  "Madhuban Eco Retreat": "madhuban-eco-retreat",
};

/**
 * Every source post sits in a single MongoDB category ("nature experiences"),
 * which carries no information, so the target category is inferred from the
 * title and slug. Order matters: the Ginnorgarh fort piece mentions Ratapani,
 * and the press feature mentions wildlife, so the more specific rules run first.
 */
const CATEGORY_RULES = [
  [/fort|citadel|gond|cave|temple|shakti|rock.?art|bhimbet|ashokan|heritage|ancient/i, "heritage"],
  [/trek|hik(e|ing)|day.?outing|adventure|camping|itinerary|things.?to.?do/i, "experiences"],
  [/hindustan.?times|featured|press|news|award/i, "others"],
  // Species-led pieces are nature writing even when they are set in Ratapani,
  // so they are claimed before the reserve rule — which would otherwise sweep
  // up every post whose title mentions the park and leave the site's flagship
  // Wildlife & Nature category empty.
  [/bird(watch|ing)?|butterfl|leopard|flora|fauna|species|monsoon/i, "wildlife-and-nature"],
  [/ratapani|tiger.?reserve|safari/i, "ratapani-tiger-reserve"],
  [/wildlife|nature|forest|jungle/i, "wildlife-and-nature"],
];

function inferCategorySlug(blog) {
  const haystack = `${blog.title || ""} ${blog.uid || ""}`;
  for (const [pattern, slug] of CATEGORY_RULES) {
    if (pattern.test(haystack)) return slug;
  }
  return "others";
}

// ── Helpers ──────────────────────────────────────────────────────────────────
const stripTags = (html) =>
  String(html || "")
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#39;|&rsquo;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();

function truncate(text, limit) {
  const clean = String(text || "").trim();
  if (clean.length <= limit) return clean;
  // Cut on a word boundary so the ellipsis does not land mid-word.
  return `${clean.slice(0, limit - 1).replace(/\s+\S*$/, "")}…`;
}

function slugifyStem(name) {
  return (
    String(name || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "image"
  );
}

const EXT_BY_MIME = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
  "image/svg+xml": "svg",
};

const uploads = [];

/** Uploads a decoded image buffer to R2 and returns its public URL + metadata. */
async function putImage(buffer, mimeType, stem) {
  const meta = imageMetaFromBuffer(buffer);
  const type = mimeType || meta.mimeType || "application/octet-stream";
  const ext = EXT_BY_MIME[type] ?? "bin";
  // The random suffix keeps two posts that both ship a "hero.jpg" from
  // overwriting one another.
  const key = `blog/${slugifyStem(stem)}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  if (!DRY_RUN) {
    await r2.send(
      new PutObjectCommand({
        Bucket: R2_BUCKET,
        Key: key,
        Body: buffer,
        ContentType: type,
        CacheControl: "public, max-age=31536000, immutable",
      }),
    );
  }

  const record = {
    key,
    url: `${R2_PUBLIC_BASE}/${key}`,
    sizeBytes: buffer.length,
    format: ext,
    width: meta.width ?? null,
    height: meta.height ?? null,
  };
  uploads.push(record);
  return record;
}

/** Re-hosts an image that currently lives on someone else's CDN. */
async function rehostRemote(url, stem) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buffer = Buffer.from(await res.arrayBuffer());
    const type = res.headers.get("content-type")?.split(";")[0] || null;
    return await putImage(buffer, type, stem);
  } catch (error) {
    // Better to keep serving the third-party copy than to lose the image.
    console.warn(`      ! could not re-host ${url.slice(0, 60)} — ${error.message}`);
    return null;
  }
}

/**
 * Replaces every inline data: image in the body with an uploaded R2 copy.
 * Returns the rewritten HTML and one record per extracted image.
 */
async function extractInlineImages(html, stem) {
  const images = [];
  if (!html) return { html: "", images };

  const pattern = /src\s*=\s*(["'])(data:image\/[^"']+)\1/gi;
  const matches = [...html.matchAll(pattern)];
  let output = html;
  let index = 0;

  for (const match of matches) {
    const decoded = decodeDataUri(match[2]);
    if (!decoded) continue;
    index += 1;
    const uploaded = await putImage(
      decoded.buffer,
      decoded.mimeType,
      `${stem}-${index}`,
    );
    // Replace the exact original attribute text; base64 payloads are unique
    // enough that a plain split/join is safe and avoids regex escaping issues.
    output = output.split(match[0]).join(`src="${uploaded.url}"`);
    images.push(uploaded);
  }

  return { html: output, images };
}

/**
 * Recomputes blog_authors.article_count one author at a time.
 *
 * Each write is scoped with .eq("id", ...), so it carries the WHERE clause
 * pg-safeupdate insists on.
 */
async function refreshAuthorCounts(authors) {
  for (const author of authors ?? []) {
    const { count, error } = await supabase
      .from("blogs")
      .select("id", { count: "exact", head: true })
      .eq("author_id", author.id)
      .eq("status", "published");

    if (error) {
      console.warn(`  ! count failed for ${author.slug}: ${error.message}`);
      continue;
    }

    const { error: updateError } = await supabase
      .from("blog_authors")
      .update({ article_count: count ?? 0 })
      .eq("id", author.id);

    if (updateError) {
      console.warn(`  ! count not saved for ${author.slug}: ${updateError.message}`);
    }
  }
}

// ── Import ───────────────────────────────────────────────────────────────────
async function main() {
  console.log(
    `Blog import → Supabase${DRY_RUN ? "  (DRY RUN — nothing will be written)" : ""}`,
  );

  const listRes = await fetch(
    `${MONGO_BASE}/api/blogs/all/madhuban?page=1&limit=100&type=blog&status=Published`,
  );
  if (!listRes.ok) throw new Error(`Blog list fetch failed: HTTP ${listRes.status}`);
  const list = await listRes.json();
  let summaries = list.blogs ?? [];
  if (ONLY) summaries = summaries.filter((b) => b.uid === ONLY);
  console.log(`Source posts: ${summaries.length}\n`);

  const [{ data: authors }, { data: categories }] = await Promise.all([
    supabase.from("blog_authors").select("id, slug, name"),
    supabase.from("blog_categories").select("id, slug"),
  ]);

  if (!authors?.length || !categories?.length) {
    // A dry run is still worth doing before the migration has been applied: it
    // exercises the fetch, decode and inference paths, which is where the
    // surprises live. Only a real import needs the rows to exist.
    if (!DRY_RUN) {
      throw new Error(
        "blog_authors / blog_categories are empty — run " +
          "supabase/migrations/20260826_blog_cms.sql before this script.",
      );
    }
    console.warn(
      "  ! blog_authors / blog_categories not found — continuing without id " +
        "lookups because this is a dry run.\n",
    );
  }

  // PostgREST answers a missing table with null rather than [], so these must
  // tolerate null to keep a pre-migration dry run working.
  const authorId = (slug) => (authors ?? []).find((a) => a.slug === slug)?.id ?? null;
  const categoryId = (slug) => (categories ?? []).find((c) => c.slug === slug)?.id ?? null;

  const results = [];

  for (const summary of summaries) {
    const uid = summary.uid;
    const label = (uid ?? summary._id ?? "?").slice(0, 46);
    try {
      const detailRes = await fetch(`${MONGO_BASE}/api/blogs/${uid}/madhuban`);
      if (!detailRes.ok) throw new Error(`detail HTTP ${detailRes.status}`);
      const blog = (await detailRes.json()).blog;
      if (!blog) throw new Error("detail response had no blog");

      const { data: existing } = await supabase
        .from("blogs")
        .select("id, featured_image_r2_key")
        .eq("slug", uid)
        .maybeSingle();

      const reuseImages = existing && !FORCE;

      // ── Featured image ────────────────────────────────────────────────────
      let featured = null;
      const featuredSrc = blog.featuredImage?.url ?? "";
      if (!reuseImages && featuredSrc.startsWith("data:")) {
        const decoded = decodeDataUri(featuredSrc);
        if (decoded) {
          featured = await putImage(decoded.buffer, decoded.mimeType, `${uid}-featured`);
        }
      } else if (!reuseImages && /^https?:\/\//i.test(featuredSrc)) {
        featured = await rehostRemote(featuredSrc, `${uid}-featured`);
        if (!featured) featured = { url: featuredSrc, key: null };
      }

      // ── Body images ───────────────────────────────────────────────────────
      const rawHtml = blog.description ?? "";
      const { html: contentHtml, images: inlineImages } = reuseImages
        ? { html: rawHtml, images: [] }
        : await extractInlineImages(rawHtml, uid);

      // ── Text-derived fields ───────────────────────────────────────────────
      const plain = stripTags(contentHtml);
      const metaTitle =
        blog.meta?.title?.trim() || truncate(`${blog.title} | ${SITE_NAME}`, 60);
      const metaDescription =
        blog.meta?.description?.trim() || truncate(plain, 158);
      const keywords = (blog.meta?.keywords ?? "")
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean);

      const categorySlug = inferCategorySlug(blog);
      const authorSlug = AUTHOR_BY_NAME[blog.authorName] ?? "madhuban-eco-retreat";

      const row = {
        title: blog.title,
        slug: uid,
        excerpt: truncate(blog.meta?.description?.trim() || plain, 300),
        content: contentHtml,
        featured_image_alt: blog.featuredImage?.altText?.trim() || blog.title,
        category_id: categoryId(categorySlug),
        author_id: authorId(authorSlug),
        status: "published",
        meta_title: metaTitle,
        meta_description: metaDescription,
        focus_keyword: keywords[0] ?? null,
        keywords: keywords.length ? keywords : null,
        reading_time: Math.max(1, Math.round(readingTime(plain).minutes)),
        // FAQ entries carry a Mongo _id that means nothing here.
        faq: (blog.faq ?? []).map(({ question, answer }) => ({ question, answer })),
        tags: (blog.tags ?? [])
          .map((t) => (typeof t === "string" ? t : t?.name))
          .filter(Boolean),
        canonical_url: blog.meta?.canonicalUrl?.trim() || null,
        published_at: blog.createdAt ?? new Date().toISOString(),
        legacy_mongo_id: blog._id ?? null,
        legacy_uid: uid,
      };

      if (featured) {
        row.featured_image_url = featured.url;
        row.featured_image_r2_key = featured.key;
        row.og_image_url = blog.ogTags?.image?.trim() || featured.url;
      }

      if (DRY_RUN) {
        console.log(
          `  ${label.padEnd(48)} → ${categorySlug.padEnd(22)} ${authorSlug.padEnd(20)} ` +
            `${String(row.reading_time).padStart(2)}min  ` +
            `img:${featured ? "1" : "0"}+${inlineImages.length}  ` +
            `html:${Math.round(contentHtml.length / 1024)}KB`,
        );
        results.push({ uid, ok: true, categorySlug, authorSlug, inlineImages });
        continue;
      }

      const { data: saved, error } = await supabase
        .from("blogs")
        .upsert(row, { onConflict: "slug" })
        .select("id")
        .single();
      if (error) throw new Error(error.message);

      // ── Image bookkeeping ─────────────────────────────────────────────────
      const imageRows = [
        ...(featured?.key ? [{ ...featured, alt: row.featured_image_alt }] : []),
        ...inlineImages.map((img) => ({ ...img, alt: null })),
      ].map((img) => ({
        blog_id: saved.id,
        r2_key: img.key,
        url: img.url,
        alt_text: img.alt,
        file_name: img.key.split("/").pop(),
        width: img.width,
        height: img.height,
        size_bytes: img.sizeBytes,
        format: img.format,
      }));

      if (imageRows.length) {
        const { error: imgError } = await supabase
          .from("blog_images")
          .upsert(imageRows, { onConflict: "r2_key" });
        if (imgError) throw new Error(`blog_images: ${imgError.message}`);
      }

      console.log(
        `  ✓ ${label.padEnd(48)} ${categorySlug.padEnd(22)} ` +
          `${String(row.reading_time).padStart(2)}min  ` +
          `img:${featured ? "1" : "0"}+${inlineImages.length}` +
          `${reuseImages ? "  (images kept)" : ""}`,
      );
      results.push({ uid, ok: true, categorySlug, authorSlug, inlineImages });
    } catch (error) {
      console.error(`  ✗ ${label.padEnd(48)} ${error.message}`);
      results.push({ uid, ok: false, error: error.message });
    }
  }

  // Counted here rather than through refresh_blog_author_counts() so the import
  // does not depend on that function having been (re)created — an older copy of
  // the migration shipped a blanket UPDATE, which pg-safeupdate rejects.
  if (!DRY_RUN) await refreshAuthorCounts(authors);

  const ok = results.filter((r) => r.ok).length;
  const failed = results.filter((r) => !r.ok);
  const bytes = uploads.reduce((sum, u) => sum + u.sizeBytes, 0);

  console.log(
    `\n${ok}/${results.length} posts imported · ` +
      `${uploads.length} images ${DRY_RUN ? "would upload" : "uploaded"} ` +
      `(${(bytes / 1024 / 1024).toFixed(1)} MB)`,
  );
  for (const f of failed) console.log(`  failed: ${f.uid} — ${f.error}`);
  if (failed.length) process.exitCode = 1;
}

main().catch((error) => {
  console.error(`\nImport aborted: ${error.message}`);
  process.exitCode = 1;
});
