import { expect, test, type Page } from "@playwright/test";

const BUSINESS_CARDS = "/printing-products/business-cards";

/** Every catalogue slug — all of them render through the one template. */
const ALL_SLUGS = [
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

const gallery = (page: Page) => page.getByRole("tabpanel");
const mainImageLabel = (page: Page) =>
  gallery(page).locator("svg[role='img']").getAttribute("aria-label");

test.describe("Business Cards product page", () => {
  test("renders with its eyebrow, headline and description", async ({ page }) => {
    const response = await page.goto(BUSINESS_CARDS);
    expect(response?.status()).toBe(200);

    // The eyebrow sits above the h1 and is uppercased in CSS, so assert both
    // the text it carries and that it displays the way the design calls for.
    const eyebrow = page.locator("h1").locator("xpath=preceding-sibling::p[1]");
    await expect(eyebrow).toHaveText("Business Cards");
    await expect(eyebrow).toHaveCSS("text-transform", "uppercase");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Professional Business Cards for Dental Practices",
    );
    await expect(
      page.getByText(
        "Make a great first impression with custom business cards designed specifically for dental professionals.",
      ),
    ).toBeVisible();
    await expect(page.locator("header")).toBeVisible();
    await expect(page.locator("footer")).toBeVisible();
  });

  test("shows the three service highlights and no unsupported claims", async ({ page }) => {
    await page.goto(BUSINESS_CARDS);
    for (const label of ["Professional Printing", "Custom Design Available", "Nationwide Fulfillment"]) {
      await expect(page.getByText(label, { exact: true }).first()).toBeVisible();
    }

    const body = await page.locator("body").innerText();
    expect(body).not.toMatch(/guarantee/i);
    expect(body).not.toMatch(/\bfast\b/i);
    expect(body).not.toMatch(/\b\d+\s*(business\s*)?days?\b/i);
    expect(body).not.toMatch(/\b\d+\s*(gsm|lb|pt)\b/i); // no invented paper weights
  });
});

test.describe("breadcrumbs", () => {
  test("show the trail and link back up it", async ({ page }) => {
    await page.goto(BUSINESS_CARDS);
    const crumbs = page.getByRole("navigation", { name: "Breadcrumb" });

    await expect(crumbs.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/");
    await expect(crumbs.getByRole("link", { name: "Printing Products" })).toHaveAttribute(
      "href",
      "/printing-products",
    );
    await expect(crumbs.getByText("Business Cards")).toHaveAttribute("aria-current", "page");
  });

  test("the Printing Products crumb returns to the catalogue", async ({ page }) => {
    await page.goto(BUSINESS_CARDS);
    await page
      .getByRole("navigation", { name: "Breadcrumb" })
      .getByRole("link", { name: "Printing Products" })
      .click();
    await page.waitForURL("**/printing-products");
    await expect(
      page.getByRole("heading", { name: "All Printing Products", exact: true }),
    ).toBeVisible();
  });
});

test.describe("product gallery", () => {
  test("offers four views and starts on the first", async ({ page }) => {
    await page.goto(BUSINESS_CARDS);
    const tabs = page.getByRole("tab");
    await expect(tabs).toHaveCount(4);

    for (const name of ["Stacked cards", "Front", "Back", "Angled view"]) {
      await expect(page.getByRole("tab", { name, exact: true })).toBeVisible();
    }
    await expect(page.getByRole("tab", { name: "Stacked cards", exact: true })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  test("selecting a thumbnail updates the main image", async ({ page }) => {
    await page.goto(BUSINESS_CARDS);
    const before = await mainImageLabel(page);
    expect(before).toMatch(/printed stack/i);

    await page.getByRole("tab", { name: "Back", exact: true }).click();
    const after = await mainImageLabel(page);
    expect(after).toMatch(/back of a dental practice business card/i);
    expect(after).not.toBe(before);

    await expect(page.getByRole("tab", { name: "Back", exact: true })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  test("every view has its own image description", async ({ page }) => {
    await page.goto(BUSINESS_CARDS);
    const seen = new Set<string>();
    const tabs = page.getByRole("tab");
    for (let i = 0; i < (await tabs.count()); i++) {
      await tabs.nth(i).click();
      const label = await mainImageLabel(page);
      expect(label && label.length).toBeGreaterThan(20);
      seen.add(label!);
    }
    expect(seen.size).toBe(4);
  });

  test("is operable from the keyboard with the arrow keys", async ({ page }) => {
    await page.goto(BUSINESS_CARDS);
    await page.getByRole("tab", { name: "Stacked cards", exact: true }).focus();

    await page.keyboard.press("ArrowRight");
    await expect(page.getByRole("tab", { name: "Front", exact: true })).toBeFocused();
    expect(await mainImageLabel(page)).toMatch(/front of a dental practice business card/i);

    await page.keyboard.press("ArrowLeft");
    await expect(page.getByRole("tab", { name: "Stacked cards", exact: true })).toBeFocused();
  });

  test("can be reached by tabbing and activated with the keyboard", async ({ page }) => {
    await page.goto(BUSINESS_CARDS);
    const tab = page.getByRole("tab", { name: "Angled view", exact: true });
    await tab.focus();
    await page.keyboard.press("Enter");
    expect(await mainImageLabel(page)).toMatch(/at an angle/i);
  });
});

test.describe("configuration and pricing", () => {
  test("shows the declared option groups as real, disabled controls", async ({ page }) => {
    await page.goto(BUSINESS_CARDS);

    for (const [label, placeholder] of [
      ["Size", "Choose a size"],
      ["Paper Type", "Choose a paper type"],
      ["Quantity", "Choose a quantity"],
    ]) {
      const select = page.getByLabel(label, { exact: true });
      await expect(select).toBeVisible();
      await expect(select).toBeDisabled();
      // Only the placeholder: no invented sizes, papers or quantities.
      await expect(select.locator("option")).toHaveCount(1);
      await expect(select.locator("option")).toHaveText(placeholder);
    }
  });

  test("says plainly that specifications are being finalised", async ({ page }) => {
    await page.goto(BUSINESS_CARDS);
    await expect(
      page.getByText(/Sizes, paper types and quantities for business cards are being finalised/i),
    ).toBeVisible();
  });

  test("shows a price area with no fabricated figures", async ({ page }) => {
    await page.goto(BUSINESS_CARDS);
    await expect(page.getByText("Pricing available upon request.")).toBeVisible();

    const body = await page.locator("body").innerText();
    expect(body).not.toMatch(/\$\s?\d/);
    expect(body).not.toMatch(/\bfrom \d/i);
    expect(body).not.toMatch(/\b\d+%\s*off\b/i);
    expect(body).not.toMatch(/\bsave\b/i);
  });

  test("offers a quote rather than an operational cart", async ({ page }) => {
    await page.goto(BUSINESS_CARDS);

    // Every quote call to action leads to the real form, and the one beside the
    // configurator carries the product so the form opens pre-selected.
    const quoteLinks = page.getByRole("link", { name: /Request a Quote/ });
    const hrefs = await quoteLinks.evaluateAll((links) =>
      links.map((link) => link.getAttribute("href") ?? ""),
    );
    expect(hrefs.length).toBeGreaterThan(0);
    for (const href of hrefs) {
      expect(href).toMatch(/^\/request-a-quote(\?|$)/);
    }
    expect(hrefs).toContain("/request-a-quote?product=business-cards");
    await expect(page.getByRole("button", { name: /add to cart/i })).toHaveCount(0);
    await expect(page.getByRole("link", { name: /add to cart/i })).toHaveCount(0);
  });

  test("the cart badge in the header is untouched", async ({ page }) => {
    await page.goto(BUSINESS_CARDS);
    await expect(page.getByRole("link", { name: "Shopping cart, 0 items" }).first()).toBeVisible();
  });
});

test.describe("artwork and custom design", () => {
  test("explains both artwork routes without a file upload", async ({ page }) => {
    await page.goto(BUSINESS_CARDS);
    await expect(page.getByRole("heading", { name: "Upload Your Artwork" })).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Request Design Assistance", exact: true }),
    ).toBeVisible();
    await expect(page.locator('input[type="file"]')).toHaveCount(0);
  });

  test("design links point at the future Custom Design page", async ({ page }) => {
    await page.goto(BUSINESS_CARDS);
    for (const name of [/Request Design Assistance/, /Explore design services/, /Request Custom Design/]) {
      await expect(page.getByRole("link", { name }).first()).toHaveAttribute("href", "/custom-design");
    }
  });

  test("shows the custom design banner", async ({ page }) => {
    await page.goto(BUSINESS_CARDS);
    await expect(page.getByRole("heading", { name: "Need a Custom Design?" })).toBeVisible();
  });
});

test.describe("the shared template", () => {
  test("renders every catalogue product", async ({ page }) => {
    for (const slug of ALL_SLUGS) {
      const response = await page.goto(`/printing-products/${slug}`);
      expect(response?.status(), slug).toBe(200);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await expect(page.getByRole("navigation", { name: "Breadcrumb" })).toBeVisible();
      await expect(page.getByRole("link", { name: /Request a Quote/ }).first()).toBeVisible();
    }
  });

  test("takes its product names from the shared catalogue", async ({ page }) => {
    await page.goto("/printing-products/rack-cards");
    await expect(
      page.getByRole("navigation", { name: "Breadcrumb" }).getByText("Rack Cards"),
    ).toBeVisible();
    // The catalogue's own description, not a second copy written for this page.
    await expect(page.getByText("Perfect for waiting rooms and front desks.")).toBeVisible();
  });

  test("gives products without confirmed options no configuration fields", async ({ page }) => {
    await page.goto("/printing-products/rack-cards");
    await expect(page.getByText("Select Options")).toHaveCount(0);
    await expect(page.locator("select")).toHaveCount(0);
    // It still gets pricing status and a way to ask.
    await expect(page.getByText("Pricing available upon request.")).toBeVisible();
  });

  test("an unknown product slug is a 404", async ({ page }) => {
    const response = await page.goto("/printing-products/not-a-real-product");
    expect(response?.status()).toBe(404);
  });

  test("the catalogue's View Options links reach these pages", async ({ page }) => {
    await page.goto("/printing-products");
    const card = page
      .getByRole("list", { name: "Printing products" })
      .getByRole("listitem")
      .filter({ has: page.getByRole("heading", { name: "Business Cards", exact: true }) });

    await card.getByRole("link").first().click();
    await page.waitForURL("**/printing-products/business-cards");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Professional Business Cards");
  });
});

test.describe("product page layout", () => {
  test("never scrolls horizontally", async ({ page }) => {
    await page.goto(BUSINESS_CARDS);
    const { scrollWidth, clientWidth } = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(scrollWidth).toBe(clientWidth);
  });

  test("holds up across the breakpoints in between", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "one project is enough for a width sweep");
    for (const width of [360, 390, 768, 1280, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(BUSINESS_CARDS);
      const { scrollWidth, clientWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(scrollWidth, `horizontal scroll at ${width}px`).toBe(clientWidth);
      await expect(page.getByRole("tab")).toHaveCount(4);
    }
  });

  test("keeps tap targets large enough to hit", async ({ page }) => {
    await page.goto(BUSINESS_CARDS);
    const undersized = await page.evaluate(() => {
      const out: { text: string; height: number; min: number }[] = [];
      for (const el of Array.from(document.querySelectorAll("a, button, select"))) {
        const rect = el.getBoundingClientRect();
        if (!rect.width || !rect.height) continue;
        const cls = el.className.toString();
        if (cls.includes("sr-only") || el.getAttribute("role") === "tab") continue;
        const min = /(^|\s)(rounded-full|min-h-12)/.test(cls) ? 44 : 24;
        if (rect.height < min) {
          out.push({
            text: (el as HTMLElement).innerText?.replace(/\s+/g, " ").slice(0, 40) ?? "",
            height: Math.round(rect.height),
            min,
          });
        }
      }
      return out;
    });
    expect(undersized).toEqual([]);
  });

  test("no two text blocks overlap", async ({ page }) => {
    await page.goto(BUSINESS_CARDS);
    const collisions = await page.evaluate(() => {
      const nodes = Array.from(document.querySelectorAll("h1, h2, h3, p")).filter(
        (el) => (el as HTMLElement).innerText.trim().length > 0,
      );
      const out: string[][] = [];
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          if (a.contains(b) || b.contains(a)) continue;
          const ra = a.getBoundingClientRect();
          const rb = b.getBoundingClientRect();
          if (!ra.width || !rb.width) continue;
          const ox = Math.min(ra.right, rb.right) - Math.max(ra.left, rb.left);
          const oy = Math.min(ra.bottom, rb.bottom) - Math.max(ra.top, rb.top);
          if (ox > 4 && oy > 4) {
            out.push([
              (a as HTMLElement).innerText.slice(0, 30),
              (b as HTMLElement).innerText.slice(0, 30),
            ]);
          }
        }
      }
      return out;
    });
    expect(collisions).toEqual([]);
  });
});
