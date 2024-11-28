"use client";

import PortableTextRender, {
  ImageComponent,
} from "@/components/portable-text-render";
import { type Post } from "@/sanity.types";
import Link from "next/link";
import { Fragment } from "react";
import { LanguageSwitcher, useLanguage } from "./language-switcher";

export default function PostRender({ post }: { post: Post }) {
  const language = useLanguage();

  if (!post) {
    return (
      <div className="mt-2 px-4">
        <h1 className="font-bold text-4xl underline underline-offset-4 capitalize decoration-1">
          Post not found
        </h1>
      </div>
    );
  }

  return (
    <div className="mt-2 px-4 portable-text">
      <h1 className="capitalize">{post.title}</h1>
      <main>
        <LanguageSwitcher />
        {language.state === "en" ? (
          <Fragment>
            <h2>English version</h2>
            <PortableTextRender blocks={post.body_english} />
          </Fragment>
        ) : post.body_francais ? (
          <Fragment>
            <h2>Version français</h2>
            <PortableTextRender blocks={post.body_francais} />
          </Fragment>
        ) : (
          <p>{`Version français n'est pas disponsible.`}</p>
        )}
        <h2>Related contents</h2>
        <div className="gap-4 grid grid-cols-1 lg:grid-cols-3 mb-8">
          {post.subposts ? (
            post.subposts?.map((subpost: any, idx: number) => (
              <div
                className="flex flex-col gap-4 border-primary p-2 border rounded-lg text-xl"
                key={subpost.title + "-" + idx}
              >
                <Link
                  className="bg-primary p-2 rounded-lg text-background hover:text-background/90"
                  href={`/categories/${post.slug?.current}/${subpost.slug.current}`}
                >
                  {subpost.title}
                </Link>
                {subpost.mainImage && (
                  <div className="bg-primary/30 p-2 rounded-md">
                    <ImageComponent
                      value={subpost.mainImage}
                      isInline={false}
                    />
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>There are no related contents</p>
          )}
        </div>
      </main>
    </div>
  );
}
