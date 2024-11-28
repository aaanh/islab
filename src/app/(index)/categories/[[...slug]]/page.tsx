import { getCategoriesAction } from "../../actions";
import { Category } from "@/sanity.types";
import PostRender from "../components/post";
import { getPostBySlug } from "@/api/posts";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LanguageProvider } from "../components/language-switcher";
import PostWithLanguage from "../components/post-with-language";

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
        if (slug[0] === "introduction") redirect("/");
        post = await getPostBySlug(slug[0]);
        return <PostWithLanguage post={post} />;
      case 2:
        post = await getPostBySlug(slug[1]);
        return <PostWithLanguage post={post} />;
      default:
        const categories = await getCategoriesAction();

        return (
          <div className="mt-4 p-4 prose">
            <h1>Categories</h1>
            <ul>
              {categories.map((category: Category, idx: number) => (
                <li key={category._id + "-" + idx}>
                  <Link href={`/categories/${category.slug?.current}`}>
                    {category.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        );
    }
  } else {
    redirect("/");
  }
}
