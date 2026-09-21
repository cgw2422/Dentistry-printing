import { execSync } from "node:child_process";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../src/generated/prisma";
import { hashPassword } from "../../src/server/crypto";
import { CUSTOMER, OWNER, STAFF } from "./db";

/**
 * Prepares a real PostgreSQL database for the suite: applies the migrations,
 * then seeds one account per platform role so authorization can be tested for
 * what it allows as well as what it refuses.
 */
export default async function globalSetup() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL must be set for the test run.");

  execSync("npx prisma migrate deploy", { stdio: "inherit", env: process.env });

  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: url }) });

  const accounts = [
    { ...OWNER, role: "PLATFORM_ADMIN" as const, name: "Owner" },
    { ...STAFF, role: "PLATFORM_STAFF" as const, name: "Staff" },
    { ...CUSTOMER, role: "CUSTOMER" as const, name: "Customer" },
  ];

  for (const account of accounts) {
    const passwordHash = await hashPassword(account.password);
    await prisma.user.upsert({
      where: { email: account.email },
      create: {
        email: account.email,
        passwordHash,
        platformRole: account.role,
        status: "ACTIVE",
        name: account.name,
      },
      update: { passwordHash, platformRole: account.role, status: "ACTIVE" },
    });
  }

  await prisma.quoteNote.deleteMany();
  await prisma.quoteRequest.deleteMany();
  await prisma.loginAttempt.deleteMany();
  await prisma.$disconnect();
}
