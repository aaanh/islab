import { getPostBySlug } from "@/api/posts";
import { redirect } from "next/navigation";
import PostWithLanguage from "../components/post-with-language";
import type { PostView } from "@/types/cms";

export default async function Page({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const slug = (await params).slug;

  if (!slug) {
    redirect("/");
  }

  let currentPost: PostView | null = null;
  for (const pathSegment of slug) {
    currentPost = await getPostBySlug(pathSegment);
    if (!currentPost) {
      redirect("/");
    }
  }

  return <PostWithLanguage post={currentPost!} />;
}
