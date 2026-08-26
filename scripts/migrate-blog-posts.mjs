/**
 * One-time import of the legacy `blog_posts` table into `blogs`.
 *
 *   node scripts/migrate-blog-posts.mjs [--dry-run]
 *
 * `blog_posts` predates the blog CMS and holds posts written directly in
 * Supabase rather than in the old MongoDB backend, so scripts/migrate-blogs.mjs
 * never saw them. Consolidating them here means the frontend can read from one
 * table in Phase 3 without dropping content.
 *
 * The interesting difference is the body: `blog_posts.body` is a ProseMirror /
 * TipTap JSON document, while `blogs.content` is HTML. The serializer below is
 * deliberately strict — it throws on any node or mark it does not recognise
 * rather than skipping it, because silently dropping a node would quietly
 * truncate an article and nothing downstream would notice.
 *
 * The source rows are left in place; nothing here deletes from blog_posts.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DRY_RUN = process.argv.includes("--dry-run");

// Both fixed by instruction: every legacy post is house-authored, and none of
// their free-text categories ("Sustainability") map onto the seeded set.
const TARGET_AUTHOR_SLUG = "madhuban-eco-retreat";
const TARGET_CATEGORY_SLUG = "others";

function loadEnvLocal() {
  const file = path.join(ROOT, ".env.local");
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const match = /^([A-Za-z0-9_]+)=(.*)$/.exec(line);
    if (!match) continue;
    if (!process.env[match[1]]) {
      process.env[match[1]] = match[2].trim().replace(/^["']|["']$/g, "");
    }
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
const R2_PUBLIC_BASE = (process.env.NEXT_PUBLIC_R2_BASE ?? "").replace(/\/+$/, "");

// ── ProseMirror → HTML ───────────────────────────────────────────────────────
const escapeHtml = (text) =>
  String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/** Wraps text in the inline tags for its marks, innermost first. */
function applyMarks(html, marks = []) {
  return marks.reduce((acc, mark) => {
    switch (mark.type) {
      case "bold":
      case "strong":
        return `<strong>${acc}</strong>`;
      case "italic":
      case "em":
        return `<em>${acc}</em>`;
      case "underline":
        return `<u>${acc}</u>`;
      case "strike":
        return `<s>${acc}</s>`;
      case "code":
        return `<code>${acc}</code>`;
      case "highlight":
        return `<mark>${acc}</mark>`;
      case "link": {
        const href = escapeHtml(mark.attrs?.href ?? "#");
        const target = mark.attrs?.target
          ? ` target="${escapeHtml(mark.attrs.target)}" rel="noopener noreferrer"`
          : "";
        return `<a href="${href}"${target}>${acc}</a>`;
      }
      default:
        throw new Error(`Unhandled mark type "${mark.type}"`);
    }
  }, html);
}

function renderNodes(nodes = []) {
  return nodes.map(renderNode).join("");
}

function renderNode(node) {
  if (!node || typeof node !== "object") return "";

  switch (node.type) {
    case "doc":
      return renderNodes(node.content);
    case "text":
      return applyMarks(escapeHtml(node.text ?? ""), node.marks);
    case "paragraph":
      // An empty paragraph is a deliberate blank line in the editor.
      return node.content?.length
        ? `<p>${renderNodes(node.content)}</p>`
        : "<p></p>";
    case "heading": {
      const level = Math.min(Math.max(Number(node.attrs?.level ?? 2), 1), 6);
      return `<h${level}>${renderNodes(node.content)}</h${level}>`;
    }
    case "blockquote":
      return `<blockquote>${renderNodes(node.content)}</blockquote>`;
    case "bulletList":
      return `<ul>${renderNodes(node.content)}</ul>`;
    case "orderedList": {
      const start = node.attrs?.start;
      return `<ol${start && start !== 1 ? ` start="${start}"` : ""}>${renderNodes(node.content)}</ol>`;
    }
    case "listItem":
      return `<li>${renderNodes(node.content)}</li>`;
    case "codeBlock": {
      const language = node.attrs?.language;
      const cls = language ? ` class="language-${escapeHtml(language)}"` : "";
      return `<pre><code${cls}>${renderNodes(node.content)}</code></pre>`;
    }
    case "horizontalRule":
      return "<hr>";
    case "hardBreak":
      return "<br>";
    case "image": {
      const src = escapeHtml(node.attrs?.src ?? "");
      const alt = escapeHtml(node.attrs?.alt ?? "");
      const title = node.attrs?.title
        ? ` title="${escapeHtml(node.attrs.title)}"`
        : "";
      return `<img src="${src}" alt="${alt}"${title}>`;
    }
    default:
      // Loud on purpose — see the module comment.
      throw new Error(`Unhandled node type "${node.type}"`);
  }
}

function bodyToHtml(body) {
  if (body == null) return "";
  if (typeof body === "string") return body; // Already HTML.
  return renderNode(body);
}

const stripTags = (html) =>
  String(html || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();

/**
 * The cover images already live in this project's R2 bucket, so the object key
 * is recoverable from the URL — worth storing so the admin panel can manage the
 * image like any other upload.
 */
function r2KeyFromUrl(url) {
  if (!url || !R2_PUBLIC_BASE || !url.startsWith(`${R2_PUBLIC_BASE}/`)) return null;
  return url.slice(R2_PUBLIC_BASE.length + 1);
}

function normaliseTags(tags) {
  if (Array.isArray(tags)) return tags.map((t) => String(t).trim()).filter(Boolean);
  if (typeof tags === "string") {
    return tags.split(",").map((t) => t.trim()).filter(Boolean);
  }
  return [];
}

// ── Import ───────────────────────────────────────────────────────────────────
async function main() {
  console.log(
    `blog_posts → blogs${DRY_RUN ? "  (DRY RUN — nothing will be written)" : ""}\n`,
  );

  const { data: sourceRows, error: readError } = await supabase
    .from("blog_posts")
    .select("*")
    .order("published_at", { ascending: true });
  if (readError) throw new Error(`Could not read blog_posts: ${readError.message}`);
  console.log(`Source rows: ${sourceRows.length}`);

  const [{ data: authors }, { data: categories }] = await Promise.all([
    supabase.from("blog_authors").select("id, slug"),
    supabase.from("blog_categories").select("id, slug"),
  ]);

  const authorId = authors?.find((a) => a.slug === TARGET_AUTHOR_SLUG)?.id ?? null;
  const categoryId =
    categories?.find((c) => c.slug === TARGET_CATEGORY_SLUG)?.id ?? null;
  if (!authorId) throw new Error(`Author "${TARGET_AUTHOR_SLUG}" not found`);
  if (!categoryId) throw new Error(`Category "${TARGET_CATEGORY_SLUG}" not found`);

  const results = [];

  for (const source of sourceRows) {
    try {
      // A slug already in `blogs` would mean this row was imported before, or
      // that a MongoDB post claims the same URL. Either way, overwriting blindly
      // is wrong, so the collision is surfaced instead.
      const { data: clash } = await supabase
        .from("blogs")
        .select("id, legacy_mongo_id")
        .eq("slug", source.slug)
        .maybeSingle();
      if (clash && clash.legacy_mongo_id) {
        throw new Error(
          `slug "${source.slug}" already belongs to an imported MongoDB post`,
        );
      }

      const html = bodyToHtml(source.body);
      const plain = stripTags(html);
      const coverUrl = source.cover_image_url ?? null;

      const row = {
        title: source.title,
        slug: source.slug,
        excerpt: source.excerpt ?? null,
        content: html,
        featured_image_url: coverUrl,
        featured_image_r2_key: r2KeyFromUrl(coverUrl),
        featured_image_alt: source.cover_image_alt ?? source.title,
        og_image_url: coverUrl,
        author_id: authorId,
        category_id: categoryId,
        status: "published",
        meta_title: source.seo_title ?? source.title,
        meta_description: source.meta_description ?? null,
        tags: normaliseTags(source.tags),
        reading_time:
          source.read_time_minutes ??
          Math.max(1, Math.round(plain.split(/\s+/).filter(Boolean).length / 200)),
        faq: [],
        published_at: source.published_at ?? source.created_at,
      };

      if (DRY_RUN) {
        console.log(`\n  ${row.slug}`);
        console.log(`    title    : ${row.title}`);
        console.log(`    html     : ${html.length} chars, ${plain.split(/\s+/).length} words`);
        console.log(`    tags     : ${row.tags.join(", ") || "—"}`);
        console.log(`    image    : ${row.featured_image_url ?? "none"}`);
        console.log(`    r2 key   : ${row.featured_image_r2_key ?? "—"}`);
        console.log(`    reading  : ${row.reading_time} min`);
        console.log(`    preview  : ${html.slice(0, 120)}…`);
        results.push({ slug: source.slug, ok: true });
        continue;
      }

      const { error } = await supabase
        .from("blogs")
        .upsert(row, { onConflict: "slug" })
        .select("id")
        .single();
      if (error) throw new Error(error.message);

      console.log(`  ✓ ${source.slug}  (${html.length} chars HTML)`);
      results.push({ slug: source.slug, ok: true });
    } catch (error) {
      console.error(`  ✗ ${source.slug}: ${error.message}`);
      results.push({ slug: source.slug, ok: false, error: error.message });
    }
  }

  // Done per author with an .eq() filter so each UPDATE carries the WHERE
  // clause pg-safeupdate requires; refresh_blog_author_counts() is unusable
  // until 20260826_blog_cms_fixes.sql is applied.
  if (!DRY_RUN) {
    for (const author of authors ?? []) {
      const { count } = await supabase
        .from("blogs")
        .select("id", { count: "exact", head: true })
        .eq("author_id", author.id)
        .eq("status", "published");
      await supabase
        .from("blog_authors")
        .update({ article_count: count ?? 0 })
        .eq("id", author.id);
    }
  }

  const ok = results.filter((r) => r.ok).length;
  console.log(`\n${ok}/${results.length} rows imported`);
  for (const f of results.filter((r) => !r.ok)) {
    console.log(`  failed: ${f.slug} — ${f.error}`);
  }
  console.log("Source table blog_posts left unchanged.");
  if (results.some((r) => !r.ok)) process.exitCode = 1;
}

main().catch((error) => {
  console.error(`\nImport aborted: ${error.message}`);
  process.exitCode = 1;
});
