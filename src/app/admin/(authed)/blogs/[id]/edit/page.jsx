import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { BlogEditor } from "@/components/admin/blog/BlogEditor";

export const metadata = { title: "Edit Post — Madhuban Admin" };
export const dynamic = "force-dynamic";

export default async function EditBlogPage({ params }) {
  const { id } = await params;
  const supabase = createAdminClient();

  const [{ data: blog }, { data: categories }, { data: authors }] = await Promise.all([
    supabase.from("blogs").select("*").eq("id", id).maybeSingle(),
    supabase
      .from("blog_categories")
      .select("id, name")
      .order("display_order", { ascending: true }),
    supabase.from("blog_authors").select("id, name").order("name"),
  ]);

  if (!blog) notFound();

  return (
    <BlogEditor
      mode="edit"
      // Only the fields the form owns. Passing the whole row would send
      // created_at and the generated search_vector back on every save.
      initial={{
        id: blog.id,
        title: blog.title ?? "",
        slug: blog.slug ?? "",
        status: blog.status ?? "draft",
        content: blog.content ?? "",
        excerpt: blog.excerpt ?? "",
        featured_image_url: blog.featured_image_url,
        featured_image_r2_key: blog.featured_image_r2_key,
        featured_image_alt: blog.featured_image_alt ?? "",
        category_id: blog.category_id ?? "",
        author_id: blog.author_id ?? "",
        meta_title: blog.meta_title ?? "",
        meta_description: blog.meta_description ?? "",
        focus_keyword: blog.focus_keyword ?? "",
        canonical_url: blog.canonical_url ?? "",
        tags: blog.tags ?? [],
        faq: blog.faq ?? [],
        views: blog.views ?? 0,
      }}
      categories={categories ?? []}
      authors={authors ?? []}
    />
  );
}
