import { defineConfig, env } from "prisma/config";

/**
 * Prisma 7 reads the connection string here rather than from the schema, and
 * the client connects through a driver adapter (see src/server/db.ts).
 *
 * Only migration and introspection commands use this file, so the URL never
 * reaches the browser bundle.
 */
export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: env("DATABASE_URL"),
  },
});
