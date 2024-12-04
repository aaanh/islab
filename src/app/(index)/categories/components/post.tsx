"use client";

import PortableTextRender, {
  ImageComponent,
} from "@/components/portable-text-render";
import { type Post } from "@/sanity.types";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import { LanguageSwitcher, useLanguage } from "./language-switcher";
import { Button } from "@/components/ui/button";
import { PrinterIcon, ShareIcon } from "lucide-react";

export default function PostRender({ post }: { post: Post }) {
  const language = useLanguage();
  const [tableOfContents, setTableOfContents] = useState<
    { text: string; id: string }[]
  >([]);

  useEffect(() => {
    const blocks =
      language.state === "en" ? post.body_english : post.body_francais;
    if (!blocks) return;

    const headers = blocks
      .filter((block: any) => block.style === "h1" || block.style === "h2")
      .map((block: any) => ({
        text: block.children[0].text,
        id: block.children[0].text.toLowerCase().replace(/\s+/g, "-"),
      }));

    setTableOfContents(headers);
  }, [language.state, post.body_english, post.body_francais]);

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
        <div className="flex justify-between">
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
              <ShareIcon />
              Share
            </Button>
            <Button
              variant={"secondary"}
              onClick={() => {
                window.print();
              }}
            >
              <PrinterIcon />
              Print
            </Button>
          </div>
        </div>
        {/* Add Table of Contents */}
        {tableOfContents.length > 0 && (
          <nav className="mt-4 px-4 border rounded-lg">
            <h2>
              {language.state === "en"
                ? "Table of Contents"
                : "Table des matières"}
            </h2>
            <ul className="space-y-1">
              {tableOfContents.map((header) => (
                <li key={header.id}>
                  <a
                    href={`#${header.id}`}
                    className="text-primary hover:underline"
                  >
                    {header.text}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
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
        {post.subposts && (
          <>
            <h2>
              {language.state === "en"
                ? "Related contents"
                : "Contenus associés"}
            </h2>
            <div className="gap-4 grid grid-cols-1 lg:grid-cols-3 mb-8">
              {post.subposts?.map((subpost: any, idx: number) => (
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
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
