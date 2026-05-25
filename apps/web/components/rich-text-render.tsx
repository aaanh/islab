"use client";

import { CodeBlock } from "@/components/code-block";
import {
  normalizeLexicalCodeFences,
  type LexicalParagraphNode,
} from "@/lib/lexical-code-fences";
import {
  codeParagraphText,
  highlightProseCodeBlocks,
  isCodeParagraph,
} from "@/lib/syntax-highlight";
import {
  RichText,
  type JSXConvertersFunction,
} from "@payloadcms/richtext-lexical/react";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";
import Image from "next/image";
import { useEffect } from "react";

const jsxConverters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  paragraph: ({ node, nodesToJSX }) => {
    const children = node.children ?? [];

    if (isCodeParagraph(children)) {
      const code = codeParagraphText(children);
      const language = (node as LexicalParagraphNode).codeLanguage;
      return (
        <CodeBlock
          key={`code-${code.slice(0, 24)}`}
          code={code}
          language={language}
        />
      );
    }

    const content = nodesToJSX({ nodes: children });
    if (!content?.length) {
      return (
        <p>
          <br />
        </p>
      );
    }

    return <p>{content}</p>;
  },
  heading: ({ node, nodesToJSX }) => {
    const Tag = (node.tag || "h2") as "h1" | "h2" | "h3" | "h4";
    const text = nodesToJSX({ nodes: node.children }).join("");
    const id = typeof text === "string" ? text.toLowerCase().replace(/\s+/g, "-") : undefined;

    if (Tag === "h1" || Tag === "h2") {
      return (
        <Tag id={id} key={id}>
          {nodesToJSX({ nodes: node.children })}
        </Tag>
      );
    }

    return <Tag key={id}>{nodesToJSX({ nodes: node.children })}</Tag>;
  },
  upload: ({ node }) => {
    const value = node.value;
    if (!value || typeof value !== "object" || !("url" in value)) return null;

    const url = value.url as string;
    const alt = (value.alt as string) || " ";
    const width = (value.width as number) || 800;
    const height = (value.height as number) || 600;

    return (
      <Image
        src={url}
        alt={alt}
        width={width}
        height={height}
        className="block max-w-full h-auto"
        style={{ aspectRatio: width / height }}
      />
    );
  },
});

export function CmsImage({
  media,
  className,
}: {
  media?: { url?: string | null; alt?: string | null; width?: number | null; height?: number | null } | null;
  className?: string;
}) {
  if (!media?.url) return null;

  return (
    <Image
      src={media.url}
      alt={media.alt || " "}
      width={media.width || 800}
      height={media.height || 600}
      className={className}
      style={{
        aspectRatio: (media.width || 800) / (media.height || 600),
      }}
    />
  );
}

export default function RichTextRender({
  data,
}: {
  data?: SerializedEditorState | null;
}) {
  useEffect(() => {
    void highlightProseCodeBlocks(document);
  }, [data]);

  if (!data) return null;

  const normalizedData = normalizeLexicalCodeFences(data);
  if (!normalizedData) return null;

  return (
    <section className="rich-text">
      <RichText data={normalizedData} converters={jsxConverters} />
    </section>
  );
}
