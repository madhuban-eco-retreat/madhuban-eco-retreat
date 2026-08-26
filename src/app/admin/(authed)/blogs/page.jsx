import { createAdminClient } from "@/lib/supabase/admin";
import { BlogsListClient } from "./blogs-list-client";

export const metadata = { title: "Blog Posts — Madhuban Admin" };

// Draft and view counts change as the team works; a cached list would show
// stale status pills.
export const dynamic = "force-dynamic";

export default async function AdminBlogsPage() {
  const supabase = createAdminClient();

  // Filter options only. The list itself is fetched client-side so status,
  // search, sort and pagination can change without a full navigation.
  const [{ data: categories }, { data: authors }] = await Promise.all([
    supabase
      .from("blog_categories")
      .select("id, name")
      .order("display_order", { ascending: true }),
    supabase.from("blog_authors").select("id, name").order("name"),
  ]);

  return (
    <BlogsListClient categories={categories ?? []} authors={authors ?? []} />
  );
}
