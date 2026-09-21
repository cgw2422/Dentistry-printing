import { randomUUID } from "node:crypto";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../src/generated/prisma";

/** Direct database access for tests, so assertions check the real rows. */
export const testDb = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL ?? "" }),
});

export const OWNER = { email: "owner@test.local", password: "owner-password-12345" };
export const STAFF = { email: "staff@test.local", password: "staff-password-12345" };
export const CUSTOMER = { email: "customer@test.local", password: "customer-password-123" };

/**
 * A throwaway account with a known password.
 *
 * Tests that deliberately fail a login need their own account: failures count
 * against the per-account lockout, so several tests burning the shared owner
 * account's budget would lock each other out when the projects run in parallel.
 */
export async function seedAccount(
  prefix: string,
  platformRole: "PLATFORM_ADMIN" | "PLATFORM_STAFF" | "CUSTOMER" = "CUSTOMER",
) {
  const { hashPassword } = await import("../../src/server/crypto");
  const email = `${prefix}-${randomUUID()}@test.local`;
  const password = `seeded-password-${randomUUID().slice(0, 8)}`;
  await testDb.user.create({
    data: { email, passwordHash: await hashPassword(password), platformRole, status: "ACTIVE" },
  });
  return { email, password };
}

export async function clearQuotes() {
  await testDb.quoteNote.deleteMany();
  await testDb.quoteRequest.deleteMany();
}

export async function clearLoginAttempts() {
  await testDb.loginAttempt.deleteMany();
}

/** Emails the capture transport wrote during a test. */
export async function readCapturedEmails(): Promise<
  { to: string; subject: string; text: string; html: string }[]
> {
  const { readdir, readFile } = await import("node:fs/promises");
  const dir = process.env.EMAIL_CAPTURE_DIR ?? ".mail-outbox";
  try {
    const files = await readdir(dir);
    const messages = await Promise.all(
      files
        .filter((f) => f.endsWith(".json"))
        .map(async (f) => JSON.parse(await readFile(`${dir}/${f}`, "utf8"))),
    );
    return messages;
  } catch {
    return [];
  }
}

export async function clearCapturedEmails() {
  const { rm } = await import("node:fs/promises");
  await rm(process.env.EMAIL_CAPTURE_DIR ?? ".mail-outbox", { recursive: true, force: true });
}
