"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Search, SearchX } from "lucide-react";
import { BlogCard, BlogCardSkeleton } from "./BlogCard";
import { FeaturedBlog } from "./FeaturedBlog";

/**
 * The blog index: hero search, category tabs, grid and Load More.
 *
 * The first page of results is rendered on the server and passed in as
 * `initialBlogs`, so the grid is present and crawlable before any JavaScript
 * runs; this component only fetches once the reader searches, changes category
 * or asks for more.
 *
 * The newest post is lifted out of the same list and shown as the featured
 * block, then skipped in the grid below. Selecting it here rather than in the
 * page keeps one source of truth: composing it server-side meant that clearing
 * a filter re-rendered the featured block while the refetched page 1 also
 * contained that post, showing it twice.
 *
 * Featured is hidden while a filter is active, because a "latest story" banner
 * above filtered results reads as a hit that is inexplicably out of order.
 */

const PAGE_SIZE = 9;

export function BlogIndexClient({ initialBlogs, initialTotal, categories }) {
  const [blogs, setBlogs] = useState(initialBlogs);
  const [total, setTotal] = useState(initialTotal);
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  // Stops a slow earlier request from overwriting a newer one: switching
  // category twice quickly would otherwise settle on the first response.
  const requestRef = useRef(0);
  // Page 1 of the unfiltered list is already on screen from the server.
  const primedRef = useRef(true);

  useEffect(() => {
    const timer = setTimeout(() => setQuery(search.trim()), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchPage = useCallback(
    async (nextPage, { append }) => {
      const token = ++requestRef.current;
      if (append) setLoadingMore(true);
      else setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          page: String(nextPage),
          limit: String(PAGE_SIZE),
        });
        if (category !== "all") params.set("category", category);
        if (query) params.set("search", query);

        const res = await fetch(`/api/blogs?${params}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Could not load stories");
        if (token !== requestRef.current) return;

        setBlogs((prev) => (append ? [...prev, ...data.blogs] : data.blogs));
        setTotal(data.total);
        setPage(nextPage);
      } catch (err) {
        if (token === requestRef.current) setError(err.message);
      } finally {
        if (token === requestRef.current) {
          setLoading(false);
          setLoadingMore(false);
        }
      }
    },
    [category, query],
  );

  useEffect(() => {
    if (primedRef.current) {
      primedRef.current = false;
      return;
    }
    fetchPage(1, { append: false });
  }, [fetchPage]);

  const filtering = query !== "" || category !== "all";
  // Featured is the newest post of the unfiltered list; the grid skips it so it
  // is not shown twice.
  const featured = filtering ? null : blogs[0];
  const gridBlogs = filtering ? blogs : blogs.slice(1);
  const hasMore = blogs.length < total;

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="bg-[#F5F0E8] px-4 pb-14 pt-28 sm:pt-32">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 text-center">
          <h1 className="font-[family-name:var(--font-primary)] text-4xl leading-tight text-[rgb(110,97,70)] sm:text-5xl">
            Stories from the Wild
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-[#3a3d45]/75">
            Field notes, travel guides and slow-tourism dispatches from the forests
            of Ratapani Tiger Reserve.
          </p>
          <div className="relative mt-2 w-full max-w-xl">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#3a3d45]/40"
              aria-hidden="true"
            />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search stories…"
              aria-label="Search stories"
              className="h-12 w-full rounded-full border border-[#c8b99a]/60 bg-white pl-11 pr-4 text-sm text-[#3a3d45] placeholder:text-[#3a3d45]/40 focus:border-[rgb(110,97,70)] focus:outline-none"
            />
          </div>
        </div>
      </section>

      {/* ── Featured (hidden while filtering) ─────────────────────────── */}
      {featured && <FeaturedBlog blog={featured} />}

      {/* ── Grid ─────────────────────────────────────────────────────── */}
      <section className="px-4 py-14">
        <div className="mx-auto flex max-w-6xl flex-col gap-8">
          <div
            className="flex flex-wrap justify-center gap-2"
            role="tablist"
            aria-label="Filter stories by category"
          >
            {[{ slug: "all", name: "All" }, ...categories].map((tab) => {
              const active = category === tab.slug;
              return (
                <button
                  key={tab.slug}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setCategory(tab.slug)}
                  className={
                    active
                      ? "rounded-full bg-[rgb(110,97,70)] px-4 py-2 text-sm font-medium text-white transition-colors"
                      : "rounded-full bg-white px-4 py-2 text-sm text-[#3a3d45]/75 ring-1 ring-[#c8b99a]/50 transition-colors hover:bg-[#F5F0E8] hover:text-[#3a3d45]"
                  }
                >
                  {tab.name}
                </button>
              );
            })}
          </div>

          <p aria-live="polite" className="text-center text-sm text-[#3a3d45]/60">
            {loading
              ? "Searching…"
              : `Showing ${blogs.length} of ${total} ${total === 1 ? "story" : "stories"}`}
          </p>

          {error && (
            <p role="alert" className="text-center text-sm text-red-700">
              {error}
            </p>
          )}

          {loading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }, (_, i) => (
                <BlogCardSkeleton key={i} />
              ))}
            </div>
          ) : gridBlogs.length === 0 && !featured ? (
            <div className="flex flex-col items-center gap-3 rounded-2xl bg-white/70 px-6 py-16 text-center">
              <SearchX className="h-8 w-8 text-[rgb(110,97,70)]/50" aria-hidden="true" />
              <p className="font-[family-name:var(--font-primary)] text-xl text-[#3a3d45]">
                No stories found
              </p>
              <p className="max-w-md text-sm text-[#3a3d45]/60">
                {query
                  ? `Nothing matches “${query}”. Try a different search, or browse another category.`
                  : "There are no stories in this category yet."}
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setCategory("all");
                }}
                className="mt-2 rounded-full bg-[rgb(110,97,70)] px-5 py-2 text-sm font-medium text-white"
              >
                Show all stories
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {gridBlogs.map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
              {loadingMore &&
                Array.from({ length: 3 }, (_, i) => (
                  <BlogCardSkeleton key={`more-${i}`} />
                ))}
            </div>
          )}

          {hasMore && !loading && (
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => fetchPage(page + 1, { append: true })}
                disabled={loadingMore}
                className="rounded-full border border-[rgb(110,97,70)] px-8 py-3 text-sm font-medium text-[rgb(110,97,70)] transition-colors hover:bg-[rgb(110,97,70)] hover:text-white disabled:opacity-50"
              >
                {loadingMore ? "Loading…" : "Load more stories"}
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
