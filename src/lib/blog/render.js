/**
 * Prepares editor-authored article HTML for display.
 *
 * Two things the writer should not have to think about:
 *
 * 1. H2/H3 get stable `id` attributes so the table of contents can link to
 *    them. Done here rather than in the browser so the anchors exist in the
 *    served HTML — a TOC that only works after hydration is a TOC that does
 *    not work for a crawler, or for a reader who lands on /blogs/x#some-section
 *    and expects the page to arrive already scrolled.
 * 2. Tables are wrapped in their own scroll container. Several imported posts
 *    carry wide comparison tables that otherwise force the entire page to
 *    scroll sideways on a phone.
 *
 * The heading list is returned alongside so the TOC renders server-side with no
 * layout shift; only the scroll-spy highlighting needs the client.
 */

const HEADING_PATTERN = /<(h[23])\b([^>]*)>([\s\S]*?)<\/\1>/gi;

function stripTags(value) {
  return String(value ?? "")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&rsquo;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function slugifyHeading(text) {
  return (
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "section"
  );
}

/**
 * @returns {{ html: string, headings: Array<{id: string, text: string, level: number}> }}
 */
export function prepareArticleHtml(rawHtml) {
  const source = String(rawHtml ?? "");
  if (!source.trim()) return { html: "", headings: [] };

  const headings = [];
  const used = new Set();

  let html = source.replace(HEADING_PATTERN, (match, tag, attrs, inner) => {
    const text = stripTags(inner);
    // A heading with no readable text is decorative; linking to it from the
    // contents list would produce a blank row.
    if (!text) return match;

    // An author's own id wins, so a hand-written anchor keeps working.
    const existing = /\bid\s*=\s*["']([^"']+)["']/i.exec(attrs);
    let id = existing?.[1] ?? slugifyHeading(text);

    // Two sections legitimately called "Getting there" must not collide.
    let unique = id;
    for (let n = 2; used.has(unique); n += 1) unique = `${id}-${n}`;
    used.add(unique);
    id = unique;

    headings.push({ id, text, level: tag.toLowerCase() === "h2" ? 2 : 3 });

    const cleanedAttrs = attrs.replace(/\s*\bid\s*=\s*["'][^"']*["']/i, "");
    return `<${tag}${cleanedAttrs} id="${id}">${inner}</${tag}>`;
  });

  html = html.replace(
    /<table\b[\s\S]*?<\/table>/gi,
    (table) => `<div class="blog-table-scroll">${table}</div>`,
  );

  return { html, headings };
}

/** "12 August 2026" — unambiguous for an Indian audience, no US month-first. */
export function formatBlogDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });
}
