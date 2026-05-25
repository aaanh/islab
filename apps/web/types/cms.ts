import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";
import type { Author, AuthorCategory, Category, Media, Post } from "@/payload-types";

export type { Author, AuthorCategory, Category, Media, Post };

export type RichTextContent = SerializedEditorState;

export type PostView = {
  id: number;
  title: string;
  slug: string;
  mainImage?: Media | null;
  bodyEnglish?: RichTextContent | null;
  bodyFrancais?: RichTextContent | null;
  author?: Pick<Author, "name" | "bio"> | null;
  categories?: Pick<Category, "title" | "slug">[];
  subposts?: PostSummary[];
};

export type PostSummary = {
  title: string;
  slug: string;
  mainImage?: Media | null;
};

export type CategoryView = Pick<
  Category,
  "id" | "title" | "slug" | "description" | "sidebarOrder"
>;

export type SidebarNavSubpost = {
  title: string;
  slug: string;
};

export type SidebarNavPost = {
  title: string;
  slug: string;
  subposts: SidebarNavSubpost[];
};

export type SidebarNavCategory = {
  title: string;
  slug: string;
  posts: SidebarNavPost[];
};

export type PeopleView = {
  name: string;
  slug: string;
  bio?: RichTextContent | null;
  authorCategories: Pick<AuthorCategory, "title" | "slug">[];
  affiliation?: string | null;
  externLinks?: { site: string; url: string }[];
  image?: string | null;
};

export type PeopleCategoryView = Pick<AuthorCategory, "title" | "slug">;
