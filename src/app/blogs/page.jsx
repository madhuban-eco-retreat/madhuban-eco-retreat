import React, { use } from "react";
import { getAllBlogs } from "@/services/blog/blogServices";
import NewBlogPage from "@/components/blog/NewBlog";
import SEO from "@/components/seo/Seo";

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "Madhuban Eco Retreat Blog",
  url: "https://www.madhubanecoretreat.com/blog",
  description:
    "Nature stories, eco-travel guides, wildlife insights and sustainable living tips from Madhuban Eco Retreat, Ratapani.",
  publisher: {
    "@type": "Organization",
    name: "Madhuban Eco Retreat",
    url: "https://www.madhubanecoretreat.com",
  },
};

const BlogPage = () => {
  const getBlogs = async () => {
    try {
      const res = await getAllBlogs();
      return res.data;
    } catch (err) {
      console.log("Error in fetching blogs", err);
    }
  };

  const blogsData = use(getBlogs());

  if (!blogsData?.blogs)
    return (
      <div className="h-[70vh] flex items-center justify-center">
        No Blogs Found
      </div>
    );

  return (
    <>
      <SEO schemas={[blogSchema]} />
      <NewBlogPage />
    </>
  );
};

export default BlogPage;

export const metadata = {
  title: "Madhuban Blog | Nature, Travel & Eco-Living Stories",

  description:
    "Read nature stories, travel guides, wildlife insights, and eco-living tips from Madhuban Eco Retreat. Explore Ratapani and sustainable travel through our blog.",

  keywords: [
    "madhuban blog",
    "ratapani travel blog",
    "eco travel mp",
    "sustainable travel madhya pradesh",
    "nature blog bhopal",
    "ratapani guides",
  ],

  alternates: {
    canonical: "https://www.madhubanecoretreat.com/blog",
  },

  robots: {
    index: true,
    follow: true,
  },
};
