"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  Copy,
  ExternalLink,
  Eye,
  FileText,
  Loader2,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import {
  Badge,
  Button,
  DataTable,
  IconButton,
  Modal,
  Select,
  Tabs,
} from "@/components/admin/ui";

const STATUS_TABS = [
  { value: "all", label: "All" },
  { value: "published", label: "Published" },
  { value: "draft", label: "Draft" },
  { value: "archived", label: "Archived" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "most_viewed", label: "Most viewed" },
  { value: "title", label: "Title A–Z" },
];

const STATUS_VARIANT = {
  published: "confirmed",
  draft: "pending",
  archived: "neutral",
};

const PAGE_SIZE = 20;

export function BlogsListClient({ categories }) {
  const router = useRouter();
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("all");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("newest");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState([]);
  const [busy, setBusy] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Typing a title should not fire a request per keystroke.
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(PAGE_SIZE),
        status,
        category,
        sort,
      });
      if (debouncedSearch) params.set("search", debouncedSearch);

      const res = await fetch(`/api/admin/blog?${params}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not load posts");
      setRows(data.blogs);
      setTotal(data.total);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [page, status, category, sort, debouncedSearch]);

  useEffect(() => {
    load();
  }, [load]);

  // Any filter change invalidates the current page number.
  useEffect(() => {
    setPage(1);
    setSelected([]);
  }, [status, category, sort, debouncedSearch]);

  async function runBulk(action) {
    if (selected.length === 0) return;
    setBusy(true);
    try {
      const res = await fetch("/api/admin/blog/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ids: selected.map((r) => r.id) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Bulk action failed");
      toast.success(`${data.affected} post${data.affected === 1 ? "" : "s"} updated`);
      setSelected([]);
      await load();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setBusy(false);
      setConfirmDelete(null);
    }
  }

  async function deleteOne(row) {
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/blog/${row.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Delete failed");
      toast.success(`"${row.title}" deleted`);
      await load();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setBusy(false);
      setConfirmDelete(null);
    }
  }

  async function duplicate(row) {
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/blog/${row.id}/duplicate`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Duplicate failed");
      toast.success("Draft copy created");
      router.push(`/admin/blogs/${data.id}/edit`);
    } catch (error) {
      toast.error(error.message);
      setBusy(false);
    }
  }

  const columns = [
    {
      key: "title",
      label: "Title",
      render: (row) => (
        <div className="flex flex-col gap-0.5">
          <span className="font-medium text-charcoal">{row.title}</span>
          <span className="font-body text-xs text-charcoal/45">/blogs/{row.slug}</span>
        </div>
      ),
    },
    {
      key: "author",
      label: "Author",
      render: (row) => row.blog_authors?.name ?? "—",
    },
    {
      key: "category",
      label: "Category",
      render: (row) => row.blog_categories?.name ?? "—",
    },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <Badge variant={STATUS_VARIANT[row.status] ?? "neutral"}>{row.status}</Badge>
      ),
    },
    {
      key: "published_at",
      label: "Published",
      render: (row) =>
        row.published_at ? format(new Date(row.published_at), "d MMM yyyy") : "—",
    },
    {
      key: "reading_time",
      label: "Read",
      render: (row) => (row.reading_time ? `${row.reading_time} min` : "—"),
    },
    {
      key: "views",
      label: "Views",
      render: (row) => <span className="tabular-nums">{row.views ?? 0}</span>,
    },
    {
      key: "actions",
      label: "",
      render: (row) => (
        <div className="flex items-center justify-end gap-0.5">
          <IconButton
            icon={<Pencil className="h-4 w-4" />}
            label={`Edit ${row.title}`}
            onClick={() => router.push(`/admin/blogs/${row.id}/edit`)}
          />
          <IconButton
            icon={<Copy className="h-4 w-4" />}
            label={`Duplicate ${row.title}`}
            onClick={() => duplicate(row)}
          />
          {row.status === "published" && (
            <a
              href={`/blogs/${row.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View ${row.title}`}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-charcoal/60 hover:bg-charcoal/5 hover:text-charcoal"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
          <IconButton
            icon={<Trash2 className="h-4 w-4" />}
            label={`Delete ${row.title}`}
            onClick={() => setConfirmDelete({ mode: "one", row })}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl text-charcoal">Blog Posts</h1>
          <p className="font-body text-sm text-charcoal/55">
            {total} post{total === 1 ? "" : "s"}
          </p>
        </div>
        <Button href="/admin/blogs/new" size="sm">
          <Plus className="h-4 w-4" />
          New post
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Tabs tabs={STATUS_TABS} value={status} onChange={setStatus} />
        <div className="relative min-w-[14rem] flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal/40"
            aria-hidden="true"
          />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title…"
            aria-label="Search posts by title"
            className="h-10 w-full rounded-xl border border-admin-card-border bg-admin-card-bg pl-9 pr-3 font-body text-sm text-charcoal placeholder:text-charcoal/40 focus:border-forest-green focus:outline-none"
          />
        </div>
        <Select
          value={category}
          options={[
            { value: "all", label: "All categories" },
            ...categories.map((c) => ({ value: c.id, label: c.name })),
          ]}
          onChange={(e) => setCategory(e.target.value)}
        />
        <Select
          value={sort}
          options={SORT_OPTIONS}
          onChange={(e) => setSort(e.target.value)}
        />
      </div>

      {selected.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-forest-green/25 bg-forest-green/5 px-4 py-2.5">
          <span className="font-body text-sm text-charcoal">
            {selected.length} selected
          </span>
          <div className="ml-auto flex flex-wrap gap-2">
            <Button size="sm" variant="secondary" loading={busy} onClick={() => runBulk("publish")}>
              Publish
            </Button>
            <Button size="sm" variant="secondary" loading={busy} onClick={() => runBulk("draft")}>
              Move to draft
            </Button>
            <Button size="sm" variant="secondary" loading={busy} onClick={() => runBulk("archive")}>
              Archive
            </Button>
            <Button
              size="sm"
              variant="danger"
              loading={busy}
              onClick={() => setConfirmDelete({ mode: "bulk" })}
            >
              Delete
            </Button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center rounded-xl border border-admin-card-border bg-admin-card-bg py-20">
          <Loader2 className="h-5 w-5 animate-spin text-charcoal/40" aria-hidden="true" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={rows}
          selectable
          onSelectionChange={setSelected}
          emptyIcon={<FileText className="h-6 w-6 text-charcoal/30" />}
          emptyTitle="No posts found"
          emptyDescription={
            debouncedSearch
              ? `Nothing matches "${debouncedSearch}".`
              : "Create your first post to get started."
          }
          pagination={{
            page,
            pageSize: PAGE_SIZE,
            total,
            onPageChange: setPage,
          }}
        />
      )}

      <Modal
        open={Boolean(confirmDelete)}
        onClose={() => setConfirmDelete(null)}
        title={confirmDelete?.mode === "bulk" ? "Delete selected posts?" : "Delete this post?"}
      >
        <div className="flex flex-col gap-4">
          <p className="font-body text-sm text-charcoal/70">
            {confirmDelete?.mode === "bulk"
              ? `${selected.length} post${selected.length === 1 ? "" : "s"} will be permanently deleted, along with their uploaded images.`
              : `"${confirmDelete?.row?.title}" will be permanently deleted, along with its uploaded images.`}{" "}
            This cannot be undone.
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" size="sm" onClick={() => setConfirmDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              loading={busy}
              onClick={() =>
                confirmDelete?.mode === "bulk"
                  ? runBulk("delete")
                  : deleteOne(confirmDelete.row)
              }
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      </Modal>

      <p className="flex items-center gap-1.5 font-body text-xs text-charcoal/40">
        <Eye className="h-3.5 w-3.5" aria-hidden="true" />
        View counts update as readers open each post.
      </p>
    </div>
  );
}
