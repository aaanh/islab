import { getPayload } from "@/lib/payload";
import type { Media, Post } from "@/payload-types";
import type { PostSummary, PostView } from "@/types/cms";
import { cache } from "react";

function mapPost(doc: Post, depth = 1): PostView {
  const author =
    doc.author && typeof doc.author === "object"
      ? { name: doc.author.name, bio: doc.author.bio }
      : null;

  const categories =
    doc.categories?.flatMap((category) =>
      category && typeof category === "object"
        ? [{ title: category.title, slug: category.slug }]
        : []
    ) ?? [];

  const subposts: PostSummary[] =
    doc.subposts?.flatMap((subpost) =>
      subpost && typeof subpost === "object"
        ? [
            {
              title: subpost.title,
              slug: subpost.slug,
              mainImage:
                depth > 0 && subpost.mainImage && typeof subpost.mainImage === "object"
                  ? (subpost.mainImage as Media)
                  : null,
            },
          ]
        : []
    ) ?? [];

  return {
    id: doc.id,
    title: doc.title,
    slug: doc.slug,
    mainImage:
      doc.mainImage && typeof doc.mainImage === "object"
        ? (doc.mainImage as Media)
        : null,
    bodyEnglish: doc.bodyEnglish ?? null,
    bodyFrancais: doc.bodyFrancais ?? null,
    author,
    categories,
    subposts,
  };
}

export async function getPosts(): Promise<PostView[]> {
  return cache(async () => {
    const payload = await getPayload();
    const result = await payload.find({
      collection: "posts",
      depth: 2,
      pagination: false,
    });

    return result.docs.map((doc) => mapPost(doc));
  })();
}

export async function getPostBySlug(slug: string): Promise<PostView | null> {
  return cache(async () => {
    const payload = await getPayload();
    const result = await payload.find({
      collection: "posts",
      where: { slug: { equals: slug } },
      depth: 2,
      limit: 1,
    });

    const doc = result.docs[0];
    return doc ? mapPost(doc) : null;
  })();
}

export async function getPostsByCategory(slug: string): Promise<PostView[]> {
  return cache(async () => {
    const payload = await getPayload();
    const categories = await payload.find({
      collection: "categories",
      where: { slug: { equals: slug } },
      limit: 1,
    });

    const category = categories.docs[0];
    if (!category) return [];

    const result = await payload.find({
      collection: "posts",
      where: { categories: { contains: category.id } },
      depth: 2,
      pagination: false,
    });

    return result.docs.map((doc) => mapPost(doc));
  })();
}
