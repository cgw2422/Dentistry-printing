import { expect, test } from "@playwright/test";
import { createHmac, randomBytes, randomUUID } from "node:crypto";
import { quoteReference } from "../src/server/crypto";
import { testDb } from "./support/db";

/**
 * Abuse protection, exercised through the real form.
 *
 * Each test run presents its own client address via X-Forwarded-For, so it gets
 * a rate-limit bucket of its own: it cannot interfere with the rest of the
 * suite, and the same test under three viewport projects cannot share a bucket
 * that one project's cleanup would empty while another is still using it.
 */
const LIMIT = Number(process.env.QUOTE_RATE_LIMIT_MAX ?? 5);

/** A private address nothing else in the run will pick. */
const clientIp = () => `10.${randomBytes(3).join(".")}`;

const hashFor = (ip: string) =>
  createHmac("sha256", process.env.AUTH_SECRET ?? "").update(ip.toLowerCase()).digest("hex");

async function fillForm(page: import("@playwright/test").Page, email: string) {
  await page.goto("/request-a-quote?product=business-cards");
  await page.getByLabel("Practice Name").fill("Limiter Dental");
  await page.getByLabel("Contact Name").fill("Pat Rate");
  await page.getByLabel("Email Address").fill(email);
  await page.getByLabel("Phone Number").fill("555 0199");
  await page.getByLabel("Shipping ZIP Code").fill("90210");
  await page.getByLabel("I agree to be contacted").check();
}

test("refuses further submissions once an address passes the limit", async ({ browser }) => {
  const ip = clientIp();
  const ipHash = hashFor(ip);

  // Fill this address's bucket directly; driving the form LIMIT times would
  // only be a slower way of arriving at the same state.
  await testDb.quoteRequest.createMany({
    data: Array.from({ length: LIMIT }, (_, i) => ({
      reference: quoteReference(),
      practiceName: "Bucket Filler",
      contactName: "Filler",
      email: `filler-${i}@limiter.test`,
      phone: "555 0000",
      productKey: "business-cards",
      productLabel: "Business Cards",
      artworkStatus: "NOT_SURE" as const,
      consentAt: new Date(),
      submissionToken: `rl-${i}-${randomUUID()}`,
      ipHash,
    })),
  });

  const context = await browser.newContext({ extraHTTPHeaders: { "x-forwarded-for": ip } });
  const page = await context.newPage();
  await fillForm(page, "over-the-limit@limiter.test");
  await page.getByRole("button", { name: /Send Quote Request/ }).click();

  await expect(page.getByText(/several requests from this connection/i)).toBeVisible();
  expect(await testDb.quoteRequest.count({ where: { email: "over-the-limit@limiter.test" } })).toBe(0);

  await context.close();
  await testDb.quoteRequest.deleteMany({ where: { ipHash } });
});

test("a tampered product value is refused by the server", async ({ browser }) => {
  const ip = clientIp();
  const context = await browser.newContext({ extraHTTPHeaders: { "x-forwarded-for": ip } });
  const page = await context.newPage();

  await fillForm(page, "tampered@limiter.test");
  // What a tampered client would send: a value the select never offered.
  await page.evaluate(() => {
    const select = document.querySelector<HTMLSelectElement>('[name="product"]')!;
    const option = document.createElement("option");
    option.value = "../../secret-product";
    select.append(option);
    select.value = "../../secret-product";
  });
  await page.getByRole("button", { name: /Send Quote Request/ }).click();

  await expect(page.getByText("Choose the product or service you need.")).toBeVisible();
  expect(await testDb.quoteRequest.count({ where: { email: "tampered@limiter.test" } })).toBe(0);
  await context.close();
});

test("a filled honeypot is refused and stores nothing", async ({ browser }) => {
  const ip = clientIp();
  const context = await browser.newContext({ extraHTTPHeaders: { "x-forwarded-for": ip } });
  const page = await context.newPage();

  await fillForm(page, "bot@limiter.test");
  await page.evaluate(() => {
    const field = document.querySelector<HTMLInputElement>('[name="companyWebsiteConfirm"]')!;
    field.value = "http://spam.example";
  });
  await page.getByRole("button", { name: /Send Quote Request/ }).click();

  await expect(page.getByText(/could not accept this submission/i)).toBeVisible();
  expect(await testDb.quoteRequest.count({ where: { email: "bot@limiter.test" } })).toBe(0);
  await context.close();
});

test("an oversized field is rejected rather than truncated into the database", async ({ browser }) => {
  const ip = clientIp();
  const context = await browser.newContext({ extraHTTPHeaders: { "x-forwarded-for": ip } });
  const page = await context.newPage();

  await fillForm(page, "oversize@limiter.test");
  await page.getByLabel("Tell us more about your project").fill("x".repeat(6000));
  await page.getByRole("button", { name: /Send Quote Request/ }).click();

  await expect(page).toHaveURL(/request-a-quote/);
  expect(await testDb.quoteRequest.count({ where: { email: "oversize@limiter.test" } })).toBe(0);
  await context.close();
});
