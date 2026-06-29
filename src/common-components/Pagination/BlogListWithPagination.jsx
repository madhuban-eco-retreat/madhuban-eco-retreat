"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Card from "../card/Card";
import CustomButton from "../CustomButton/CustomButton";
import { getAllBlogs } from "@/services/blog/blogServices";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      when: "beforeChildren",
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
    },
  },
};

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

  return (
    <div className="w-full">
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        {blogs?.map((val) => (
          <motion.div variants={itemVariants} key={val?._id ?? val?.uid}>
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
          </motion.div>
        ))}
      </motion.div>

      {hasMore && (
        <div className="mt-8 flex justify-center md:mt-12">
          <CustomButton
            onClick={handleLoadMore}
            loading={loading}
            disabled={loading}
            color="#6e6146ff"
            className="px-8 text-md"
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
