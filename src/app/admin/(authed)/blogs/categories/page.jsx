import { createAdminClient } from "@/lib/supabase/admin";
import { CategoriesClient } from "./categories-client";

export const metadata = { title: "Blog Categories — Madhuban Admin" };
export const dynamic = "force-dynamic";

export default async function BlogCategoriesPage() {
  const supabase = createAdminClient();

  const [{ data: categories }, { data: posts }] = await Promise.all([
    supabase
      .from("blog_categories")
      .select("*")
      .order("display_order", { ascending: true }),
    supabase.from("blogs").select("category_id"),
  ]);

  // Post counts gate the delete button, so they ship with the first render
  // rather than arriving after a second request.
  const counts = new Map();
  for (const post of posts ?? []) {
    if (!post.category_id) continue;
    counts.set(post.category_id, (counts.get(post.category_id) ?? 0) + 1);
  }

  return (
    <CategoriesClient
      initial={(categories ?? []).map((c) => ({
        ...c,
        blog_count: counts.get(c.id) ?? 0,
      }))}
    />
  );
}
