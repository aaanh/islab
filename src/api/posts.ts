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

  console.log(posts);
  return posts;
}
