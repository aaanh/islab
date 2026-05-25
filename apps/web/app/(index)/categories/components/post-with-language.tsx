"use client";

import type { PostView } from "@/types/cms";
import { LanguageProvider } from "./language-switcher";
import PostRender from "./post";

export default function PostWithLanguage({ post }: { post: PostView }) {
  return (
    <LanguageProvider>
      <PostRender post={post} />
    </LanguageProvider>
  );
}
