import { getPostsByCategoryAction } from "../actions";
import { getCategoriesAction } from "../../actions";
import { Category } from "@/sanity.types";
import PostRender from "../components/post";
import { getPostBySlug } from "@/api/posts";

export default async function Page({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const slug = (await params).slug;

  if (slug) {
    let post = null;
    switch (slug.length) {
      case 1:
        post = await getPostBySlug(slug[0]);
        return <PostRender post={post[0]} />;
      case 2:
        post = await getPostBySlug(slug[1]);
        return <PostRender post={post[0]} />;

      default:
        return null;
    }
  }
}
