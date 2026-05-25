import { getPayload } from "@/lib/payload";
import type { Post } from "@/payload-types";
import type { SidebarNavCategory, SidebarNavPost } from "@/types/cms";
import { cache } from "react";

function mapPost(doc: Post): SidebarNavPost {
  const subposts =
    doc.subposts?.flatMap((subpost) =>
      subpost && typeof subpost === "object"
        ? [{ title: subpost.title, slug: subpost.slug }]
        : []
    ) ?? [];

  return {
    title: doc.title,
    slug: doc.slug,
    subposts,
  };
}

export async function getSidebarNavigation(): Promise<SidebarNavCategory[]> {
  return cache(async () => {
    const payload = await getPayload();

    const [categoriesResult, postsResult] = await Promise.all([
      payload.find({
        collection: "categories",
        sort: "sidebarOrder",
        pagination: false,
      }),
      payload.find({
        collection: "posts",
        sort: "title",
        depth: 2,
        pagination: false,
      }),
    ]);

    const postsByCategoryId = new Map<number, SidebarNavPost[]>();

    for (const doc of postsResult.docs) {
      const entry = mapPost(doc);
      const categoryRefs = doc.categories ?? [];

      for (const category of categoryRefs) {
        if (!category || typeof category !== "object") continue;
        const list = postsByCategoryId.get(category.id) ?? [];
        list.push(entry);
        postsByCategoryId.set(category.id, list);
      }
    }

    return categoriesResult.docs.map((category) => ({
      title: category.title,
      slug: category.slug,
      posts: postsByCategoryId.get(category.id) ?? [],
    }));
  })();
}
