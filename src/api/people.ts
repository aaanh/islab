import { client } from "@/sanity/lib/client";
import { cache } from "react";

export interface PeopleType {
  name: string;
  slug: {
    current: string;
  };
  bio: string;
  author_category: {
    title: string;
    slug: {
      current: string;
    };
  }[];
  affiliation: string;
  extern_links: {
    site: string;
    url: string;
  }[];
  image: string;
}

export interface PeopleCategoryType {
  title: string;
  slug: {
    current: string;
  };
}

export async function getPeople(): Promise<PeopleType[]> {
  return cache(async () => {
    const res = await client.fetch(`*[_type == "author"] {
        name,
        slug,
        bio,
        "author_category": author_category[]->{
          title,
          slug
        },
        affiliation,
        extern_links,
        "image": image.asset->url
      }`);

    const people: PeopleType[] = res.map((person: PeopleType): PeopleType => {
      return {
        name: person.name,
        slug: person.slug,
        bio: person.bio,
        author_category: person.author_category,
        affiliation: person.affiliation,
        extern_links: person.extern_links,
        image: person.image,
      };
    });

    return people;
  })();
}

export async function getPeopleCategories(): Promise<PeopleCategoryType[]> {
  return (async () => {
    const categories: PeopleCategoryType[] =
      await client.fetch(`*[_type == "author_category"] {
      title,
      slug
    }`);

    return categories;
  })();
}
