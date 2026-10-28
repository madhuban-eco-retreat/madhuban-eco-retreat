import "server-only";
import { revalidatePath } from "next/cache";

/**
 * Tell the public site that blog content changed.
 *
 * Single posts (/blogs/[slug]) are cached for an hour, so without this a saved
 * edit (new images, text, status) only shows up on the website up to an hour
 * later. Rooms already do the same after saving. Refreshing every post page is
 * cheap and covers bulk actions, renamed slugs and deletes in one call.
 * Never fatal: a cache hiccup must not make a successful save look failed.
 */
export function revalidateBlogs(...slugs) {
  try {
    revalidatePath("/blogs");
    revalidatePath("/blogs/[slug]", "page");
    for (const slug of slugs.flat().filter(Boolean)) revalidatePath(`/blogs/${slug}`);
  } catch (error) {
    console.error("[blog-admin] revalidate failed:", error);
  }
}
