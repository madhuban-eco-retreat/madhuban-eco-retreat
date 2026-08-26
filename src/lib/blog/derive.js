import slugify from "slugify";

/**
 * The auto-generation rules for a blog post, in one place.
 *
 * No "server-only" here on purpose: the editor derives the same slug, meta
 * title and reading time live as you type, and the API derives them again on
 * save. Two implementations would drift, and the field the writer saw in the
 * sidebar would stop matching what was stored.
 */

export const SITE_NAME = "Madhuban Eco Retreat";

/** Google truncates around these; the editor warns past them rather than blocking. */
export const META_TITLE_MAX = 60;
export const META_DESCRIPTION_MAX = 160;
const META_DESCRIPTION_TARGET = 157;

/** Average adult reading speed, words per minute. */
const WORDS_PER_MINUTE = 200;

/** URL-safe slug from a title. */
export function toSlug(value) {
  return slugify(String(value ?? ""), {
    lower: true,
    strict: true,
    trim: true,
  }).slice(0, 96);
}

/**
 * Plain text from rich-text HTML.
 *
 * Script and style bodies are removed wholesale rather than tag-stripped —
 * otherwise their contents would be counted as prose and inflate the reading
 * time. Block-level tags become spaces so words either side of a paragraph
 * boundary do not run together into one token.
 */
export function htmlToText(html) {
  return String(html ?? "")
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&rsquo;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

export function countWords(html) {
  const text = htmlToText(html);
  return text ? text.split(/\s+/).length : 0;
}

/** Whole minutes, never zero — "0 min read" reads like a bug. */
export function readingTimeFromHtml(html) {
  return Math.max(1, Math.round(countWords(html) / WORDS_PER_MINUTE));
}

/** Truncates on a word boundary and appends an ellipsis. */
export function truncate(text, limit) {
  const clean = String(text ?? "").trim();
  if (clean.length <= limit) return clean;
  return `${clean.slice(0, limit - 1).replace(/\s+\S*$/, "")}…`;
}

/**
 * "{title} | Madhuban Eco Retreat", or the bare title when the suffix would
 * push it past the limit — a truncated brand name is worse than no brand name.
 */
export function deriveMetaTitle(title) {
  const bare = String(title ?? "").trim();
  if (!bare) return "";
  const suffixed = `${bare} | ${SITE_NAME}`;
  return suffixed.length <= META_TITLE_MAX ? suffixed : truncate(bare, META_TITLE_MAX);
}

/** Excerpt first, falling back to the opening of the body. */
export function deriveMetaDescription(excerpt, contentHtml) {
  const source = String(excerpt ?? "").trim() || htmlToText(contentHtml);
  return truncate(source, META_DESCRIPTION_TARGET);
}

export function deriveExcerpt(contentHtml, limit = 300) {
  return truncate(htmlToText(contentHtml), limit);
}

/** Comma- or newline-separated input into a clean, de-duplicated tag list. */
export function parseTags(input) {
  if (Array.isArray(input)) {
    return [...new Set(input.map((t) => String(t).trim()).filter(Boolean))];
  }
  return [
    ...new Set(
      String(input ?? "")
        .split(/[,\n]/)
        .map((t) => t.trim())
        .filter(Boolean),
    ),
  ];
}

/**
 * schema.org JSON-LD for a post: BlogPosting, plus FAQPage when the post has
 * FAQs and BreadcrumbList for the category trail.
 *
 * Stored on the row at save time rather than built during render so the shape
 * a post ships with is stable — regenerating on every request would silently
 * change the markup of old posts whenever this function is edited.
 */
export function buildSchemaMarkup({
  title,
  slug,
  excerpt,
  metaDescription,
  featuredImageUrl,
  authorName,
  authorSlug,
  categoryName,
  categorySlug,
  publishedAt,
  updatedAt,
  siteUrl = "https://www.madhubanecoretreat.com",
  faq = [],
}) {
  const url = `${siteUrl}/blogs/${slug}`;
  const graph = [
    {
      "@type": "BlogPosting",
      "@id": `${url}#article`,
      headline: truncate(title, 110), // schema.org advises 110 characters.
      description: metaDescription || excerpt || undefined,
      image: featuredImageUrl || undefined,
      datePublished: publishedAt || undefined,
      dateModified: updatedAt || publishedAt || undefined,
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      author: authorName
        ? {
            "@type": "Person",
            name: authorName,
            url: authorSlug ? `${siteUrl}/blogs/author/${authorSlug}` : undefined,
          }
        : undefined,
      publisher: {
        "@type": "Organization",
        name: SITE_NAME,
        url: siteUrl,
      },
      articleSection: categoryName || undefined,
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumbs`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
        { "@type": "ListItem", position: 2, name: "Blogs", item: `${siteUrl}/blogs` },
        ...(categoryName && categorySlug
          ? [
              {
                "@type": "ListItem",
                position: 3,
                name: categoryName,
                item: `${siteUrl}/blogs/category/${categorySlug}`,
              },
            ]
          : []),
        {
          "@type": "ListItem",
          position: categoryName && categorySlug ? 4 : 3,
          name: title,
          item: url,
        },
      ],
    },
  ];

  const answered = (faq ?? []).filter((f) => f?.question?.trim() && f?.answer?.trim());
  if (answered.length > 0) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      mainEntity: answered.map((f) => ({
        "@type": "Question",
        name: f.question.trim(),
        acceptedAnswer: { "@type": "Answer", text: f.answer.trim() },
      })),
    });
  }

  return { "@context": "https://schema.org", "@graph": graph };
}
