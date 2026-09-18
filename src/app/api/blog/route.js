import { NextResponse } from "next/server";
import {
  getAllBlogs,
  getBlogsByAuthor,
  getAuthorBySlug,
} from "@/lib/blog/queries";
import { DataUnavailableError } from "@/lib/supabase/public";

// Public, read-only. Backs the client-side "Load More" button and search box
// on the blog list/category pages, plus the author archive page — those are
// "use client" components that can't import the server-only query layer
// directly. Published posts only; drafts stay behind the admin API.
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 9);
  const category = searchParams.get("category") || null;
  const search = searchParams.get("search") || null;
  const authorSlug = searchParams.get("author") || null;

  try {
    if (authorSlug) {
      const author = await getAuthorBySlug(authorSlug);
      if (!author) {
        return NextResponse.json(
          { blogs: [], total: 0, page, totalPages: 1 },
          { status: 200 },
        );
      }
      const result = await getBlogsByAuthor(author.id, { page, limit });
      return NextResponse.json(result);
    }

    const result = await getAllBlogs({ page, limit, category, search });
    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof DataUnavailableError
        ? error.message
        : "Could not load blogs";
    console.error("[api/blog]", error);
    return NextResponse.json({ error: message }, { status: 503 });
  }
}
