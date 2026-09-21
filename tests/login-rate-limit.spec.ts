import { expect, test } from "@playwright/test";
import { randomBytes } from "node:crypto";
import { hashIdentifier } from "../src/server/crypto";
import { seedAccount, testDb } from "./support/db";

/**
 * Brute-force protection, exercised through the real login form.
 *
 * Each test seeds its own account and presents its own client address via
 * X-Forwarded-For, so it gets both rate-limit buckets to itself and neither
 * interferes with the rest of the suite nor depends on its ordering.
 *
 * The per-account limit keeps its production default during the test run (only
 * the shared per-address bucket is widened in playwright.config.ts), so this is
 * the real limit being asserted, not a test-only one.
 */
const PER_EMAIL = Number(process.env.LOGIN_RATE_LIMIT_PER_EMAIL ?? 5);
const WRONG = "definitely-not-the-password";
const REFUSED = "Those details did not match. Please try again.";

/** A private address nothing else in the run will pick. */
const clientIp = () => `10.${randomBytes(3).join(".")}`;

async function attempt(page: import("@playwright/test").Page, email: string, password: string) {
  await page.goto("/owner/login");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();
}

test("an account is locked out after too many failed attempts", async ({ browser }) => {
  const account = await seedAccount("lockout", "PLATFORM_ADMIN");
  const context = await browser.newContext({
    extraHTTPHeaders: { "x-forwarded-for": clientIp() },
  });
  const page = await context.newPage();

  for (let i = 0; i < PER_EMAIL; i += 1) {
    await attempt(page, account.email, WRONG);
    await expect(page.getByText(REFUSED)).toBeVisible();
  }

  // Every failure was recorded, which is what the limiter counts.
  expect(
    await testDb.loginAttempt.count({
      where: { emailHash: hashIdentifier(account.email), success: false },
    }),
  ).toBeGreaterThanOrEqual(PER_EMAIL);

  // The correct password is now refused too, and refused identically: a
  // lockout that announced itself would confirm the address exists.
  await attempt(page, account.email, account.password);
  await expect(page.getByText(REFUSED)).toBeVisible();
  await expect(page).toHaveURL(/\/owner\/login/);
  await expect(page.getByRole("heading", { name: "Quote requests" })).toHaveCount(0);

  // And the lockout did not leak into an untouched account.
  const bystander = await seedAccount("bystander", "PLATFORM_ADMIN");
  await attempt(page, bystander.email, bystander.password);
  await page.waitForURL(/\/owner\/quotes/);

  await context.close();
});

test("a locked out account cannot reach the owner area", async ({ browser }) => {
  const account = await seedAccount("lockout-guard", "PLATFORM_ADMIN");
  const context = await browser.newContext({
    extraHTTPHeaders: { "x-forwarded-for": clientIp() },
  });
  const page = await context.newPage();

  for (let i = 0; i < PER_EMAIL; i += 1) {
    await attempt(page, account.email, WRONG);
    await expect(page.getByText(REFUSED)).toBeVisible();
  }

  await attempt(page, account.email, account.password);
  await page.goto("/owner/quotes");
  await page.waitForURL(/\/owner\/login/);
  expect(await page.locator("body").innerText()).not.toContain("Quote requests");

  await context.close();
});
