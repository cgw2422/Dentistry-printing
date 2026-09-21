#!/usr/bin/env node
/**
 * Create or update the platform owner account.
 *
 * Run it against the environment you want the account in. The password is read
 * from a prompt or from OWNER_PASSWORD, hashed with scrypt, and only the hash
 * is ever written — nothing is logged, echoed, or committed.
 *
 *   npm run owner:create -- owner@yourdomain.com
 *
 * Re-running with the same email resets that account's password and bumps its
 * session epoch, which signs it out everywhere.
 */
import { createInterface } from "node:readline/promises";
import { stdin, stdout, env, argv, exit } from "node:process";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { hashPassword } from "../src/server/crypto.ts";

const email = (argv[2] ?? env.OWNER_EMAIL ?? "").trim().toLowerCase();
if (!email || !email.includes("@")) {
  console.error("Usage: npm run owner:create -- owner@yourdomain.com");
  exit(1);
}

if (!env.DATABASE_URL) {
  console.error("DATABASE_URL is not set. See .env.example.");
  exit(1);
}
if (!env.AUTH_SECRET || env.AUTH_SECRET.length < 32) {
  console.error("AUTH_SECRET must be set to at least 32 characters. See .env.example.");
  exit(1);
}

async function readPassword() {
  if (env.OWNER_PASSWORD) return env.OWNER_PASSWORD;
  const rl = createInterface({ input: stdin, output: stdout, terminal: true });
  const value = await rl.question("New password (min 12 characters): ");
  rl.close();
  return value;
}

const password = await readPassword();
if (password.length < 12) {
  console.error("Password must be at least 12 characters.");
  exit(1);
}

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: env.DATABASE_URL }) });
const passwordHash = await hashPassword(password);

const user = await prisma.user.upsert({
  where: { email },
  create: { email, passwordHash, platformRole: "PLATFORM_ADMIN", status: "ACTIVE", name: "Owner" },
  // Re-running rotates the password and invalidates every existing session.
  update: { passwordHash, platformRole: "PLATFORM_ADMIN", status: "ACTIVE", sessionEpoch: { increment: 1 } },
  select: { id: true, email: true, platformRole: true },
});

console.log(`Owner account ready: ${user.email} (${user.platformRole})`);
await prisma.$disconnect();
