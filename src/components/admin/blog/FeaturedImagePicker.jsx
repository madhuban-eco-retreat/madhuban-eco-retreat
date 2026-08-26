"use client";

import { useRef, useState } from "react";
import NextImage from "next/image";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import { Input } from "@/components/admin/ui";
import { cn } from "@/lib/utils";

/**
 * Featured-image control: click or drag to upload, plus the alt text.
 *
 * Alt text sits here rather than in a general SEO panel because it is a
 * property of this image — moving it elsewhere is how images end up shipped
 * with an empty alt attribute.
 */
export function FeaturedImagePicker({ value, alt, onChange, blogId }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  async function upload(file) {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("fileName", file.name);
      if (blogId) form.append("blogId", blogId);

      const res = await fetch("/api/admin/blog/upload-image", {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed");

      onChange({
        url: data.url,
        r2Key: data.r2Key,
        // Only prefill alt text when the writer has not written any: silently
        // replacing what they typed with a filename would be worse than blank.
        alt: alt || "",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    const key = value?.r2Key;
    onChange({ url: null, r2Key: null, alt: "" });
    // Fire-and-forget: the post no longer references the file, and a storage
    // hiccup should not block the writer. Worst case is an orphaned object.
    if (key) {
      fetch("/api/admin/blog/delete-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ r2Key: key }),
      }).catch(() => {});
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {value?.url ? (
        <div className="relative overflow-hidden rounded-xl border border-admin-card-border">
          <NextImage
            src={value.url}
            alt={alt || "Featured image preview"}
            width={640}
            height={360}
            className="h-36 w-full object-cover"
            unoptimized
          />
          <button
            type="button"
            onClick={remove}
            aria-label="Remove featured image"
            className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-charcoal/70 text-ivory backdrop-blur hover:bg-error"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            upload(e.dataTransfer.files?.[0]);
          }}
          disabled={busy}
          className={cn(
            "flex h-36 w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed transition-colors",
            dragging
              ? "border-forest-green bg-forest-green/5"
              : "border-admin-card-border hover:border-charcoal/30 hover:bg-charcoal/[0.02]",
          )}
        >
          {busy ? (
            <Loader2 className="h-5 w-5 animate-spin text-charcoal/40" />
          ) : (
            <ImagePlus className="h-5 w-5 text-charcoal/40" />
          )}
          <span className="font-body text-xs text-charcoal/60">
            {busy ? "Uploading…" : "Upload or drag an image"}
          </span>
          <span className="font-body text-[10px] text-charcoal/40">
            JPG, PNG, WebP or GIF · max 5 MB
          </span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          upload(file);
        }}
      />

      {error && (
        <p role="alert" className="font-body text-xs text-error">
          {error}
        </p>
      )}

      <Input
        label="Alt text"
        value={alt ?? ""}
        onChange={(e) => onChange({ ...value, alt: e.target.value })}
        placeholder="Describe the image for screen readers"
        helperText={
          value?.url && !alt
            ? "Without alt text this image is invisible to screen readers and to search."
            : undefined
        }
      />
    </div>
  );
}
