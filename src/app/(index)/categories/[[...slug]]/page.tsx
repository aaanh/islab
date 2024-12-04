import { getPostBySlug } from "@/api/posts";
import { redirect } from "next/navigation";
import PostWithLanguage from "../components/post-with-language";
import { Post } from "@/sanity.types";

export default async function Page({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const slug = (await params).slug;

  if (!slug) {
    redirect("/");
  }

  // Traverse through all slugs in the path
  let currentPost: Post | null = null;
  for (const pathSegment of slug) {
    currentPost = await getPostBySlug(pathSegment);
    if (!currentPost) {
      redirect("/"); // or to a 404 page
    }
  }

  return <PostWithLanguage post={currentPost!} />;
}
