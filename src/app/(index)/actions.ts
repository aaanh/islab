import { getCategories } from "@/api/categories";
import { getPosts } from "@/api/posts";

export async function getPostsAction() {
  return getPosts();
}

export async function getCategoriesAction() {
  return getCategories();
}
