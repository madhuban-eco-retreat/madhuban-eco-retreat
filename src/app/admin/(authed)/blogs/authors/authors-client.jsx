"use client";

import { useRef, useState } from "react";
import NextImage from "next/image";
import { toast } from "sonner";
import { ImagePlus, Loader2, Pencil, Plus, UserRound } from "lucide-react";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  IconButton,
  Input,
  Modal,
  TextArea,
  Toggle,
} from "@/components/admin/ui";
import { toSlug } from "@/lib/blog/derive";

const BLANK = {
  name: "",
  slug: "",
  bio: "",
  designation: "",
  avatar_url: null,
  avatar_r2_key: null,
  avatar_alt: "",
  twitter_url: "",
  linkedin_url: "",
  instagram_url: "",
  email: "",
  is_active: true,
};

/** Avatar upload — same endpoint as post images, different folder prefix. */
function AvatarField({ value, name, onChange }) {
  const [busy, setBusy] = useState(false);
  const inputRef = useRef(null);

  async function upload(file) {
    if (!file) return;
    setBusy(true);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("fileName", `author-${toSlug(name) || "avatar"}`);
      const res = await fetch("/api/admin/blog/upload-image", {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed");
      onChange({ avatar_url: data.url, avatar_r2_key: data.r2Key });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex items-center gap-4">
      {value ? (
        <NextImage
          src={value}
          alt=""
          width={64}
          height={64}
          className="h-16 w-16 rounded-full object-cover"
          unoptimized
        />
      ) : (
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-warm-beige/40">
          <UserRound className="h-6 w-6 text-charcoal/30" aria-hidden="true" />
        </div>
      )}
      <div className="flex flex-col gap-1">
        <Button
          variant="secondary"
          size="sm"
          loading={busy}
          onClick={() => inputRef.current?.click()}
        >
          {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ImagePlus className="h-3.5 w-3.5" />}
          {value ? "Replace avatar" : "Upload avatar"}
        </Button>
        {value && (
          <button
            type="button"
            onClick={() => onChange({ avatar_url: null, avatar_r2_key: null })}
            className="text-left font-body text-xs text-charcoal/50 hover:text-error"
          >
            Remove
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          upload(file);
        }}
      />
    </div>
  );
}

export function AuthorsClient({ initial }) {
  const [rows, setRows] = useState(initial);
  const [editing, setEditing] = useState(null);
  const [busy, setBusy] = useState(false);

  async function refresh() {
    const res = await fetch("/api/admin/blog/authors");
    if (res.ok) setRows(await res.json());
  }

  async function save() {
    if (!editing.name.trim()) {
      toast.error("Name is required");
      return;
    }
    setBusy(true);
    try {
      const isNew = !editing.id;
      const res = await fetch(
        isNew ? "/api/admin/blog/authors" : `/api/admin/blog/authors/${editing.id}`,
        {
          method: isNew ? "POST" : "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...editing,
            slug: editing.slug || toSlug(editing.name),
          }),
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Save failed");
      toast.success(isNew ? "Author added" : "Author updated");
      setEditing(null);
      await refresh();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setBusy(false);
    }
  }

  async function toggleActive(row) {
    try {
      const res = await fetch(`/api/admin/blog/authors/${row.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !row.is_active }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Update failed");
      toast.success(row.is_active ? "Author deactivated" : "Author reactivated");
      await refresh();
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl text-charcoal">Blog Authors</h1>
          <p className="font-body text-sm text-charcoal/55">
            Authors are deactivated rather than deleted, so published bylines stay intact.
          </p>
        </div>
        <Button size="sm" onClick={() => setEditing({ ...BLANK })}>
          <Plus className="h-4 w-4" />
          New author
        </Button>
      </div>

      {rows.length === 0 ? (
        <EmptyState
          icon={<UserRound className="h-6 w-6 text-charcoal/30" />}
          title="No authors yet"
          description="Add an author before publishing a post."
        />
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {rows.map((row) => (
            <Card key={row.id} variant="compact" className="flex items-start gap-3">
              {row.avatar_url ? (
                <NextImage
                  src={row.avatar_url}
                  alt=""
                  width={48}
                  height={48}
                  className="h-12 w-12 flex-shrink-0 rounded-full object-cover"
                  unoptimized
                />
              ) : (
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-warm-beige/40">
                  <UserRound className="h-5 w-5 text-charcoal/30" aria-hidden="true" />
                </div>
              )}

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium text-charcoal">{row.name}</span>
                  <Badge variant={row.is_active ? "confirmed" : "neutral"}>
                    {row.is_active ? "Active" : "Inactive"}
                  </Badge>
                  <Badge variant="info">
                    {row.article_count} article{row.article_count === 1 ? "" : "s"}
                  </Badge>
                </div>
                {row.designation && (
                  <p className="font-body text-xs text-charcoal/60">{row.designation}</p>
                )}
                <p className="mt-1 line-clamp-2 font-body text-xs text-charcoal/45">
                  {row.bio || "No bio yet."}
                </p>
              </div>

              <div className="flex flex-col gap-1">
                <IconButton
                  icon={<Pencil className="h-4 w-4" />}
                  label={`Edit ${row.name}`}
                  onClick={() => setEditing({ ...row })}
                />
                <button
                  type="button"
                  onClick={() => toggleActive(row)}
                  className="font-body text-[10px] text-charcoal/50 hover:text-charcoal"
                >
                  {row.is_active ? "Deactivate" : "Activate"}
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={Boolean(editing)}
        onClose={() => setEditing(null)}
        title={editing?.id ? "Edit author" : "New author"}
        size="lg"
      >
        {editing && (
          <div className="flex flex-col gap-4">
            <AvatarField
              value={editing.avatar_url}
              name={editing.name}
              onChange={(patch) => setEditing({ ...editing, ...patch })}
            />
            <Input
              label="Name"
              required
              value={editing.name}
              onChange={(e) =>
                setEditing((prev) => ({
                  ...prev,
                  name: e.target.value,
                  slug: prev.id ? prev.slug : toSlug(e.target.value),
                }))
              }
            />
            <Input
              label="Slug"
              value={editing.slug ?? ""}
              onChange={(e) => setEditing({ ...editing, slug: toSlug(e.target.value) })}
              helperText={`/blogs/author/${editing.slug || "…"}`}
            />
            <Input
              label="Designation"
              value={editing.designation ?? ""}
              onChange={(e) => setEditing({ ...editing, designation: e.target.value })}
              placeholder="Wildlife Writer & Photographer"
            />
            <TextArea
              label="Bio"
              rows={4}
              value={editing.bio ?? ""}
              onChange={(e) => setEditing({ ...editing, bio: e.target.value })}
            />
            <Input
              label="Email"
              type="email"
              value={editing.email ?? ""}
              onChange={(e) => setEditing({ ...editing, email: e.target.value })}
            />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <Input
                label="Twitter"
                value={editing.twitter_url ?? ""}
                onChange={(e) => setEditing({ ...editing, twitter_url: e.target.value })}
                placeholder="https://x.com/…"
              />
              <Input
                label="LinkedIn"
                value={editing.linkedin_url ?? ""}
                onChange={(e) => setEditing({ ...editing, linkedin_url: e.target.value })}
                placeholder="https://linkedin.com/in/…"
              />
              <Input
                label="Instagram"
                value={editing.instagram_url ?? ""}
                onChange={(e) => setEditing({ ...editing, instagram_url: e.target.value })}
                placeholder="https://instagram.com/…"
              />
            </div>
            <Toggle
              label="Active"
              description="Inactive authors are hidden from the public site."
              checked={editing.is_active ?? true}
              onChange={(checked) => setEditing({ ...editing, is_active: checked })}
            />
            <div className="flex justify-end gap-2">
              <Button variant="secondary" size="sm" onClick={() => setEditing(null)}>
                Cancel
              </Button>
              <Button size="sm" loading={busy} onClick={save}>
                {editing.id ? "Save changes" : "Add author"}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
