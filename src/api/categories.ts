import { Category } from "@/sanity.types";
import { client } from "@/sanity/lib/client";
import { cache } from "react";

export async function getCategories(): Promise<Category[]> {
  return cache(async () => {
    const res = await client.fetch(`*[_type == "category"]`);

    const categories: Category[] = res.map((category: Category) => category);

    // Order by field sidebar_order
    categories.sort((a, b) => (a.sidebar_order ?? 0) - (b.sidebar_order ?? 0));

    return categories;
  })();
}

export async function getHighestCategoryOrder(): Promise<number> {
  return cache(async () => {
    const res = await client.fetch(
      `*[_type == "category" && defined(sidebar_order)] | order(sidebar_order desc)[0].sidebar_order`
    );

    return res || 0;
  })();
}
