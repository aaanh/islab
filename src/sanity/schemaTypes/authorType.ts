import { UserIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const authorType = defineType({
  name: "author",
  title: "Author",
  type: "document",
  icon: UserIcon,
  fields: [
    defineField({
      name: "name",
      type: "string",
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: {
        source: "name",
      },
    }),
    defineField({
      name: "image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "author_category",
      type: "array",
      of: [
        defineArrayMember({
          type: "reference",
          to: { type: "author_category" },
        }),
      ],
    }),
    defineField({
      name: "affiliation",
      title: "Affiliation",
      type: "string",
    }),
    defineField({
      name: "extern_links",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "extern_link_object",
          fields: [
            defineField({
              type: "string",
              name: "site",
              title: "Site",
            }),
            defineField({
              type: "string",
              name: "url",
              title: "URL",
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "bio",
      type: "array",
      of: [
        defineArrayMember({
          type: "block",
          styles: [{ title: "Normal", value: "normal" }],
          lists: [],
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "name",
      media: "image",
    },
  },
});
