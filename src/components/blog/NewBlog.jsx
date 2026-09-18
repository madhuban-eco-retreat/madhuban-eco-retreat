import React from "react";
import Link from "next/link";
import { FaLeaf } from "react-icons/fa";
import BlogList from "@/common-components/Pagination/BlogListWithPagination";
import FeaturedPost from "./FeaturedPost";

const LIMIT = 9;

/**
 * Shared shell for /blogs, /blogs/category/[slug] and /blogs/author/[slug].
 * The first post gets the full-bleed FeaturedPost treatment; the rest sit in
 * an asymmetric grid (BlogListWithPagination) so the grid doesn't repeat the
 * same card size all the way down the page.
 *
 * Category tabs are real <Link>s to their own archive page (not a client-side
 * filter) so each category gets its own crawlable, indexable URL — a JS-only
 * filter on one page would hide all but the current category from search
 * engines entirely.
 */
const NewBlogPage = ({
  blogs,
  posts,
  categories = [],
  activeCategorySlug = null,
  authorSlug = null,
  heading = "Ratapani Tiger Reserve Blog",
  headingLevel = "h1",
  description = null,
}) => {
  const [featured, ...rest] = blogs;
  const HeadingTag = headingLevel;
  const isMainListPage = !activeCategorySlug && !authorSlug;

  return (
    <div className="bg-[#FAF7F2] pt-10 md:pt-14">
      <div className="custom-container">
        {/* Masthead — heading + lede paragraph lead the page, ahead of
            navigation and images, matching how the content itself should
            read: the point of the page first, filters and posts after.
            The heading spans the full width (matching the category row
            and everything else below it); only the paragraph's own text
            is capped for a readable line length, so the block doesn't
            look like a narrow column floating in a wider page. */}
        <HeadingTag className="font-primary text-3xl md:text-[2.75rem] leading-tight text-earth-brown">
          {heading}
        </HeadingTag>

        {isMainListPage ? (
          <p className="text-charcoal/80 text-base md:text-lg leading-relaxed mt-4">
            Ratapani Tiger Reserve stretches across the Raisen and Sehore
            districts of Madhya Pradesh, a short drive from Bhopal, where
            dry deciduous teak forest gives way to sandstone hills,
            seasonal streams and centuries-old heritage sites tucked into
            the landscape — including the prehistoric rock shelters of
            Bhimbetka nearby. Every article here is written from that same
            ground: wildlife encounters, forest walks, local history and
            practical guides for exploring the reserve and the villages
            around it, gathered by the people who live and work at
            Madhuban Eco Retreat on its edge.
          </p>
        ) : (
          description && (
            <p className="text-charcoal/70 text-base leading-relaxed mt-3">
              {description}
            </p>
          )
        )}

        {/* Category bar — sits under the intro, not above the page title */}
        {categories.length > 0 && !authorSlug && (
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-earth-brown/15 mt-8 mb-8 md:mt-10 md:mb-10 pb-4">
            <nav
              aria-label="Blog categories"
              className="overflow-x-auto no-scrollbar"
            >
              <div className="flex items-center gap-6 whitespace-nowrap">
                <Link
                  href="/blogs"
                  className={`text-sm font-medium pb-1 border-b-2 transition-colors ${
                    !activeCategorySlug
                      ? "border-brand-bronze text-earth-brown"
                      : "border-transparent text-charcoal/50 hover:text-earth-brown"
                  }`}
                >
                  All Stories
                </Link>
                {categories.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/blogs/category/${cat.slug}`}
                    className={`text-sm font-medium pb-1 border-b-2 transition-colors ${
                      activeCategorySlug === cat.slug
                        ? "border-brand-bronze text-earth-brown"
                        : "border-transparent text-charcoal/50 hover:text-earth-brown"
                    }`}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </nav>
            {isMainListPage && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded border border-earth-brown/15 shrink-0 self-start md:self-auto">
                <FaLeaf className="text-brand-bronze" size={14} />
                <span className="text-xs font-medium text-earth-brown">
                  Ratapani Tiger Reserve
                </span>
              </div>
            )}
          </div>
        )}

        {!blogs.length ? (
          <div className="text-center py-16">
            <p className="text-charcoal text-lg md:text-xl">
              No blogs available at the moment.
            </p>
            <p className="text-charcoal/60 text-sm mt-1">
              Stay tuned—we’ll be sharing insights, stories, and experiences
              very soon.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-10 md:mb-14">
              <FeaturedPost blog={featured} />
            </div>

            <BlogList
              initialBlogs={rest}
              totalPages={posts?.totalPages}
              total={posts?.total}
              limit={LIMIT}
              category={activeCategorySlug}
              author={authorSlug}
            />
          </>
        )}

        {/* Closing CTA — a real, working prompt rather than a newsletter
            form with no backend to submit to. This is a resort's blog, so
            the natural close is inviting the reader to actually visit.
            Styled like the blog cards (white, soft border, shadow) rather
            than a solid dark fill, for consistency with the rest of the
            page's card language. */}
        <div className="mt-16 md:mt-20 mb-4 rounded-xl bg-white border border-warm-beige/60 shadow-sm px-6 py-10 md:px-12 md:py-14 text-center">
          <h2 className="font-primary text-2xl md:text-3xl text-earth-brown">
            Ready to experience Ratapani yourself?
          </h2>
          <p className="text-charcoal/70 mt-3 max-w-xl mx-auto">
            Madhuban Eco Retreat sits on the edge of the reserve — forest
            suites, safari tents and mud houses, a short walk from the
            forest these stories are about.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
            <Link
              href="/stay-in-ratapani-tiger-reserve"
              className="inline-flex items-center justify-center rounded-full px-7 py-3 font-primary text-base font-medium text-warm-beige bg-earth-brown hover:bg-[rgb(132,116,85)] transition-colors"
            >
              Book Your Stay
            </Link>
            <a
              href="https://wa.me/919770558419"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full px-7 py-3 font-primary text-base font-medium text-earth-brown border border-earth-brown hover:bg-earth-brown/10 transition-colors"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
export default NewBlogPage;
