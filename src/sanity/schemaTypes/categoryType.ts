import { getHighestCategoryOrder } from "@/api/categories";
import { TagIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const categoryType = defineType({
  name: "category",
  title: "Category",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({
      name: "sidebar_order",
      title: "Sidebar Order",
      type: "number",
      initialValue: async (context) => {
        const maxOrder = await getHighestCategoryOrder();

        return (maxOrder || 0) + 1;
      },
      validation: (Rule) =>
        Rule.required().custom(async (value, context) => {
          const { document, getClient } = context;
          const client = getClient({ apiVersion: "2023-11-16" });

          if (!value) return "Sidebar Order is required";

          const existing = await client.fetch(
            `*[_type == "category" && sidebar_order == $order && _id != $id][0]`,
            { order: value, id: document?._id }
          );

          if (existing) {
            return `Sidebar order must be unique. Conflict with category "${existing.title}".`;
          }

          return true;
        }),
    }),
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
    defineField({
      name: "description",
      type: "text",
    }),
  ],
});
