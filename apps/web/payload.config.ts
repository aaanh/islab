import path from "path";
import { fileURLToPath } from "url";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { buildConfig } from "payload";
import sharp from "sharp";

import { AuthorCategories } from "./collections/author-categories";
import { getDatabaseAdapter } from "./db-adapter";
import { Authors } from "./collections/authors";
import { Categories } from "./collections/categories";
import { Media } from "./collections/media";
import { Posts } from "./collections/posts";
import { Users } from "./collections/users";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    suppressHydrationWarning: true,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Users,
    Media,
    Categories,
    Posts,
    Authors,
    AuthorCategories,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "change-me-in-production",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: getDatabaseAdapter(),
  sharp,
  plugins: [],
});
