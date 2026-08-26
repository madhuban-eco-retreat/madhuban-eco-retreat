import { createAdminClient } from "@/lib/supabase/admin";
import { AuthorsClient } from "./authors-client";

export const metadata = { title: "Blog Authors — Madhuban Admin" };
export const dynamic = "force-dynamic";

export default async function BlogAuthorsPage() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("blog_authors")
    .select("*")
    .order("is_active", { ascending: false })
    .order("name", { ascending: true });

  return <AuthorsClient initial={data ?? []} />;
}
