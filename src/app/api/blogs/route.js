import { NextResponse } from "next/server";
import { getAllBlogs } from "@/lib/blog/queries";

/**
 * GET /api/blogs — public, read-only listing behind the blog index.
 *
 * Backs the search box and the Load More button. Separate from
 * /api/admin/blog: that one requires an admin session and exposes drafts,
 * while this only ever returns published posts through the anon key and RLS.
 */

// Published content changes rarely; the same five minutes the pages use.
export const revalidate = 300;

const MAX_LIMIT = 24;

export async function GET(req) {
  const params = req.nextUrl.searchParams;
  const page = Math.max(1, Number(params.get("page")) || 1);
  const limit = Math.min(MAX_LIMIT, Math.max(1, Number(params.get("limit")) || 9));
  const category = params.get("category");
  const search = params.get("search")?.trim() || null;

  try {
    const result = await getAllBlogs({ page, limit, category, search });
    return NextResponse.json(result);
  } catch (error) {
    console.error("[api/blogs] listing failed:", error);
    return NextResponse.json(
      { error: "Could not load stories right now" },
      { status: 503 },
    );
  }
}
