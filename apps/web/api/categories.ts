import { getPayload } from "@/lib/payload";
import type { CategoryView } from "@/types/cms";
import { cache } from "react";

export async function getCategories(): Promise<CategoryView[]> {
  return cache(async () => {
    const payload = await getPayload();
    const result = await payload.find({
      collection: "categories",
      sort: "sidebarOrder",
      pagination: false,
    });

    return result.docs.map((category) => ({
      id: category.id,
      title: category.title,
      slug: category.slug,
      description: category.description,
      sidebarOrder: category.sidebarOrder,
    }));
  })();
}

export async function getHighestCategoryOrder(): Promise<number> {
  return cache(async () => {
    const payload = await getPayload();
    const result = await payload.find({
      collection: "categories",
      sort: "-sidebarOrder",
      limit: 1,
    });

    return result.docs[0]?.sidebarOrder ?? 0;
  })();
}
