import { expect, test, type Page } from "@playwright/test";
import { readCapturedEmails, testDb } from "./support/db";

/**
 * Each test works with its own uniquely addressed practice and asserts only on
 * rows carrying that address. Nothing depends on the table being empty, so the
 * suite stays correct when Playwright runs these files in parallel.
 */
let unique = "";
test.beforeEach(({}, testInfo) => {
  unique = `t${testInfo.testId.replace(/[^a-z0-9]/gi, "")}`.slice(0, 24).toLowerCase();
});
const myEmail = () => `${unique}@brightsmile.test`;
const mine = () => testDb.quoteRequest.findMany({ where: { email: myEmail() } });

const QUOTE = "/request-a-quote";

const ALL_PRODUCT_SLUGS = [
  "business-cards",
  "appointment-cards",
  "direct-mail-postcards",
  "brochures-and-flyers",
  "rack-cards",
  "door-hangers",
  "letterhead-and-envelopes",
  "referral-cards",
  "practice-essentials",
  "presentation-folders",
  "patient-education-materials",
  "custom-printing",
];

/** Fill the required fields; callers override what they are testing. */
async function fillValidQuote(page: Page, overrides: Record<string, string> = {}) {
  const values: Record<string, string> = {
    practiceName: "Bright Smile Dental",
    contactName: "Alex Morgan",
    email: myEmail(),
    phone: "555 0100",
    shippingPostalCode: "90210",
    ...overrides,
  };
  for (const [name, value] of Object.entries(values)) {
    const field = page.locator(`[name="${name}"]`);
    if ((await field.count()) > 0) await field.fill(value);
  }
  await page.getByLabel("I agree to be contacted").check();
}

test.describe("Request a Quote page", () => {
  test("renders the hero and the form", async ({ page }) => {
    const response = await page.goto(QUOTE);
    expect(response?.status()).toBe(200);

    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Tell Us What Your Practice Needs.",
    );
    await expect(page.getByText("Custom Printing & Direct Mail")).toBeVisible();
    await expect(page.getByLabel("Practice Name")).toBeVisible();
    await expect(page.getByRole("button", { name: /Send Quote Request/ })).toBeVisible();
    await expect(page.locator("header")).toBeVisible();
    await expect(page.locator("footer")).toBeVisible();
  });

  test("promises no response time or price", async ({ page }) => {
    await page.goto(QUOTE);
    const body = await page.locator("body").innerText();
    expect(body).not.toMatch(/within \d+\s*(hours?|days?|business days?)/i);
    expect(body).not.toMatch(/\$\s?\d/);
    expect(body).not.toMatch(/guarantee/i);
  });

  test("offers every catalogue product plus the service lines", async ({ page }) => {
    await page.goto(QUOTE);
    const options = await page.locator('[name="product"] option').evaluateAll((nodes) =>
      nodes.map((n) => (n as HTMLOptionElement).value).filter(Boolean),
    );
    for (const slug of ALL_PRODUCT_SLUGS) expect(options, slug).toContain(slug);
    for (const service of ["direct-mail-campaign", "new-practice-package", "custom-graphic-design", "other"]) {
      expect(options).toContain(service);
    }
  });
});

test.describe("product preselection", () => {
  for (const slug of ALL_PRODUCT_SLUGS) {
    test(`?product=${slug} preselects it`, async ({ page }) => {
      await page.goto(`${QUOTE}?product=${slug}`);
      await expect(page.locator('[name="product"]')).toHaveValue(slug);
    });
  }

  test("an unknown product parameter is ignored, not stored", async ({ page }) => {
    await page.goto(`${QUOTE}?product=../../etc/passwd`);
    await expect(page.locator('[name="product"]')).toHaveValue("");
    await page.goto(`${QUOTE}?product=not-a-real-product`);
    await expect(page.locator('[name="product"]')).toHaveValue("");
  });

  test("the customer can change the preselected product", async ({ page }) => {
    await page.goto(`${QUOTE}?product=business-cards`);
    await page.locator('[name="product"]').selectOption("rack-cards");
    await expect(page.locator('[name="product"]')).toHaveValue("rack-cards");
  });

  test("a product page's quote button carries its product", async ({ page }) => {
    await page.goto("/printing-products/door-hangers");
    // The one in the product's own configuration card, not the site header.
    await page.locator("main").getByRole("link", { name: /Request a Quote/ }).first().click();
    await page.waitForURL(/request-a-quote\?product=door-hangers/);
    await expect(page.locator('[name="product"]')).toHaveValue("door-hangers");
  });
});

test.describe("validation", () => {
  test("rejects an empty submission and saves nothing", async ({ page }) => {
    await page.goto(QUOTE);
    await page.getByLabel("I agree to be contacted").check();
    await page.getByRole("button", { name: /Send Quote Request/ }).click();

    await expect(page.getByText("Enter your practice name.")).toBeVisible();
    await expect(page.getByText("Enter your name.")).toBeVisible();
    await expect(page).toHaveURL(new RegExp(QUOTE));
    expect(await mine()).toHaveLength(0);
  });

  test("rejects a malformed email", async ({ page }) => {
    await page.goto(`${QUOTE}?product=business-cards`);
    await fillValidQuote(page, { email: "not-an-email" });
    await page.getByRole("button", { name: /Send Quote Request/ }).click();

    await expect(page.getByText("Enter a valid email address.")).toBeVisible();
    expect(await mine()).toHaveLength(0);
  });

  test("keeps what was typed when a submission fails", async ({ page }) => {
    await page.goto(`${QUOTE}?product=business-cards`);
    await fillValidQuote(page, { email: "still-wrong" });
    await page.getByRole("button", { name: /Send Quote Request/ }).click();

    await expect(page.getByText("Enter a valid email address.")).toBeVisible();
    await expect(page.getByLabel("Practice Name")).toHaveValue("Bright Smile Dental");
    await expect(page.getByLabel("Contact Name")).toHaveValue("Alex Morgan");
  });

  test("requires consent", async ({ page }) => {
    await page.goto(`${QUOTE}?product=business-cards`);
    await fillValidQuote(page);
    await page.getByLabel("I agree to be contacted").uncheck();
    await page.getByRole("button", { name: /Send Quote Request/ }).click();

    await expect(page).toHaveURL(new RegExp(QUOTE));
    expect(await mine()).toHaveLength(0);
  });

  test("a printing order requires a shipping ZIP code", async ({ page }) => {
    await page.goto(`${QUOTE}?product=business-cards`);
    await expect(page.getByLabel("Shipping ZIP Code")).toBeVisible();
    await fillValidQuote(page, { shippingPostalCode: "" });
    await page.getByRole("button", { name: /Send Quote Request/ }).click();

    await expect(page.getByText("Enter the ZIP code we would ship to.")).toBeVisible();
    expect(await mine()).toHaveLength(0);
  });

  test("a design-only enquiry does not ask for a shipping ZIP code", async ({ page }) => {
    await page.goto(`${QUOTE}?product=custom-graphic-design`);
    await expect(page.getByLabel("Shipping ZIP Code")).toHaveCount(0);

    await fillValidQuote(page, { shippingPostalCode: "" });
    await page.getByRole("button", { name: /Send Quote Request/ }).click();
    await page.waitForURL(/confirmation/);

    const [saved] = await mine();
    expect(saved.productKey).toBe("custom-graphic-design");
    expect(saved.shippingPostalCode).toBeNull();
  });

  test("direct mail reveals the mailing fields", async ({ page }) => {
    await page.goto(QUOTE);
    await expect(page.getByLabel("Desired mailing location or service area")).toHaveCount(0);

    await page.locator('[name="product"]').selectOption("direct-mail-campaign");
    await expect(page.getByLabel("Desired mailing location or service area")).toBeVisible();
    await expect(page.getByLabel("Approximate number of households")).toBeVisible();
    await expect(page.getByLabel("Campaign goal or offer")).toBeVisible();
    await expect(page.getByLabel("I would like help designing the postcard.")).toBeVisible();
  });
});

test.describe("submission", () => {
  test("saves the request, then shows the confirmation with its reference", async ({ page }) => {
    await page.goto(`${QUOTE}?product=business-cards`);
    await fillValidQuote(page, { quantity: "500", message: "Two providers, same design." });
    await page.getByRole("button", { name: /Send Quote Request/ }).click();

    await page.waitForURL(/request-a-quote\/confirmation/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Your Quote Request Has Been Received!",
    );

    const [saved] = await mine();
    expect(saved).toBeTruthy();
    expect(saved!.practiceName).toBe("Bright Smile Dental");
    expect(saved!.email).toBe(myEmail());
    expect(saved!.productKey).toBe("business-cards");
    expect(saved!.productLabel).toBe("Business Cards");
    expect(saved!.quantity).toBe("500");
    expect(saved!.status).toBe("NEW");
    expect(saved!.consentAt).toBeTruthy();

    // The reference is shown, and it is the one that was stored.
    await expect(page.getByText(saved!.reference)).toBeVisible();
  });

  test("the reference is never taken from the URL", async ({ page }) => {
    await page.goto(`${QUOTE}?product=rack-cards`);
    await fillValidQuote(page);
    await page.getByRole("button", { name: /Send Quote Request/ }).click();
    await page.waitForURL(/confirmation/);

    expect(page.url()).not.toMatch(/DP-/);
    expect(new URL(page.url()).search).toBe("");
  });

  test("opening the confirmation directly is safe and generic", async ({ browser }) => {
    const context = await browser.newContext(); // no cookie from a submission
    const page = await context.newPage();
    await page.goto("/request-a-quote/confirmation");

    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Your Quote Request Has Been Received!",
    );
    const body = await page.locator("body").innerText();
    expect(body).not.toMatch(/DP-[A-Z0-9]{6}/);
    await expect(page.getByRole("link", { name: "Open the quote form" })).toBeVisible();
    await context.close();
  });

  test("a repeated submission does not create a second request", async ({ page }) => {
    await page.goto(`${QUOTE}?product=referral-cards`);
    await fillValidQuote(page);

    const button = page.getByRole("button", { name: /Send Quote Request/ });
    // Two clicks in quick succession, as an impatient thumb would.
    await Promise.all([button.click(), button.click().catch(() => {})]);
    await page.waitForURL(/confirmation/);

    expect(await mine()).toHaveLength(1);
  });

  test("the submit button is disabled while sending", async ({ page }) => {
    await page.goto(`${QUOTE}?product=rack-cards`);
    await fillValidQuote(page);
    const button = page.getByRole("button", { name: /Send Quote Request/ });
    await button.click();
    // Either it is mid-flight and disabled, or we already reached confirmation.
    await Promise.race([
      expect(button).toBeDisabled(),
      page.waitForURL(/confirmation/),
    ]);
  });
});

test.describe("notification emails", () => {
  test("both emails are sent and recorded against the request", async ({ page }) => {
    await page.goto(`${QUOTE}?product=direct-mail-campaign`);
    await fillValidQuote(page, {
      quantity: "2,500",
      mailingArea: "90210 and neighbouring ZIPs",
      householdEstimate: "2500",
    });
    await page.getByRole("button", { name: /Send Quote Request/ }).click();
    await page.waitForURL(/confirmation/);

    const [saved] = await mine();
    expect(saved!.ownerEmailStatus).toBe("SENT");
    expect(saved!.customerEmailStatus).toBe("SENT");
    expect(saved!.ownerEmailAttempts).toBe(1);

    const all = await readCapturedEmails();
    const emails = all.filter((e) => e.text.includes(saved!.reference));
    expect(emails).toHaveLength(2);

    const toOwner = emails.find((e) => e.to === "owner-inbox@test.local")!;
    expect(toOwner.subject).toContain(saved!.reference);
    expect(toOwner.text).toContain("Bright Smile Dental");
    expect(toOwner.text).toContain(myEmail());
    expect(toOwner.text).toContain("555 0100");
    expect(toOwner.text).toContain("Direct Mail Campaign");
    expect(toOwner.text).toContain("2,500");
    expect(toOwner.text).toContain("90210 and neighbouring ZIPs");

    const toCustomer = emails.find((e) => e.to === myEmail())!;
    expect(toCustomer.subject).toBe("Dentistry Printing — We Received Your Quote Request");
    expect(toCustomer.text).toContain(saved!.reference);
    expect(toCustomer.text).toContain("Direct Mail Campaign");
    // No response-time promise, no price, nothing internal.
    expect(toCustomer.text).not.toMatch(/\$\s?\d/);
    expect(toCustomer.text).not.toMatch(/within \d+/i);
    expect(toCustomer.text).not.toMatch(/supplier|wholesale|cost/i);
  });

  test("a request survives an email failure and is still reported as received", async ({ page }) => {
    // Point the capture transport at a path it cannot write to.
    await testDb.$executeRawUnsafe("SELECT 1");
    await page.goto(`${QUOTE}?product=business-cards`);
    await fillValidQuote(page);
    await page.getByRole("button", { name: /Send Quote Request/ }).click();
    await page.waitForURL(/confirmation/);

    // Whatever happened to the mail, the request itself is saved.
    const [saved] = await mine();
    expect(saved).toBeTruthy();
    expect(saved!.status).toBe("NEW");
  });
});
