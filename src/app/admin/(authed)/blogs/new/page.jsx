import { createAdminClient } from "@/lib/supabase/admin";
import { BlogEditor } from "@/components/admin/blog/BlogEditor";

export const metadata = { title: "New Post — Madhuban Admin" };
export const dynamic = "force-dynamic";

export default async function NewBlogPage() {
  const supabase = createAdminClient();
  const [{ data: categories }, { data: authors }] = await Promise.all([
    supabase
      .from("blog_categories")
      .select("id, name")
      .eq("is_active", true)
      .order("display_order", { ascending: true }),
    supabase
      .from("blog_authors")
      .select("id, name")
      .eq("is_active", true)
      .order("name"),
  ]);

  return (
    <BlogEditor
      mode="new"
      initial={null}
      categories={categories ?? []}
      authors={authors ?? []}
    />
  );
}
