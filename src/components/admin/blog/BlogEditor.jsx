"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, ExternalLink, Save, Send } from "lucide-react";
import { Button, Card, Input, Select, TextArea } from "@/components/admin/ui";
import { RichTextEditor } from "./RichTextEditor";
import { FeaturedImagePicker } from "./FeaturedImagePicker";
import { TagInput } from "./TagInput";
import { FaqEditor } from "./FaqEditor";
import {
  META_DESCRIPTION_MAX,
  META_TITLE_MAX,
  deriveExcerpt,
  deriveMetaDescription,
  deriveMetaTitle,
  readingTimeFromHtml,
  toSlug,
} from "@/lib/blog/derive";
import { cn } from "@/lib/utils";

/**
 * The post editor, shared by /admin/blogs/new and /admin/blogs/[id]/edit.
 *
 * SEO fields auto-fill from the title and excerpt until the writer edits them,
 * at which point that field is theirs and stops tracking. Without that latch,
 * a hand-written meta description would be silently overwritten on the next
 * keystroke in the title.
 */

const STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
];

const EMPTY = {
  title: "",
  slug: "",
  status: "draft",
  content: "",
  excerpt: "",
  featured_image_url: null,
  featured_image_r2_key: null,
  featured_image_alt: "",
  category_id: "",
  author_id: "",
  meta_title: "",
  meta_description: "",
  focus_keyword: "",
  tags: [],
  faq: [],
  canonical_url: "",
};

function PanelHeading({ children }) {
  return (
    <h2 className="font-body text-[11px] font-semibold uppercase tracking-[0.14em] text-charcoal/50">
      {children}
    </h2>
  );
}

/** Character counter that turns amber past the recommended length. */
function CharCount({ value, max }) {
  const length = (value ?? "").length;
  return (
    <span
      className={cn(
        "font-body text-[11px] tabular-nums",
        length > max ? "text-warning" : "text-charcoal/40",
      )}
    >
      {length}/{max}
    </span>
  );
}

export function BlogEditor({ initial, categories, authors, mode }) {
  const router = useRouter();
  const [form, setForm] = useState(() => ({ ...EMPTY, ...(initial ?? {}) }));
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  // Which fields the writer has taken over from the auto-fill.
  const touched = useRef({
    slug: mode === "edit" && Boolean(initial?.slug),
    meta_title: mode === "edit" && Boolean(initial?.meta_title),
    meta_description: mode === "edit" && Boolean(initial?.meta_description),
    excerpt: mode === "edit" && Boolean(initial?.excerpt),
  });

  const set = useCallback((patch) => {
    setForm((prev) => ({ ...prev, ...patch }));
    setDirty(true);
  }, []);

  // Auto-derived fields, recomputed only while still untouched.
  useEffect(() => {
    setForm((prev) => {
      const next = {};
      if (!touched.current.slug && prev.title) {
        const slug = toSlug(prev.title);
        if (slug !== prev.slug) next.slug = slug;
      }
      if (!touched.current.meta_title && prev.title) {
        const metaTitle = deriveMetaTitle(prev.title);
        if (metaTitle !== prev.meta_title) next.meta_title = metaTitle;
      }
      return Object.keys(next).length > 0 ? { ...prev, ...next } : prev;
    });
  }, [form.title]);

  useEffect(() => {
    setForm((prev) => {
      const next = {};
      if (!touched.current.excerpt && prev.content) {
        const excerpt = deriveExcerpt(prev.content);
        if (excerpt !== prev.excerpt) next.excerpt = excerpt;
      }
      if (!touched.current.meta_description) {
        const source = touched.current.excerpt ? prev.excerpt : deriveExcerpt(prev.content);
        const description = deriveMetaDescription(source, prev.content);
        if (description !== prev.meta_description) next.meta_description = description;
      }
      return Object.keys(next).length > 0 ? { ...prev, ...next } : prev;
    });
  }, [form.content, form.excerpt]);

  // Closing the tab mid-draft loses work that was never sent anywhere.
  useEffect(() => {
    if (!dirty) return undefined;
    const warn = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const readingTime = useMemo(() => readingTimeFromHtml(form.content), [form.content]);

  async function save(nextStatus) {
    if (!form.title.trim()) {
      toast.error("Give the post a title before saving");
      return;
    }
    setSaving(true);

    const payload = {
      ...form,
      status: nextStatus ?? form.status,
      slug: form.slug || toSlug(form.title),
      category_id: form.category_id || null,
      author_id: form.author_id || null,
      // Half-filled rows would emit invalid FAQ schema.
      faq: (form.faq ?? []).filter((f) => f.question?.trim() && f.answer?.trim()),
    };

    try {
      const isNew = mode === "new";
      const res = await fetch(
        isNew ? "/api/admin/blog" : `/api/admin/blog/${initial.id}`,
        {
          method: isNew ? "POST" : "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Save failed");

      setDirty(false);
      toast.success(
        payload.status === "published" ? "Post published" : "Post saved",
      );

      if (isNew) {
        router.replace(`/admin/blogs/${data.id}/edit`);
      } else {
        setForm((prev) => ({ ...prev, status: data.status, slug: data.slug }));
        router.refresh();
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" href="/admin/blogs">
            <ArrowLeft className="h-4 w-4" />
            All posts
          </Button>
          <h1 className="font-display text-2xl text-charcoal">
            {mode === "new" ? "New post" : "Edit post"}
          </h1>
          {dirty && (
            <span className="font-body text-xs text-warning">Unsaved changes</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {mode === "edit" && form.status === "published" && (
            <Button variant="ghost" size="sm" href={`/blogs/${form.slug}`}>
              <ExternalLink className="h-4 w-4" />
              View
            </Button>
          )}
          <Button variant="secondary" size="sm" loading={saving} onClick={() => save("draft")}>
            <Save className="h-4 w-4" />
            Save draft
          </Button>
          <Button size="sm" loading={saving} onClick={() => save("published")}>
            <Send className="h-4 w-4" />
            {form.status === "published" ? "Update" : "Publish"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,3fr)]">
        {/* ── Body ─────────────────────────────────────────────────────── */}
        <div className="flex min-w-0 flex-col gap-4">
          <Input
            label="Title"
            required
            value={form.title}
            onChange={(e) => set({ title: e.target.value })}
            placeholder="Ratapani Tiger Reserve: A Complete Guide"
            className="!text-lg"
          />
          <RichTextEditor
            value={form.content}
            onChange={(html) => set({ content: html })}
            blogId={initial?.id ?? null}
          />
          <Card variant="compact" className="flex flex-col gap-2">
            <PanelHeading>Excerpt</PanelHeading>
            <TextArea
              value={form.excerpt ?? ""}
              onChange={(e) => {
                touched.current.excerpt = true;
                set({ excerpt: e.target.value });
              }}
              rows={3}
              maxLength={300}
              currentLength={(form.excerpt ?? "").length}
              helperText="Shown on the blog index and used as the fallback meta description."
            />
          </Card>
        </div>

        {/* ── Sidebar ──────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-4">
          <Card variant="compact" className="flex flex-col gap-3">
            <PanelHeading>Publish</PanelHeading>
            <Select
              label="Status"
              value={form.status}
              options={STATUS_OPTIONS}
              onChange={(e) => set({ status: e.target.value })}
            />
            <p className="font-body text-xs text-charcoal/50">
              {readingTime} min read
              {initial?.views != null && ` · ${initial.views} views`}
            </p>
          </Card>

          <Card variant="compact" className="flex flex-col gap-3">
            <PanelHeading>SEO</PanelHeading>
            <div className="flex flex-col gap-1">
              <Input
                label="Meta title"
                value={form.meta_title ?? ""}
                onChange={(e) => {
                  touched.current.meta_title = true;
                  set({ meta_title: e.target.value });
                }}
              />
              <div className="flex justify-end">
                <CharCount value={form.meta_title} max={META_TITLE_MAX} />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <TextArea
                label="Meta description"
                rows={3}
                value={form.meta_description ?? ""}
                onChange={(e) => {
                  touched.current.meta_description = true;
                  set({ meta_description: e.target.value });
                }}
              />
              <div className="flex justify-end">
                <CharCount value={form.meta_description} max={META_DESCRIPTION_MAX} />
              </div>
            </div>
            <Input
              label="Focus keyword"
              value={form.focus_keyword ?? ""}
              onChange={(e) => set({ focus_keyword: e.target.value })}
              placeholder="ratapani tiger reserve"
            />
            <Input
              label="URL slug"
              value={form.slug ?? ""}
              onChange={(e) => {
                touched.current.slug = true;
                set({ slug: toSlug(e.target.value) });
              }}
              helperText={`/blogs/${form.slug || "…"}`}
            />
            <Input
              label="Canonical URL"
              value={form.canonical_url ?? ""}
              onChange={(e) => set({ canonical_url: e.target.value })}
              placeholder="Leave blank unless republished from elsewhere"
            />
          </Card>

          <Card variant="compact" className="flex flex-col gap-3">
            <PanelHeading>Featured image</PanelHeading>
            <FeaturedImagePicker
              value={{
                url: form.featured_image_url,
                r2Key: form.featured_image_r2_key,
              }}
              alt={form.featured_image_alt}
              blogId={initial?.id ?? null}
              onChange={({ url, r2Key, alt }) =>
                set({
                  featured_image_url: url ?? null,
                  featured_image_r2_key: r2Key ?? null,
                  featured_image_alt: alt ?? form.featured_image_alt,
                })
              }
            />
          </Card>

          <Card variant="compact" className="flex flex-col gap-3">
            <PanelHeading>Category</PanelHeading>
            <Select
              value={form.category_id ?? ""}
              placeholder="Select a category"
              options={categories.map((c) => ({ value: c.id, label: c.name }))}
              onChange={(e) => set({ category_id: e.target.value })}
            />
          </Card>

          <Card variant="compact" className="flex flex-col gap-3">
            <PanelHeading>Author</PanelHeading>
            <Select
              value={form.author_id ?? ""}
              placeholder="Select an author"
              options={authors.map((a) => ({ value: a.id, label: a.name }))}
              onChange={(e) => set({ author_id: e.target.value })}
            />
          </Card>

          <Card variant="compact" className="flex flex-col gap-3">
            <PanelHeading>Tags</PanelHeading>
            <TagInput value={form.tags ?? []} onChange={(tags) => set({ tags })} />
          </Card>

          <Card variant="compact" className="flex flex-col gap-3">
            <PanelHeading>FAQ section</PanelHeading>
            <FaqEditor value={form.faq ?? []} onChange={(faq) => set({ faq })} />
          </Card>
        </div>
      </div>
    </div>
  );
}
