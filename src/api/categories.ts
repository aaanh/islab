import { client } from "@/sanity/lib/client";

interface Category {
  sidebar_order: number;
  title: string;
  slug: string;
}

interface SanityCategory {
  sidebar_order: number;
  title: string;
  slug: {
    current: string;
  };
}

export async function getCategories() {
  const res = await client.fetch(`*[_type == "category"]`);

  const categories: Category[] = res.map(
    (category: SanityCategory): Category => {
      return {
        sidebar_order: category.sidebar_order,
        title: category.title,
        slug: category.slug.current,
      };
    }
  );

  // Order by field sidebar_order
  categories.sort((a, b) => a.sidebar_order - b.sidebar_order);

  return categories;
}

export async function getHighestCategoryOrder() {
  const res = await client.fetch(
    `*[_type == "category" && defined(sidebar_order)] | order(sidebar_order desc)[0].sidebar_order`
  );

  return res || 0;
}
