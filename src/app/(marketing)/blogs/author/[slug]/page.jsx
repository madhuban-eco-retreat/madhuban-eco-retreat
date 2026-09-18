export const dynamic = "force-dynamic";

import { buildMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";
import NewBlogPage from "@/components/blog/NewBlog";
import AuthorBio from "@/components/blog/AuthorBio";
import SEO from "@/components/seo/Seo";
import { getAuthorBySlug, getBlogsByAuthor } from "@/lib/blog/queries";

const BASE_URL = "https://www.madhubanecoretreat.com";
const LIMIT = 9;

function buildAuthorSchema(author) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${BASE_URL}/blogs/author/${author.slug}`,
    mainEntity: {
      "@type": "Person",
      name: author.name,
      description: author.bio,
      jobTitle: author.designation,
      image: author.avatar_url,
      email: author.email || undefined,
      sameAs: [author.twitter_url, author.linkedin_url, author.instagram_url].filter(
        Boolean,
      ),
    },
  };
}

const AuthorPage = async ({ params }) => {
  const { slug } = await params;
  const author = await getAuthorBySlug(slug);
  if (!author) notFound();

  const posts = await getBlogsByAuthor(author.id, { page: 1, limit: LIMIT });
  const blogs = posts?.blogs ?? [];

  return (
    <>
      <SEO schemas={[buildAuthorSchema(author)]} />

      {/* Author bio card — the fields (avatar, designation, bio, social
          links) already existed in the schema and admin editor but had no
          public page to render on. */}
      <div className="bg-warm-beige/20 pt-24 pb-10">
        <div className="custom-container">
          <AuthorBio author={author} headingLevel="h1" />
        </div>
      </div>

      <NewBlogPage
        blogs={blogs}
        posts={posts}
        categories={[]}
        authorSlug={slug}
        heading={`Posts by ${author.name}`}
        headingLevel="h2"
      />
    </>
  );
};

export default AuthorPage;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const author = await getAuthorBySlug(slug);

  if (!author) {
    return buildMetadata({
      title: "Author not found",
      description: "This author page is not available.",
      path: `/blogs/author/${slug}`,
      noIndex: true,
    });
  }

  return buildMetadata({
    title: `${author.name} — Madhuban Eco Retreat Blog`,
    description:
      author.bio ||
      `Read articles by ${author.name} on Madhuban Eco Retreat's blog.`,
    path: `/blogs/author/${slug}`,
    ogImage: author.avatar_url,
    ogImageAlt: author.avatar_alt,
  });
}
