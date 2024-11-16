import { getPostsByCategory } from "@/api/posts";

export async function getPostsByCategoryAction(slug: string) {
  return getPostsByCategory(slug);
}
