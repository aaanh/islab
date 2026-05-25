"use client";

import RichTextRender from "@/components/rich-text-render";
import { PostRelatedContents } from "./post-related-contents";
import { PostTableOfContents } from "./post-table-of-contents";
import { extractHeadings } from "@/lib/rich-text";
import type { PostView } from "@/types/cms";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import { LanguageSwitcher, useLanguage } from "./language-switcher";
import { Button } from "@/components/ui/button";
import { IconPrinter, IconShare } from "@tabler/icons-react";

export default function PostRender({ post }: { post: PostView }) {
  const language = useLanguage();
  const [tableOfContents, setTableOfContents] = useState<
    { text: string; id: string }[]
  >([]);

  useEffect(() => {
    const blocks =
      language.state === "en" ? post.bodyEnglish : post.bodyFrancais;
    setTableOfContents(extractHeadings(blocks));
  }, [language.state, post.bodyEnglish, post.bodyFrancais]);

  if (!post) {
    return (
      <div>
        <h1 className="font-bold text-4xl underline underline-offset-4 capitalize decoration-1">
          Post not found
        </h1>
      </div>
    );
  }

  return (
    <div className="portable-text">
      <h1>{post.title}</h1>
      <main>
        <div className="not-prose flex justify-between">
          <LanguageSwitcher />
          <div className="gap-2 grid grid-cols-2">
            <Button
              variant={"secondary"}
              onClick={() => {
                const txt = window.location.href;
                navigator.clipboard.writeText(txt);
                window.alert(`Copied ${txt}`);
              }}
            >
              <IconShare />
              Share
            </Button>
            <Button
              variant={"secondary"}
              onClick={() => {
                window.print();
              }}
            >
              <IconPrinter />
              Print
            </Button>
          </div>
        </div>
        <PostTableOfContents
          title={
            language.state === "en"
              ? "Table of Contents"
              : "Table des matières"
          }
          items={tableOfContents}
        />
        {language.state === "en" ? (
          <Fragment>
            <h2>English version</h2>
            <RichTextRender data={post.bodyEnglish} />
          </Fragment>
        ) : post.bodyFrancais ? (
          <Fragment>
            <h2>Version français</h2>
            <RichTextRender data={post.bodyFrancais} />
          </Fragment>
        ) : (
          <p>{`Version français n'est pas disponsible.`}</p>
        )}
        <PostRelatedContents
          title={
            language.state === "en"
              ? "Related contents"
              : "Contenus associés"
          }
          postSlug={post.slug}
          subposts={post.subposts ?? []}
        />
      </main>
    </div>
  );
}
