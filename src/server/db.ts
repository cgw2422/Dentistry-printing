import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma";

/**
 * Prisma client, server-only.
 *
 * Prisma 7 connects through a driver adapter, so the connection string is read
 * here from the environment and never reaches a bundle the browser sees.
 *
 * Construction is deferred until the first query. Building the app then does
 * not need a reachable database or a DATABASE_URL, which keeps CI and image
 * builds independent of the database, and a module-level singleton keeps dev
 * hot reloads from opening a new pool on every edit.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function getClient(): PrismaClient {
  if (globalForPrisma.prisma) return globalForPrisma.prisma;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set. See .env.example.");
  }

  const client = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
  globalForPrisma.prisma = client;
  return client;
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, property) {
    // Keep the export from looking like a promise to anything that awaits it.
    if (property === "then") return undefined;
    const value = getClient()[property as keyof PrismaClient];
    return typeof value === "function" ? value.bind(getClient()) : value;
  },
});
