import type { CollectionConfig } from "payload";

export const Posts: CollectionConfig = {
  slug: "posts",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "slug", "publishedAt"],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
    },
    {
      name: "author",
      type: "relationship",
      relationTo: "authors",
    },
    {
      name: "mainImage",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "categories",
      type: "relationship",
      relationTo: "categories",
      hasMany: true,
    },
    {
      name: "publishedAt",
      type: "date",
    },
    {
      name: "bodyEnglish",
      type: "richText",
    },
    {
      name: "bodyFrancais",
      type: "richText",
    },
    {
      name: "subposts",
      type: "relationship",
      relationTo: "posts",
      hasMany: true,
    },
  ],
};
