import { Post } from "@/sanity.types";
import { client } from "@/sanity/lib/client";
import { cache } from "react";

export async function getPosts(): Promise<Post[]> {
  return cache(async () => {
    const posts = await client.fetch(`*[_type == "post"] {
      title,
      slug,
      body,
      "author": author->{
        name, 
        bio
      },
      "categories": categories[]->{
        title
      },
      "subposts": subposts[]->{
        title,
        slug
      }
    }`);

    return posts;
  })();
}

export async function getPostBySlug(slug: string): Promise<Post> {
  return cache(async () => {
    const post =
      await client.fetch(`*[_type == "post" && slug.current == "${slug}"] {
        title,
        slug,
        mainImage,
        body_english,
        body_francais,
        "author": author->{
          name, 
          bio
        },
        "categories": categories[]->{
          title
        },
        "subposts": subposts[]->{
          title,
          slug,
          mainImage
        }
      }`);

    return post[0];
  })();
}

export async function getPostsByCategory(slug: string): Promise<Post[]> {
  return cache(async () => {
    const posts = await client.fetch(
      `*[_type == "post" && "${slug}" in categories[]->slug.current] {
        title,
        slug,
        mainImage,
        body_english,
        body_francais,
        "author": author->{
          name, 
          bio
        },
        "categories": categories[]->{
          title
        },
        "subposts": subposts[]->{
          title,
          slug,
          mainImage
        }
      }`
    );

    return posts;
  })();
}
