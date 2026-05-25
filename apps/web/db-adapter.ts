import { postgresAdapter } from "@payloadcms/db-postgres";
import { sqliteAdapter } from "@payloadcms/db-sqlite";

export function getDatabaseAdapter() {
  const databaseUrl = process.env.DATABASE_URL || "file:./payload.db";

  if (databaseUrl.startsWith("postgres")) {
    return postgresAdapter({
      pool: {
        connectionString: databaseUrl,
      },
    });
  }

  return sqliteAdapter({
    client: {
      url: databaseUrl,
    },
  });
}
