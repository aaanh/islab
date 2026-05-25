import type { CollectionConfig } from "payload";

export const Categories: CollectionConfig = {
  slug: "categories",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "sidebarOrder", "slug"],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "sidebarOrder",
      type: "number",
      required: true,
      unique: true,
      admin: {
        description: "Controls sidebar position (lower numbers appear first).",
      },
    },
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
      admin: {
        description: "URL segment, e.g. introduction",
      },
    },
    {
      name: "description",
      type: "textarea",
    },
  ],
};
