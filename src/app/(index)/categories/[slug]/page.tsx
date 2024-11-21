import PortableTextRender from "@/components/portable-text-render";
import { getPostsByCategoryAction } from "../actions";
import { Fragment } from "react";

interface PostType {
  slug: string;
  body_english?: any;
  body_francais?: any;
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const post = (await getPostsByCategoryAction(slug))[0];
  let subposts = [];
  if (post.subposts) {
    subposts = post.subposts;
    console.log(subposts);
  }

  if (!post) {
    return (
      <div className="mt-8 p-4">
        <h1 className="font-bold text-4xl underline underline-offset-4 capitalize decoration-1">
          {slug}
        </h1>
        <br />
        <main>
          <h1>No content is found</h1>
        </main>
      </div>
    );
  }

  return (
    <div className="mt-8 p-4">
      <h1 className="font-bold text-4xl underline underline-offset-4 capitalize decoration-1">
        {slug}
      </h1>
      <br />
      <main>
        Subposts: {JSON.stringify(subposts)}
        <Fragment key={post.slug}>
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
