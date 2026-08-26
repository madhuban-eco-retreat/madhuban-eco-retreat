import { z } from "zod";
import { META_DESCRIPTION_MAX, META_TITLE_MAX } from "./derive";

/**
 * Request shapes for the blog admin API.
 *
 * Nullable-and-optional runs throughout because the editor sends a complete
 * object on every save, with cleared fields as empty strings. `blank` maps
 * those to null so the database stores an absent value rather than "", which
 * would otherwise satisfy every `if (row.meta_title)` check downstream.
 */

const blank = (schema) =>
  z.preprocess(
    (v) => (typeof v === "string" && v.trim() === "" ? null : v),
    schema.nullable().optional(),
  );

export const BLOG_STATUSES = ["draft", "published", "archived"];

const slugSchema = z
  .string()
  .min(1, "Slug is required")
  .max(96, "Slug is too long")
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Slug may contain lowercase letters, numbers and single hyphens only",
  );

const faqSchema = z.array(
  z.object({
    question: z.string().trim().min(1, "FAQ question cannot be empty"),
    answer: z.string().trim().min(1, "FAQ answer cannot be empty"),
  }),
);

export const blogCreateSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  slug: slugSchema,
  status: z.enum(BLOG_STATUSES).default("draft"),
  content: z.string().default(""),
  excerpt: blank(z.string().max(500)),
  featured_image_url: blank(z.string()),
  featured_image_r2_key: blank(z.string()),
  featured_image_alt: blank(z.string().max(300)),
  category_id: blank(z.string().uuid()),
  author_id: blank(z.string().uuid()),
  // Over-length meta is a warning in the editor, not a rejection: a writer
  // mid-edit should not be blocked from saving a draft over a soft SEO limit.
  meta_title: blank(z.string().max(META_TITLE_MAX + 40)),
  meta_description: blank(z.string().max(META_DESCRIPTION_MAX + 60)),
  focus_keyword: blank(z.string().max(120)),
  keywords: z.array(z.string()).nullable().optional(),
  tags: z.array(z.string()).default([]),
  faq: faqSchema.default([]),
  canonical_url: blank(z.string().url("Canonical URL must be a valid URL")),
  og_image_url: blank(z.string()),
  published_at: blank(z.string()),
});

/** Every field optional — the editor PATCHes only what changed. */
export const blogUpdateSchema = blogCreateSchema.partial();

export const categorySchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(80),
  slug: slugSchema,
  description: blank(z.string().max(500)),
  image_url: blank(z.string()),
  image_alt: blank(z.string().max(300)),
  meta_title: blank(z.string().max(META_TITLE_MAX + 40)),
  meta_description: blank(z.string().max(META_DESCRIPTION_MAX + 60)),
  display_order: z.number().int().min(0).default(0),
  is_active: z.boolean().default(true),
});

export const categoryUpdateSchema = categorySchema.partial();

/** Drag-and-drop reordering sends the whole list in its new order. */
export const categoryReorderSchema = z.object({
  order: z.array(z.string().uuid()).min(1, "Nothing to reorder"),
});

export const authorSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  slug: slugSchema,
  bio: blank(z.string().max(2000)),
  designation: blank(z.string().max(160)),
  avatar_url: blank(z.string()),
  avatar_r2_key: blank(z.string()),
  avatar_alt: blank(z.string().max(300)),
  twitter_url: blank(z.string().url("Twitter URL must be a valid URL")),
  linkedin_url: blank(z.string().url("LinkedIn URL must be a valid URL")),
  instagram_url: blank(z.string().url("Instagram URL must be a valid URL")),
  email: blank(z.string().email("Enter a valid email address")),
  is_active: z.boolean().default(true),
});

export const authorUpdateSchema = authorSchema.partial();

/** First validation message, for the single-error JSON the admin API returns. */
export function firstIssue(parsed, fallback = "Invalid input") {
  return parsed.error?.issues?.[0]?.message ?? fallback;
}
