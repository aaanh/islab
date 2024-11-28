"use client";

import { Post } from "@/sanity.types";
import { LanguageProvider } from "./language-switcher";
import PostRender from "./post";

export default function PostWithLanguage({ post }: { post: Post }) {
  return (
    <LanguageProvider>
      <PostRender post={post} />
    </LanguageProvider>
  );
}
