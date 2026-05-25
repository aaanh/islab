import type { CollectionConfig } from "payload";

export const Authors: CollectionConfig = {
  slug: "authors",
  admin: {
    useAsTitle: "name",
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "name",
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
      name: "image",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "authorCategories",
      type: "relationship",
      relationTo: "author-categories",
      hasMany: true,
    },
    {
      name: "affiliation",
      type: "text",
    },
    {
      name: "externLinks",
      type: "array",
      fields: [
        {
          name: "site",
          type: "text",
          required: true,
        },
        {
          name: "url",
          type: "text",
          required: true,
        },
      ],
    },
    {
      name: "bio",
      type: "richText",
    },
  ],
};
