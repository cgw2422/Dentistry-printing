import { expect, test, type Page } from "@playwright/test";
import { randomUUID } from "node:crypto";
import { hashIdentifier, quoteReference } from "../src/server/crypto";
import { CUSTOMER, OWNER, STAFF, seedAccount, testDb } from "./support/db";

/**
 * Seed a quote directly, so these tests are about access rather than the form.
 *
 * The reference comes from the real generator: it is unique per call, so the
 * same test running under three viewport projects cannot collide on the
 * column's unique constraint. No test clears the table, so the suite stays
 * correct when these files run in parallel.
 */
async function seedQuote(reference: string = quoteReference()) {
  return testDb.quoteRequest.create({
    data: {
      reference,
      practiceName: "Seeded Dental",
      contactName: "Jamie Lee",
      email: "jamie@seeded.test",
      phone: "555 0111",
      productKey: "business-cards",
      productLabel: "Business Cards",
      artworkStatus: "NOT_SURE",
      consentAt: new Date(),
      submissionToken: `seed-${reference}-${randomUUID()}`,
      shippingPostalCode: "90210",
    },
  });
}

async function signIn(page: Page, account: { email: string; password: string }) {
  await page.goto("/owner/login");
  await page.getByLabel("Email").fill(account.email);
  await page.getByLabel("Password").fill(account.password);
  await page.getByRole("button", { name: "Sign in" }).click();
}

test.describe("owner area is protected", () => {
  test("a signed-out visitor is sent to the login page", async ({ page }) => {
    await page.goto("/owner/quotes");
    await page.waitForURL(/\/owner\/login/);
    await expect(page.getByRole("heading", { name: "Staff sign in" })).toBeVisible();
  });

  test("quote data is not reachable while signed out", async ({ page }) => {
    const quote = await seedQuote();
    await page.goto(`/owner/quotes/${quote.id}`);
    await page.waitForURL(/\/owner\/login/);

    const body = await page.locator("body").innerText();
    expect(body).not.toContain("Seeded Dental");
    expect(body).not.toContain("jamie@seeded.test");
  });

  test("a wrong password is refused with a message that reveals nothing", async ({ page }) => {
    // Its own account: a deliberate failure counts against the per-account
    // lockout, and the shared owner account is signed in by other tests.
    const account = await seedAccount("wrong-password");
    await signIn(page, { email: account.email, password: "not-the-password" });
    await expect(page.getByText("Those details did not match. Please try again.")).toBeVisible();

    // An unknown address gets exactly the same answer.
    await signIn(page, { email: "nobody@test.local", password: "not-the-password" });
    await expect(page.getByText("Those details did not match. Please try again.")).toBeVisible();
    await expect(page).toHaveURL(/\/owner\/login/);
  });

  test("failed attempts are recorded for rate limiting, without the address", async ({ page }) => {
    const account = await seedAccount("recorded-attempt");
    const before = await testDb.loginAttempt.count();
    await signIn(page, { email: account.email, password: "wrong-password-here" });
    await expect(page.getByText("Those details did not match. Please try again.")).toBeVisible();

    expect(await testDb.loginAttempt.count()).toBeGreaterThan(before);

    // Look the row up by the hash of this test's own address, so a parallel
    // worker's attempt cannot be mistaken for it.
    const emailHash = hashIdentifier(account.email);
    const attempt = await testDb.loginAttempt.findFirst({
      where: { emailHash },
      orderBy: { createdAt: "desc" },
    });
    expect(attempt).not.toBeNull();
    expect(attempt!.success).toBe(false);
    // Hashed, not the raw email.
    expect(emailHash).not.toContain("@");
    expect(emailHash).toHaveLength(64);

    // The raw address never reaches the table.
    expect(
      await testDb.loginAttempt.count({ where: { emailHash: { contains: account.email } } }),
    ).toBe(0);
  });

  test("the owner can sign in and reach the dashboard", async ({ page }) => {
    await signIn(page, OWNER);
    await page.waitForURL(/\/owner\/quotes/);
    await expect(page.getByRole("heading", { name: "Quote requests" })).toBeVisible();
    await expect(page.getByText(OWNER.email)).toBeVisible();
  });

  test("platform staff can also reach it", async ({ page }) => {
    await signIn(page, STAFF);
    await page.waitForURL(/\/owner\/quotes/);
    await expect(page.getByRole("heading", { name: "Quote requests" })).toBeVisible();
  });

  test("a CUSTOMER account is signed in but refused the owner area", async ({ page }) => {
    await signIn(page, CUSTOMER);
    await page.goto("/owner/quotes");
    await page.waitForURL(/\/owner\/login/);
    await expect(page.getByRole("heading", { name: "Quote requests" })).toHaveCount(0);
  });

  test("a customer cannot read a quote by its id either", async ({ page }) => {
    const quote = await seedQuote();
    await signIn(page, CUSTOMER);
    await page.goto(`/owner/quotes/${quote.id}`);
    await page.waitForURL(/\/owner\/login/);
    expect(await page.locator("body").innerText()).not.toContain("Seeded Dental");
  });

  test("signing out ends the session", async ({ page }) => {
    await signIn(page, OWNER);
    await page.waitForURL(/\/owner\/quotes/);
    await page.getByRole("button", { name: "Sign out" }).click();
    await page.waitForURL(/\/owner\/login/);

    await page.goto("/owner/quotes");
    await page.waitForURL(/\/owner\/login/);
  });

  test("bumping the session epoch revokes an existing session", async ({ page }) => {
    await signIn(page, OWNER);
    await page.waitForURL(/\/owner\/quotes/);

    // What "sign out everywhere" does server-side.
    await testDb.user.update({
      where: { email: OWNER.email },
      data: { sessionEpoch: { increment: 1 } },
    });

    await page.goto("/owner/quotes");
    await page.waitForURL(/\/owner\/login/);
  });

  test("a disabled account loses access immediately", async ({ page }) => {
    await signIn(page, STAFF);
    await page.waitForURL(/\/owner\/quotes/);

    await testDb.user.update({ where: { email: STAFF.email }, data: { status: "DISABLED" } });
    await page.goto("/owner/quotes");
    await page.waitForURL(/\/owner\/login/);

    await testDb.user.update({ where: { email: STAFF.email }, data: { status: "ACTIVE" } });
  });
});

test.describe("owner quote management", () => {
  test.beforeEach(async ({ page }) => {
    await signIn(page, OWNER);
    await page.waitForURL(/\/owner\/quotes/);
  });

  test("lists submitted requests and opens one", async ({ page }) => {
    const quote = await seedQuote();
    await page.goto("/owner/quotes");

    await expect(page.getByRole("heading", { name: "Quote requests" })).toBeVisible();
    await expect(page.getByRole("link", { name: quote.reference })).toBeVisible();
    await page.getByRole("link", { name: quote.reference }).click();
    await page.waitForURL(new RegExp(quote.id));

    await expect(page.getByRole("heading", { name: quote.reference })).toBeVisible();
    await expect(page.getByText("Seeded Dental")).toBeVisible();
    await expect(page.getByText("jamie@seeded.test")).toBeVisible();
    await expect(page.locator("main").getByText("Business Cards")).toBeVisible();
  });

  test("the status can be changed and it persists", async ({ page }) => {
    const quote = await seedQuote();
    await page.goto(`/owner/quotes/${quote.id}`);

    await page.getByLabel("Quote status").selectOption("QUOTED");
    await page.getByRole("button", { name: "Update status" }).click();

    // The select shows the choice immediately; poll until the round trip lands.
    await expect
      .poll(async () => (await testDb.quoteRequest.findUnique({ where: { id: quote.id } }))!.status)
      .toBe("QUOTED");
  });

  test("internal notes are saved and attributed", async ({ page }) => {
    const quote = await seedQuote();
    await page.goto(`/owner/quotes/${quote.id}`);

    await page.getByLabel("Note").fill("Called the practice, sending pricing Monday.");
    await page.getByRole("button", { name: "Add note" }).click();

    await expect(page.getByText("Called the practice, sending pricing Monday.")).toBeVisible();
    await expect
      .poll(async () => testDb.quoteNote.count({ where: { quoteRequestId: quote.id } }))
      .toBe(1);
    const note = await testDb.quoteNote.findFirst({ where: { quoteRequestId: quote.id } });
    expect(note!.authorId).toBeTruthy();
  });

  test("shows email delivery status and can retry a failure", async ({ page }) => {
    const quote = await testDb.quoteRequest.create({
      data: {
        reference: quoteReference(),
        practiceName: "Retry Dental",
        contactName: "Sam Ray",
        email: "sam@retry.test",
        phone: "555 0122",
        productKey: "rack-cards",
        productLabel: "Rack Cards",
        artworkStatus: "NOT_SURE",
        consentAt: new Date(),
        submissionToken: `retry-${randomUUID()}`,
        shippingPostalCode: "10001",
        ownerEmailStatus: "FAILED",
        ownerEmailError: "Simulated provider outage",
        ownerEmailAttempts: 1,
      },
    });

    await page.goto(`/owner/quotes/${quote.id}`);
    await expect(page.getByText("Simulated provider outage")).toBeVisible();

    await page.getByRole("button", { name: "Retry this email" }).first().click();
    await expect(page.getByText("Simulated provider outage")).toHaveCount(0);

    await expect
      .poll(async () => (await testDb.quoteRequest.findUnique({ where: { id: quote.id } }))!.ownerEmailStatus)
      .toBe("SENT");
    const after = await testDb.quoteRequest.findUnique({ where: { id: quote.id } });
    expect(after!.ownerEmailAttempts).toBe(2);
  });

  test("the owner area is not indexed", async ({ page }) => {
    await page.goto("/owner/quotes");
    const robots = await page.locator('meta[name="robots"]').getAttribute("content");
    expect(robots).toMatch(/noindex/);
  });
});
