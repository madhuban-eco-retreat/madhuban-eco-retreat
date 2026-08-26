"use client";

import { useState } from "react";
import { toast } from "sonner";
import { FolderTree, GripVertical, Pencil, Plus, Trash2 } from "lucide-react";
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
import { cn } from "@/lib/utils";

const BLANK = {
  name: "",
  slug: "",
  description: "",
  meta_title: "",
  meta_description: "",
  is_active: true,
};

export function CategoriesClient({ initial }) {
  const [rows, setRows] = useState(initial);
  const [editing, setEditing] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [busy, setBusy] = useState(false);
  const [dragIndex, setDragIndex] = useState(null);

  async function refresh() {
    const res = await fetch("/api/admin/blog/categories");
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
        isNew
          ? "/api/admin/blog/categories"
          : `/api/admin/blog/categories/${editing.id}`,
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
      toast.success(isNew ? "Category created" : "Category updated");
      setEditing(null);
      await refresh();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setBusy(false);
    }
  }

  async function remove(row) {
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/blog/categories/${row.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Delete failed");
      toast.success(`"${row.name}" deleted`);
      setConfirmDelete(null);
      await refresh();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setBusy(false);
    }
  }

  /** Reorders locally for immediate feedback, then persists the whole list. */
  async function commitOrder(next) {
    setRows(next);
    try {
      const res = await fetch("/api/admin/blog/categories/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: next.map((r) => r.id) }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Reorder failed");
    } catch (error) {
      toast.error(error.message);
      await refresh(); // Put the list back the way the server sees it.
    }
  }

  function onDrop(targetIndex) {
    if (dragIndex === null || dragIndex === targetIndex) return;
    const next = [...rows];
    const [moved] = next.splice(dragIndex, 1);
    next.splice(targetIndex, 0, moved);
    setDragIndex(null);
    commitOrder(next);
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl text-charcoal">Blog Categories</h1>
          <p className="font-body text-sm text-charcoal/55">
            Drag to reorder — the order here is the order readers see.
          </p>
        </div>
        <Button size="sm" onClick={() => setEditing({ ...BLANK })}>
          <Plus className="h-4 w-4" />
          New category
        </Button>
      </div>

      {rows.length === 0 ? (
        <EmptyState
          icon={<FolderTree className="h-6 w-6 text-charcoal/30" />}
          title="No categories yet"
          description="Add one to start organising posts."
        />
      ) : (
        <div className="flex flex-col gap-2">
          {rows.map((row, index) => (
            <Card
              key={row.id}
              variant="compact"
              className={cn(
                "flex items-center gap-3 transition-colors",
                dragIndex === index && "opacity-50",
              )}
            >
              <div
                draggable
                onDragStart={() => setDragIndex(index)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => onDrop(index)}
                onDragEnd={() => setDragIndex(null)}
                aria-label={`Reorder ${row.name}`}
                className="cursor-grab text-charcoal/30 hover:text-charcoal/60 active:cursor-grabbing"
              >
                <GripVertical className="h-4 w-4" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium text-charcoal">{row.name}</span>
                  {!row.is_active && <Badge variant="neutral">Hidden</Badge>}
                  <Badge variant="info">
                    {row.blog_count} post{row.blog_count === 1 ? "" : "s"}
                  </Badge>
                </div>
                <p className="font-body text-xs text-charcoal/45">/blogs/category/{row.slug}</p>
              </div>

              <IconButton
                icon={<Pencil className="h-4 w-4" />}
                label={`Edit ${row.name}`}
                onClick={() => setEditing({ ...row })}
              />
              <IconButton
                icon={<Trash2 className="h-4 w-4" />}
                label={`Delete ${row.name}`}
                disabled={row.blog_count > 0}
                onClick={() => setConfirmDelete(row)}
              />
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={Boolean(editing)}
        onClose={() => setEditing(null)}
        title={editing?.id ? "Edit category" : "New category"}
        size="lg"
      >
        {editing && (
          <div className="flex flex-col gap-4">
            <Input
              label="Name"
              required
              value={editing.name}
              onChange={(e) =>
                setEditing((prev) => ({
                  ...prev,
                  name: e.target.value,
                  // Existing slugs are load-bearing URLs, so only a new
                  // category tracks the name.
                  slug: prev.id ? prev.slug : toSlug(e.target.value),
                }))
              }
            />
            <Input
              label="Slug"
              value={editing.slug ?? ""}
              onChange={(e) => setEditing({ ...editing, slug: toSlug(e.target.value) })}
              helperText={`/blogs/category/${editing.slug || "…"}`}
            />
            <TextArea
              label="Description"
              rows={2}
              value={editing.description ?? ""}
              onChange={(e) => setEditing({ ...editing, description: e.target.value })}
            />
            <Input
              label="Meta title"
              value={editing.meta_title ?? ""}
              onChange={(e) => setEditing({ ...editing, meta_title: e.target.value })}
            />
            <TextArea
              label="Meta description"
              rows={2}
              value={editing.meta_description ?? ""}
              onChange={(e) =>
                setEditing({ ...editing, meta_description: e.target.value })
              }
            />
            <Toggle
              label="Visible to readers"
              checked={editing.is_active ?? true}
              onChange={(checked) => setEditing({ ...editing, is_active: checked })}
            />
            <div className="flex justify-end gap-2">
              <Button variant="secondary" size="sm" onClick={() => setEditing(null)}>
                Cancel
              </Button>
              <Button size="sm" loading={busy} onClick={save}>
                {editing.id ? "Save changes" : "Create category"}
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        open={Boolean(confirmDelete)}
        onClose={() => setConfirmDelete(null)}
        title="Delete category?"
      >
        <div className="flex flex-col gap-4">
          <p className="font-body text-sm text-charcoal/70">
            &ldquo;{confirmDelete?.name}&rdquo; will be removed. This cannot be undone.
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" size="sm" onClick={() => setConfirmDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              loading={busy}
              onClick={() => remove(confirmDelete)}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
