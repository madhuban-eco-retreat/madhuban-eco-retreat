"use client";
import React, { useState } from "react";
import Card from "../card/Card";
import CustomButton from "../CustomButton/CustomButton";
import { getAllBlogs } from "@/services/blog/blogServices";

// Latest first (descending by createdAt).
const sortByLatest = (list) =>
  [...list].sort(
    (a, b) => new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0),
  );

// Merge incoming blogs into the existing list, de-duping by id, keeping latest first.
const mergeBlogs = (existing, incoming) => {
  const map = new Map();
  [...existing, ...incoming].forEach((blog) => {
    const key = blog?._id ?? blog?.uid;
    if (key != null) map.set(key, blog);
  });
  return sortByLatest([...map.values()]);
};

function BlogList({ initialBlogs, totalPages, limit }) {
  const [blogs, setBlogs] = useState(() => sortByLatest(initialBlogs || []));
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const hasMore = currentPage < (totalPages || 1);

  const handleLoadMore = async () => {
    if (loading || !hasMore) return;
    const nextPage = currentPage + 1;
    setLoading(true);
    try {
      // getAllBlogs already returns parsed JSON, not a Response object.
      const data = await getAllBlogs(nextPage, limit);
      const newBlogs = Array.isArray(data?.blogs) ? data.blogs : [];
      setBlogs((prev) => mergeBlogs(prev, newBlogs));
      setCurrentPage(nextPage);
    } catch (error) {
      console.error("Failed to load more blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  // NOTE: cards are intentionally plain (no framer-motion reveal). A previous
  // version rendered the grid at opacity:0 and faded it in via whileInView,
  // which left blogs invisible whenever the client animation/hydration didn't
  // run. Rendering visible markup guarantees the list shows and the Load More
  // button stays interactive regardless of client-side JS timing.
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {blogs?.map((val) => (
          <div key={val?._id ?? val?.uid}>
            <Card
              imageUrl={
                val?.featuredImage?.url ||
                "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/no-image/no-image.png"
              }
              altText={val?.featuredImage?.alt || "Blog Image"}
              hrefLink={`blogs/${val?.uid}`}
              title={val?.title}
              createdAt={val?.createdAt?.split("T")[0]}
              cardkey={val?._id}
            />
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="mt-8 flex justify-center md:mt-12">
          <CustomButton
            onClick={handleLoadMore}
            loading={loading}
            disabled={loading}
            color="#6e6146ff"
            className="px-8 text-base"
            ariaLabel="Load more blogs"
          >
            {loading ? "Loading..." : "Load More"}
          </CustomButton>
        </div>
      )}
    </div>
  );
}

export default BlogList;
