import { getPosts } from "@/api/posts";

export async function getPostsAction() {
  return getPosts();
}
