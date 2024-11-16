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
      }
    }`);

  return posts;
}

export async function getPostsByCategory(slug: string) {
  const posts = await client.fetch(
    `*[_type == "post" && "${slug}" in categories[]->slug.current] {
      title,
      slug,
      body_english,
      body_francais,
      "author": author->{
        name, 
        bio
      },
      "categories": categories[]->{
        title
      }
    }`
  );

  return posts;
}
