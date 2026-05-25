import { getPayload } from "@/lib/payload";
import type { PeopleCategoryView, PeopleView } from "@/types/cms";
import { cache } from "react";

export async function getPeople(): Promise<PeopleView[]> {
  return cache(async () => {
    const payload = await getPayload();
    const result = await payload.find({
      collection: "authors",
      depth: 2,
      pagination: false,
    });

    return result.docs.map((person) => ({
      name: person.name,
      slug: person.slug,
      bio: person.bio ?? null,
      authorCategories:
        person.authorCategories?.flatMap((category) =>
          category && typeof category === "object"
            ? [{ title: category.title, slug: category.slug }]
            : []
        ) ?? [],
      affiliation: person.affiliation,
      externLinks: person.externLinks ?? [],
      image:
        person.image && typeof person.image === "object"
          ? person.image.url ?? null
          : null,
    }));
  })();
}

export async function getPeopleCategories(): Promise<PeopleCategoryView[]> {
  return cache(async () => {
    const payload = await getPayload();
    const result = await payload.find({
      collection: "author-categories",
      pagination: false,
    });

    return result.docs.map((category) => ({
      title: category.title,
      slug: category.slug,
    }));
  })();
}
