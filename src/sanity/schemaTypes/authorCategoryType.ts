import { UsersIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const authorCategoryType = defineType({
  name: "author_category",
  title: "Personnel Category",
  type: "document",
  icon: UsersIcon,
  fields: [
    defineField({
      name: "title",
      type: "string",
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: {
        source: "title",
      },
    }),
  ],
});
