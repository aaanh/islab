"use client";

import { getPostsByCategoryAction } from "./categories/actions";
import PostRender from "./categories/components/post";
import { LanguageProvider } from "./categories/components/language-switcher";
import { useEffect, useState } from "react";
import { Post } from "@/sanity.types";
import PostWithLanguage from "./categories/components/post-with-language";

export default function Home() {
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    async function fetchPost() {
      const posts = await getPostsByCategoryAction("introduction");
      setPost(posts[0]);
    }
    fetchPost();
  });

  return (
    <div className="px-4 py-2 portable-text">
      <h1 className="bg-primary p-2 rounded-lg font-bold text-background lg:text-center">
        Inertial Sensing Lab
      </h1>
      {post && <PostWithLanguage post={post} />}
    </div>
  );
}
