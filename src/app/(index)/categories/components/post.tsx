import PortableTextRender from "@/components/portable-text-render";
import { type Post } from "@/sanity.types";
import Link from "next/link";
import { Fragment } from "react";

export default function PostRender({ post }: { post: Post }) {
  const postSlug = post.slug?.current;

  return (
    <div className="mt-8 p-4">
      <h1 className="font-bold text-4xl underline underline-offset-4 capitalize decoration-1">
        {postSlug}
      </h1>
      <br />
      <main>
        <ul>
          {post.subposts &&
            post.subposts?.map((subpost: any, idx: number) => (
              <li key={subpost.title + "-" + idx}>
                <Link
                  href={`/categories/${post.slug?.current}/${subpost.slug.current}`}
                >
                  {subpost.title}
                </Link>
              </li>
            ))}
        </ul>
        <Fragment>
          {post.body_francais && (
            <h2 className="font-bold text-4xl">English version</h2>
          )}
          <PortableTextRender blocks={post.body_english} />
          <br />
          {post.body_francais && (
            <>
              <h2 className="font-bold text-4xl">Version français</h2>
              <PortableTextRender blocks={post.body_francais} />
            </>
          )}
        </Fragment>
      </main>
    </div>
  );
}
