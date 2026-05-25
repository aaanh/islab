import { createRequire } from "module";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";
import type { Payload } from "payload";

import { normalizeLexicalCodeFences } from "../lib/lexical-code-fences.js";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const webRoot = path.resolve(scriptDir, "..");
const islabEnv = path.resolve(webRoot, "../../../islab/.env.local");

const require = createRequire(path.join(webRoot, "package.json"));

dotenv.config({ path: islabEnv });
dotenv.config({ path: path.join(webRoot, ".env.local") });
require("@next/env").loadEnvConfig(webRoot);

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = "2023-11-16";

if (!projectId) {
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID in islab/.env.local");
  process.exit(1);
}

if (!process.env.DATABASE_URL || !process.env.PAYLOAD_SECRET) {
  console.error("Missing DATABASE_URL or PAYLOAD_SECRET in apps/web/.env.local");
  process.exit(1);
}

async function sanityFetch<T>(query: string): Promise<T> {
  const url = new URL(
    `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}`
  );
  url.searchParams.set("query", query);
  const response = await fetch(url);
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Sanity query failed: ${response.status}\n${body}`);
  }
  return ((await response.json()) as { result: T }).result;
}

type SanitySlug = { current: string };

type SanitySpan = {
  text?: string;
  marks?: string[];
};

type SanityMarkDef = {
  _key?: string;
  _type?: string;
  href?: string;
};

const IS_BOLD = 1;
const IS_ITALIC = 2;
const IS_CODE = 16;

function textNode(text: string, format = 0) {
  return {
    detail: 0,
    format,
    mode: "normal",
    style: "",
    text,
    type: "text",
    version: 1,
  };
}

function lexicalLinkNode(href: string, children: Record<string, unknown>[]) {
  const isExternal = /^https?:\/\//.test(href);
  return {
    type: "link",
    children,
    direction: "ltr",
    fields: {
      linkType: "custom",
      newTab: isExternal,
      url: href,
    },
    format: "",
    indent: 0,
    version: 2,
  };
}

function spansToInlineNodes(
  spans: SanitySpan[],
  markDefs: SanityMarkDef[]
): Record<string, unknown>[] {
  const markDefMap = Object.fromEntries(
    markDefs.flatMap((markDef) =>
      markDef._key ? [[markDef._key, markDef] as const] : []
    )
  );

  const nodes: Record<string, unknown>[] = [];

  for (const span of spans) {
    const text = span.text ?? "";
    if (!text) continue;

    let format = 0;
    let href: string | undefined;

    for (const mark of span.marks ?? []) {
      if (mark === "strong") format |= IS_BOLD;
      else if (mark === "em") format |= IS_ITALIC;
      else {
        const markDef = markDefMap[mark];
        if (markDef?._type === "link" && markDef.href) href = markDef.href;
      }
    }

    const content = textNode(text, format);
    nodes.push(href ? lexicalLinkNode(href, [content]) : content);
  }

  return nodes;
}

function blockToLexical(block: Record<string, unknown>): Record<string, unknown> | null {
  if (block._type === "image") return null;
  if (block._type !== "block") return null;

  const style = (block.style as string) || "normal";
  const spans = (block.children as SanitySpan[]) || [];
  const markDefs = (block.markDefs as SanityMarkDef[]) || [];
  const inlineChildren = spansToInlineNodes(spans, markDefs);
  if (!inlineChildren.length) return null;

  if (["h1", "h2", "h3", "h4"].includes(style)) {
    return {
      children: inlineChildren,
      direction: "ltr",
      format: "",
      indent: 0,
      tag: style,
      type: "heading",
      version: 1,
    };
  }

  if (style === "blockquote") {
    return {
      children: inlineChildren,
      direction: "ltr",
      format: "",
      indent: 0,
      type: "quote",
      version: 1,
    };
  }

  if (style === "code") {
    const codeChildren = inlineChildren.map((node) => {
      if (node.type === "text") {
        return { ...node, format: ((node.format as number) || 0) | IS_CODE };
      }
      if (node.type === "link" && Array.isArray(node.children)) {
        return {
          ...node,
          children: (node.children as Record<string, unknown>[]).map((child) =>
            child.type === "text"
              ? { ...child, format: ((child.format as number) || 0) | IS_CODE }
              : child
          ),
        };
      }
      return node;
    });

    return {
      children: codeChildren,
      direction: "ltr",
      format: "",
      indent: 0,
      type: "paragraph",
      version: 1,
    };
  }

  if (block.listItem === "bullet") {
    return {
      children: inlineChildren,
      direction: "ltr",
      format: "",
      indent: 0,
      listType: "bullet",
      type: "listitem",
      version: 1,
      value: 1,
    };
  }

  return {
    children: inlineChildren,
    direction: "ltr",
    format: "",
    indent: 0,
    type: "paragraph",
    version: 1,
  };
}

function portableTextToLexical(
  blocks: Record<string, unknown>[] | undefined
): SerializedEditorState | undefined {
  if (!blocks?.length) return undefined;
  const children = blocks
    .map(blockToLexical)
    .filter((n): n is Record<string, unknown> => n !== null);
  if (!children.length) return undefined;
  const state = {
    root: {
      children,
      direction: "ltr",
      format: "",
      indent: 0,
      type: "root",
      version: 1,
    },
  } as SerializedEditorState;

  return normalizeLexicalCodeFences(state) as SerializedEditorState;
}

async function resolveSanityImageUrl(ref: string) {
  const safeRef = ref.replace(/[^a-zA-Z0-9-]/g, "");
  const result = await sanityFetch<{ url: string } | null>(
    `*[_id == "${safeRef}"][0]{ "url": url }`
  );
  return result?.url ?? null;
}

async function uploadImageFromUrl(payload: Payload, url: string, alt?: string) {
  const response = await fetch(url);
  if (!response.ok) return null;
  const buffer = Buffer.from(await response.arrayBuffer());
  return payload.create({
    collection: "media",
    data: { alt },
    file: {
      data: buffer,
      mimetype: response.headers.get("content-type") || "image/jpeg",
      name: url.split("/").pop()?.split("?")[0] || "image.jpg",
      size: buffer.length,
    },
  });
}

async function clearCollection(
  payload: Payload,
  slug: "posts" | "authors" | "categories" | "author-categories" | "media"
) {
  const { docs } = await payload.find({ collection: slug, limit: 500, pagination: false });
  for (const doc of docs) {
    await payload.delete({ collection: slug, id: doc.id });
  }
  console.log(`  cleared ${docs.length} ${slug}`);
}

async function updateRichTextBodies(payload: Payload) {
  const posts = await sanityFetch<
    {
      slug: SanitySlug;
      body_english?: Record<string, unknown>[];
      body_francais?: Record<string, unknown>[];
    }[]
  >(`*[_type == "post"]{ slug, body_english, body_francais }`);

  let updated = 0;
  for (const [i, post] of posts.entries()) {
    process.stdout.write(`  body ${i + 1}/${posts.length} ${post.slug.current}\r`);
    const existing = await payload.find({
      collection: "posts",
      where: { slug: { equals: post.slug.current } },
      limit: 1,
    });
    const doc = existing.docs[0];
    if (!doc) continue;

    await payload.update({
      collection: "posts",
      id: doc.id,
      data: {
        bodyEnglish: portableTextToLexical(post.body_english) ?? undefined,
        bodyFrancais: portableTextToLexical(post.body_francais) ?? undefined,
      },
    });
    updated += 1;
  }

  const authors = await sanityFetch<
    {
      slug: SanitySlug;
      bio?: Record<string, unknown>[];
    }[]
  >(`*[_type == "author"]{ slug, bio }`);

  for (const [i, author] of authors.entries()) {
    process.stdout.write(`  bio ${i + 1}/${authors.length} ${author.slug.current}\r`);
    const existing = await payload.find({
      collection: "authors",
      where: { slug: { equals: author.slug.current } },
      limit: 1,
    });
    const doc = existing.docs[0];
    if (!doc) continue;

    await payload.update({
      collection: "authors",
      id: doc.id,
      data: {
        bio: portableTextToLexical(author.bio) ?? undefined,
      },
    });
  }

  console.log(`\nUpdated rich text for ${updated} posts and ${authors.length} authors.`);
}

async function main() {
  console.log(`Sanity ${projectId}/${dataset} → Neon Payload`);

  const configUrl = pathToFileURL(path.join(webRoot, "payload.config.ts")).href;
  const { default: config } = await import(configUrl);
  const { getPayload } = await import("payload");
  const payload = await getPayload({ config });

  if (process.argv.includes("--bodies-only")) {
    await updateRichTextBodies(payload);
    return;
  }

  console.log("Clearing collections...");
  await clearCollection(payload, "posts");
  await clearCollection(payload, "authors");
  await clearCollection(payload, "categories");
  await clearCollection(payload, "author-categories");
  await clearCollection(payload, "media");

  const categoryIdBySlug = new Map<string, number>();
  const authorCategoryIdBySlug = new Map<string, number>();
  const authorIdBySlug = new Map<string, number>();
  const postIdBySlug = new Map<string, number>();
  const mediaIdBySanityRef = new Map<string, number>();

  const categories = await sanityFetch<
    {
      title: string;
      slug: SanitySlug;
      description?: string;
      sidebar_order?: number;
    }[]
  >(`*[_type == "category"]{ title, slug, description, sidebar_order }`);

  for (const c of categories) {
    const doc = await payload.create({
      collection: "categories",
      data: {
        title: c.title,
        slug: c.slug.current,
        description: c.description,
        sidebarOrder: c.sidebar_order ?? 0,
      },
    });
    categoryIdBySlug.set(c.slug.current, doc.id);
  }
  console.log(`Categories: ${categories.length}`);

  const authorCategories = await sanityFetch<{ title: string; slug: SanitySlug }[]>(
    `*[_type == "author_category"]{ title, slug }`
  );
  for (const c of authorCategories) {
    const doc = await payload.create({
      collection: "author-categories",
      data: { title: c.title, slug: c.slug.current },
    });
    authorCategoryIdBySlug.set(c.slug.current, doc.id);
  }
  console.log(`Author categories: ${authorCategories.length}`);

  const authors = await sanityFetch<
    {
      name: string;
      slug: SanitySlug;
      affiliation?: string;
      extern_links?: { site: string; url: string }[];
      bio?: Record<string, unknown>[];
      author_category?: { slug: SanitySlug }[];
      image?: { asset?: { _ref: string } };
    }[]
  >(`*[_type == "author"]{
    name, slug, affiliation, extern_links, bio,
    "author_category": author_category[]->{ slug },
    image
  }`);

  for (const [i, author] of authors.entries()) {
    process.stdout.write(`  author ${i + 1}/${authors.length} ${author.slug.current}\r`);
    let imageId: number | undefined;
    const ref = author.image?.asset?._ref;
    if (ref) {
      if (!mediaIdBySanityRef.has(ref)) {
        const url = await resolveSanityImageUrl(ref);
        if (url) {
          const media = await uploadImageFromUrl(payload, url, author.name);
          if (media) mediaIdBySanityRef.set(ref, media.id);
        }
      }
      imageId = mediaIdBySanityRef.get(ref);
    }

    const cats = author.author_category
      ?.map((c) => authorCategoryIdBySlug.get(c.slug.current))
      .filter((id): id is number => id !== undefined);

    const doc = await payload.create({
      collection: "authors",
      data: {
        name: author.name,
        slug: author.slug.current,
        affiliation: author.affiliation ?? undefined,
        externLinks: author.extern_links?.length ? author.extern_links : undefined,
        bio: portableTextToLexical(author.bio) ?? undefined,
        authorCategories: cats?.length ? cats : undefined,
        image: imageId,
      },
    });
    authorIdBySlug.set(author.slug.current, doc.id);
  }
  console.log(`\nAuthors: ${authors.length}`);

  const posts = await sanityFetch<
    {
      title: string;
      slug: SanitySlug;
      publishedAt?: string;
      body_english?: Record<string, unknown>[];
      body_francais?: Record<string, unknown>[];
      author?: { slug: SanitySlug };
      categories?: { slug: SanitySlug }[];
      subposts?: { slug: SanitySlug }[];
      mainImage?: { asset?: { _ref: string }; alt?: string };
    }[]
  >(`*[_type == "post"]{
    title, slug, publishedAt, body_english, body_francais,
    "author": author->{ slug },
    "categories": categories[]->{ slug },
    "subposts": subposts[]->{ slug },
    mainImage
  }`);

  for (const [i, post] of posts.entries()) {
    process.stdout.write(`  post ${i + 1}/${posts.length} ${post.slug.current}\r`);
    let mainImageId: number | undefined;
    const ref = post.mainImage?.asset?._ref;
    if (ref) {
      if (!mediaIdBySanityRef.has(ref)) {
        const url = await resolveSanityImageUrl(ref);
        if (url) {
          const media = await uploadImageFromUrl(payload, url, post.mainImage?.alt);
          if (media) mediaIdBySanityRef.set(ref, media.id);
        }
      }
      mainImageId = mediaIdBySanityRef.get(ref);
    }

    const cats = post.categories
      ?.map((c) => categoryIdBySlug.get(c.slug.current))
      .filter((id): id is number => id !== undefined);

    const doc = await payload.create({
      collection: "posts",
      data: {
        title: post.title,
        slug: post.slug.current,
        publishedAt: post.publishedAt ?? undefined,
        bodyEnglish: portableTextToLexical(post.body_english) ?? undefined,
        bodyFrancais: portableTextToLexical(post.body_francais) ?? undefined,
        author: post.author ? authorIdBySlug.get(post.author.slug.current) : undefined,
        categories: cats?.length ? cats : undefined,
        mainImage: mainImageId,
      },
    });
    postIdBySlug.set(post.slug.current, doc.id);
  }
  console.log(`\nPosts: ${posts.length}`);

  for (const post of posts) {
    if (!post.subposts?.length) continue;
    await payload.update({
      collection: "posts",
      id: postIdBySlug.get(post.slug.current)!,
      data: {
        subposts: post.subposts
          .map((s) => postIdBySlug.get(s.slug.current))
          .filter((id): id is number => id !== undefined),
      },
    });
  }

  console.log("Migration complete.", {
    categories: categoryIdBySlug.size,
    authorCategories: authorCategoryIdBySlug.size,
    authors: authorIdBySlug.size,
    posts: postIdBySlug.size,
    media: mediaIdBySanityRef.size,
  });
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
