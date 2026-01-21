export const dynamic = "force-static";
export const revalidate = 3600;
import CustomLinkBtn from "@/common-components/CustomLinkBtn/CustomLinBtn";
import CommonFaqs from "@/common-components/faqs/CommonFaqs";
import BlogDescription from "@/components/blog/BlogDescription";
import HeroSection from "@/components/homepage/HeroSection";
import SEO from "@/components/seo/Seo";
import { getAllBlogs, getBlogById } from "@/services/blog/blogServices";
import { generateMataDataForSEO } from "@/utills/helperFunctions";
import React from "react";

export function buildFaqSchema(faqs = []) {
  if (!faqs.length) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

const BlogDesc = async ({ params }) => {
  const { id } = await params;
  let blogDetails = null;
  let faqSchema = null;
  try {
    const data = await getBlogById(id);
    faqSchema = buildFaqSchema(data?.data?.blog?.faq);
    blogDetails = data?.data?.blog;
  } catch (err) {
    console.log("Error in fetching blog by id", err);
  }

  return (
    <>
      {blogDetails ? (
        <div>
          {faqSchema && <SEO schemas={[faqSchema]} />}

          <HeroSection
            image={blogDetails.featuredImage?.url}
            title={blogDetails?.title}
            createdAt={
              blogDetails?.createdAt
                ? new Date(blogDetails.createdAt)
                    .toLocaleDateString("en-GB")
                    .replace(/\//g, "-")
                : ""
            }
            showPrimaryBtn={false}
            showSecondaryBtn={false}
            breadcom={[
              { title: "Blogs", url: "/blogs" },
              { title: blogDetails?.meta?.title || "Blogs Detail" },
            ]}
          />

          <BlogDescription blog={blogDetails} />
          {Array.isArray(blogDetails?.faq) &&
            blogDetails?.faq?.[0]?.question?.length > 0 && (
              <CommonFaqs faqs={blogDetails?.faq} bgColor="bg-[#b4a681d8]" />
            )}
        </div>
      ) : (
        <div className="h-[70vh] flex flex-col gap-4 items-center justify-center text-center px-4 text-primary-gray2">
          <p className="text-2xl">Oops! We couldn’t load this blog.</p>
          <p>
            The blog you’re looking for isn’t available right now. Explore other
            nature-inspired stories while we bring this one back.
          </p>
          <CustomLinkBtn
            color="#6e6146ff"
            height="30px"
            href={"/blogs"}
            textColor="#D1C8C1"
            className="py-6 "
          >
            Explore Other Blogs
          </CustomLinkBtn>
        </div>
      )}
    </>
  );
};

export default BlogDesc;

export async function generateStaticParams() {
  const res = await getAllBlogs();

  const posts = res?.data?.blogs ?? [];

  return posts.map((post) => ({
    id: post?.uid,
  }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const data = await getBlogById(id);
  const blogDetails = data?.data?.blog;

  return generateMataDataForSEO({
    title: blogDetails?.meta?.title,
    description: blogDetails?.meta?.description,
    featuredImage: blogDetails?.featuredImage,
    keywords: blogDetails?.meta?.keywords,
    canonicalEndpoint: `/blogs/${id}`,
    robots: {
      index: true,
      follow: true,
    },
    ogImages: [blogDetails?.featuredImage?.url],
  });
}
