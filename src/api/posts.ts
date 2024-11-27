import { client } from "@/sanity/lib/client";

export async function getPosts() {
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
}

export async function getPostBySlug(slug: string) {
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
}

export async function getPostsByCategory(slug: string) {
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
}
