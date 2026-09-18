"use client";
import React, { useState } from "react";
import Card from "../card/Card";

function formatDate(iso) {
  if (!iso) return "";
  return iso.split("T")[0];
}

// De-dupes by id in case a post's published_at shifts it across a page
// boundary between the initial render and a later Load More fetch.
const mergeBlogs = (existing, incoming) => {
  const map = new Map();
  [...existing, ...incoming].forEach((blog) => {
    if (blog?.id != null) map.set(blog.id, blog);
  });
  return [...map.values()];
};

/**
 * Editorial grid with a Load More button, on a 12-column track. The rhythm
 * repeats in blocks of 8: a wide/narrow pair (8+4 cols, matched height),
 * then two rows of three equal cards (4+4+4, shorter height) — not a
 * uniform grid, so the page has visual rhythm going down instead of one
 * card size repeated to the bottom.
 *
 * Reused on /blogs, /blogs/category/[slug] and /blogs/author/[slug] —
 * `category` and `author` scope which posts the Load More fetch pulls in,
 * matching whatever the server already rendered.
 */
function variantFor(idx) {
  switch (idx % 8) {
    case 0:
      return "large";
    case 1:
      return "small";
    default:
      return "trio";
  }
}

function BlogList({
  initialBlogs,
  totalPages,
  total = null,
  limit = 9,
  category = null,
  author = null,
}) {
  const [blogs, setBlogs] = useState(initialBlogs || []);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const hasMore = currentPage < (totalPages || 1);
  // +1 accounts for the featured post shown above the grid, which isn't
  // part of `blogs` here but is part of `total`.
  const shownCount = blogs.length + 1;

  const handleLoadMore = async () => {
    if (loading || !hasMore) return;
    const nextPage = currentPage + 1;
    setLoading(true);
    setError(false);
    try {
      const params = new URLSearchParams({
        page: String(nextPage),
        limit: String(limit),
      });
      if (category) params.set("category", category);
      if (author) params.set("author", author);

      const res = await fetch(`/api/blog?${params.toString()}`);
      if (!res.ok) throw new Error("Request failed");
      const data = await res.json();
      const newBlogs = Array.isArray(data?.blogs) ? data.blogs : [];
      setBlogs((prev) => mergeBlogs(prev, newBlogs));
      setCurrentPage(nextPage);
    } catch (err) {
      console.error("Failed to load more blogs:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  if (!blogs.length) return null;

  return (
    <div className="w-full">
      <div className="blog-grid">
        {blogs.map((blog, idx) => {
          const variant = variantFor(idx);
          return (
            <div
              key={blog.id}
              className={
                variant === "large"
                  ? "blog-grid-item-large"
                  : variant === "small"
                    ? "blog-grid-item-small"
                    : "blog-grid-item-trio"
              }
            >
              <Card
                cardkey={blog.id}
                imageUrl={blog?.featured_image_url}
                altText={blog?.featured_image_alt || blog?.title}
                hrefLink={`/blogs/${blog?.slug}`}
                title={blog?.title}
                createdAt={formatDate(blog?.published_at)}
                category={blog?.blog_categories?.name}
                variant={variant}
              />
            </div>
          );
        })}
      </div>

      {error && (
        <p className="text-center text-sm text-red-700 mt-6">
          Couldn&apos;t load more posts. Please try again.
        </p>
      )}

      <div className="flex flex-col items-center gap-3 mt-10 md:mt-14">
        {hasMore && (
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="px-8 py-3 rounded-full border border-earth-brown text-earth-brown text-sm font-medium tracking-wide transition-colors hover:bg-earth-brown hover:text-warm-beige disabled:opacity-50"
          >
            {loading ? "Loading…" : "Load More Stories"}
          </button>
        )}
        {total != null && (
          <span className="text-xs text-charcoal/50">
            Showing {Math.min(shownCount, total)} of {total} stories
          </span>
        )}
      </div>
    </div>
  );
}

export default BlogList;
