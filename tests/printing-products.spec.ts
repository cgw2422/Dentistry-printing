import { expect, test, type Page } from "@playwright/test";

const CATALOG = "/printing-products";

/** Every product in the catalogue, in the order the page renders them. */
const PRODUCTS = [
  { name: "Business Cards", slug: "business-cards" },
  { name: "Appointment Cards", slug: "appointment-cards" },
  { name: "Direct Mail Postcards", slug: "direct-mail-postcards" },
  { name: "Brochures & Flyers", slug: "brochures-and-flyers" },
  { name: "Rack Cards", slug: "rack-cards" },
  { name: "Door Hangers", slug: "door-hangers" },
  { name: "Letterhead & Envelopes", slug: "letterhead-and-envelopes" },
  { name: "Referral Cards", slug: "referral-cards" },
  { name: "Practice Essentials", slug: "practice-essentials" },
  { name: "Presentation Folders", slug: "presentation-folders" },
  { name: "Patient Education Materials", slug: "patient-education-materials" },
  { name: "Custom Printing", slug: "custom-printing" },
];

const grid = (page: Page) => page.getByRole("list", { name: "Printing products" });
const cards = (page: Page) => grid(page).getByRole("listitem");
const shownNames = (page: Page) => cards(page).locator("h3").allInnerTexts();

/**
 * The server renders the unfiltered catalogue and the client narrows it once
 * it has read the URL, so a direct link to a filtered view briefly shows every
 * product. Poll rather than reading once.
 */
async function expectProducts(page: Page, names: string[]) {
  await expect.poll(() => shownNames(page), { timeout: 5000 }).toEqual(names);
}

/** Type into the search field and submit with Enter. */
async function searchFor(page: Page, term: string) {
  const field = page.getByRole("searchbox", { name: "Search printing products" });
  await field.fill(term);
  await field.press("Enter");
  await page.waitForURL(/[?&]q=/);
}

test.describe("Printing Products page", () => {
  test("the route renders with its hero and catalogue heading", async ({ page }) => {
    const response = await page.goto(CATALOG);
    expect(response?.status()).toBe(200);

    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "High-Quality Printing for Every Part of Your Practice.",
    );
    await expect(page.getByText("PRINTING PRODUCTS FOR DENTAL PRACTICES")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "All Printing Products", exact: true }),
    ).toBeVisible();
    await expect(page.locator("header")).toBeVisible();
    await expect(page.locator("footer")).toBeVisible();
  });

  test("shows all 12 products with a matching count", async ({ page }) => {
    await page.goto(CATALOG);
    await expect(cards(page)).toHaveCount(12);
    await expectProducts(page, PRODUCTS.map((p) => p.name));
    await expect(page.getByText("12 products", { exact: true })).toBeVisible();
  });

  test("every product links to its own future product page", async ({ page }) => {
    await page.goto(CATALOG);
    for (const product of PRODUCTS) {
      if (product.slug === "custom-printing") continue; // enquiry card, not a product page
      const card = cards(page).filter({ has: page.getByRole("heading", { name: product.name, exact: true }) });
      await expect(card.getByRole("link").first()).toHaveAttribute(
        "href",
        `/printing-products/${product.slug}`,
      );
    }
  });

  test("Custom Printing is an enquiry card, not a configurable product", async ({ page }) => {
    await page.goto(CATALOG);
    const custom = cards(page).filter({
      has: page.getByRole("heading", { name: "Custom Printing", exact: true }),
    });
    await expect(custom.getByRole("link", { name: /Request a Custom Quote/ })).toHaveAttribute(
      "href",
      "/request-a-quote?product=custom-printing",
    );
  });

  test("product pages are real pages now, and unknown slugs 404", async ({ page }) => {
    await page.goto("/printing-products/business-cards");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Professional Business Cards",
    );

    const response = await page.goto("/printing-products/nope");
    expect(response?.status()).toBe(404);
  });

  test("makes no claim about price, turnaround or results", async ({ page }) => {
    await page.goto(CATALOG);
    const body = await page.locator("body").innerText();
    expect(body).not.toMatch(/\$\d/);
    expect(body).not.toMatch(/guarantee/i);
    expect(body).not.toMatch(/\b\d+\s*(business\s*)?days?\b/i);
  });
});

test.describe("search", () => {
  const cases = [
    { term: "postcard", expect: ["Direct Mail Postcards"] },
    { term: "appointment", expect: ["Appointment Cards"] },
    { term: "envelope", expect: ["Letterhead & Envelopes"] },
    { term: "referral", expect: ["Referral Cards"] },
    { term: "folder", expect: ["Presentation Folders"] },
    { term: "eddm", expect: ["Direct Mail Postcards"] },
    { term: "aftercare", expect: ["Patient Education Materials"] },
  ];

  for (const { term, expect: expected } of cases) {
    test(`"${term}" returns ${expected.join(", ")}`, async ({ page }) => {
      await page.goto(CATALOG);
      await searchFor(page, term);
      await expectProducts(page, expected);
    });
  }

  test("is case-insensitive and ignores surrounding whitespace", async ({ page }) => {
    await page.goto(CATALOG);
    await searchFor(page, "   POSTCARD   ");
    await expectProducts(page, ["Direct Mail Postcards"]);

    await searchFor(page, "PoStCaRd");
    await expectProducts(page, ["Direct Mail Postcards"]);
  });

  test("requires every word typed to match", async ({ page }) => {
    await page.goto(CATALOG);
    await searchFor(page, "business card");
    await expectProducts(page, ["Business Cards"]);
  });

  test("the Search button submits as well as Enter", async ({ page }) => {
    await page.goto(CATALOG);
    await page.getByRole("searchbox", { name: "Search printing products" }).fill("referral");
    await page.getByRole("button", { name: "Search", exact: true }).click();
    await page.waitForURL(/[?&]q=referral/);
    await expectProducts(page, ["Referral Cards"]);
  });

  test("no matches shows the empty state and offers a way out", async ({ page }) => {
    await page.goto(CATALOG);
    await searchFor(page, "xyzzy");

    await expect(grid(page)).toHaveCount(0);
    await expect(
      page.getByText("No products found. Try another search or request a custom quote."),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "Clear Search", exact: true })).toBeVisible();
    await expect(page.getByRole("link", { name: /Request a Custom Quote/ })).toBeVisible();
  });

  test("Clear Search restores the whole catalogue", async ({ page }) => {
    await page.goto(CATALOG);
    await searchFor(page, "postcard");
    await expect(cards(page)).toHaveCount(1);

    await page.getByRole("link", { name: "Clear Search", exact: true }).first().click();
    await expect(cards(page)).toHaveCount(12);
    await expect(page.getByRole("searchbox", { name: "Search printing products" })).toHaveValue("");
  });

  test("a search survives a reload, because it lives in the URL", async ({ page }) => {
    await page.goto(`${CATALOG}?q=referral`);
    await expectProducts(page, ["Referral Cards"]);
    await expect(page.getByRole("searchbox", { name: "Search printing products" })).toHaveValue(
      "referral",
    );
  });
});

test.describe("category filtering", () => {
  test("the sidebar is desktop-only and the dialog is not", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "desktop layout only");
    await page.goto(CATALOG);
    await expect(page.getByRole("navigation", { name: "Product categories" })).toBeVisible();
    await expect(page.getByRole("button", { name: /Filter Products/ })).toBeHidden();
  });

  test("the sidebar filters the grid and marks the active category", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "sidebar is desktop only");
    await page.goto(CATALOG);

    const sidebar = page.getByRole("navigation", { name: "Product categories" });
    await sidebar.getByRole("link", { name: "Rack Cards", exact: true }).click();
    await page.waitForURL(/category=rack-cards/);

    await expectProducts(page, ["Rack Cards"]);
    await expect(page.getByText("1 product of 12")).toBeVisible();
    await expect(sidebar.getByRole("link", { name: "Rack Cards", exact: true })).toHaveAttribute(
      "aria-current",
      "true",
    );
  });

  test("All Products restores the full catalogue", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "sidebar is desktop only");
    await page.goto(`${CATALOG}?category=door-hangers`);
    await expect(cards(page)).toHaveCount(1);

    const sidebar = page.getByRole("navigation", { name: "Product categories" });
    await sidebar.getByRole("link", { name: "All Products", exact: true }).click();
    await expect(cards(page)).toHaveCount(12);
  });

  test.describe("the mobile Filter Products control", () => {
    test.beforeEach(({}, testInfo) => {
      test.skip(testInfo.project.name === "desktop", "compact layout only");
    });

    const trigger = (page: Page) => page.getByRole("button", { name: /Filter Products/ });
    const dialog = (page: Page) => page.getByRole("dialog", { name: "Filter Products" });

    test("replaces the sidebar and shows the current selection", async ({ page }) => {
      await page.goto(CATALOG);
      await expect(trigger(page)).toBeVisible();
      await expect(page.getByRole("navigation", { name: "Product categories" })).toBeHidden();
      await expect(trigger(page)).toContainText("All Products");

      await page.goto(`${CATALOG}?category=rack-cards`);
      await expect(trigger(page)).toContainText("Rack Cards");
    });

    test("opens a dialog listing every category, marking the current one", async ({ page }) => {
      await page.goto(`${CATALOG}?category=door-hangers`);
      await trigger(page).click();

      await expect(dialog(page)).toBeVisible();
      // The category list itself; the footer's Clear filter link is separate.
      await expect(dialog(page).getByRole("list").getByRole("link")).toHaveCount(13);
      await expect(dialog(page).getByRole("link", { name: "Clear filter" })).toBeVisible();
      await expect(
        dialog(page).getByRole("link", { name: "Door Hangers", exact: true }),
      ).toHaveAttribute("aria-current", "true");
      await expect(page.locator("body")).toHaveCSS("overflow", "hidden");
    });

    test("choosing a category filters the grid and closes the dialog", async ({ page }) => {
      await page.goto(CATALOG);
      await trigger(page).click();
      await dialog(page).getByRole("link", { name: "Presentation Folders", exact: true }).click();

      await page.waitForURL(/category=presentation-folders/);
      await expectProducts(page, ["Presentation Folders"]);
      await expect(dialog(page)).toHaveCount(0);
      await expect(trigger(page)).toContainText("Presentation Folders");
    });

    test("Clear filter restores every product but keeps the search", async ({ page }) => {
      await page.goto(`${CATALOG}?q=cards&category=referral-cards`);
      await expectProducts(page, ["Referral Cards"]);

      await trigger(page).click();
      await dialog(page).getByRole("link", { name: "Clear filter" }).click();

      await page.waitForURL((url) => !url.searchParams.has("category"));
      expect(new URL(page.url()).searchParams.get("q")).toBe("cards");
      expect((await shownNames(page)).length).toBeGreaterThan(1);
    });

    test("selecting a category keeps an active search", async ({ page }) => {
      await page.goto(`${CATALOG}?q=cards`);
      await trigger(page).click();
      await dialog(page).getByRole("link", { name: "Referral Cards", exact: true }).click();

      await page.waitForURL(/category=referral-cards/);
      expect(new URL(page.url()).searchParams.get("q")).toBe("cards");
      await expectProducts(page, ["Referral Cards"]);
    });

    test("Escape closes it and returns focus to the trigger", async ({ page }) => {
      await page.goto(CATALOG);
      await trigger(page).click();
      await expect(dialog(page)).toBeVisible();

      await page.keyboard.press("Escape");
      await expect(dialog(page)).toHaveCount(0);
      await expect(trigger(page)).toBeFocused();
      await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
    });

    test("Done and the close button both dismiss it", async ({ page }) => {
      await page.goto(CATALOG);
      await trigger(page).click();
      await dialog(page).getByRole("button", { name: "Done" }).click();
      await expect(dialog(page)).toHaveCount(0);

      await trigger(page).click();
      await dialog(page).getByRole("button", { name: "Close filter" }).click();
      await expect(dialog(page)).toHaveCount(0);
    });
  });

  test("search and category narrow together rather than cancelling out", async ({ page }) => {
    // A category that contains the term: both filters hold, one product shown.
    await page.goto(`${CATALOG}?category=direct-mail-postcards`);
    await searchFor(page, "postcard");
    expect(new URL(page.url()).searchParams.get("category")).toBe("direct-mail-postcards");
    await expectProducts(page, ["Direct Mail Postcards"]);

    // A category that does not contain the term: still filtered, so no results,
    // and the search is not silently dropped.
    await page.goto(`${CATALOG}?category=rack-cards&q=postcard`);
    await expect(grid(page)).toHaveCount(0);
    await expect(
      page.getByText("No products found. Try another search or request a custom quote."),
    ).toBeVisible();
  });

  test("choosing a category keeps an active search", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "sidebar is desktop only");
    await page.goto(`${CATALOG}?q=cards`);
    await expect(cards(page).first()).toBeVisible();
    const before = await shownNames(page);
    expect(before.length).toBeGreaterThan(1);

    await page
      .getByRole("navigation", { name: "Product categories" })
      .getByRole("link", { name: "Referral Cards", exact: true })
      .click();
    await page.waitForURL(/category=referral-cards/);

    expect(new URL(page.url()).searchParams.get("q")).toBe("cards");
    await expectProducts(page, ["Referral Cards"]);
  });

  test("Browse All Products clears both the search and the category", async ({ page }) => {
    await page.goto(`${CATALOG}?q=postcard&category=direct-mail-postcards`);
    await expect(cards(page)).toHaveCount(1);

    await page.getByRole("link", { name: "Browse All Products" }).click();
    await expect(cards(page)).toHaveCount(12);

    const params = new URL(page.url()).searchParams;
    expect(params.get("q")).toBeNull();
    expect(params.get("category")).toBeNull();
  });
});

test.describe("Printing Products layout", () => {
  test("never scrolls horizontally", async ({ page }) => {
    await page.goto(CATALOG);
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
      await page.goto(CATALOG);
      const { scrollWidth, clientWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(scrollWidth, `horizontal scroll at ${width}px`).toBe(clientWidth);
      await expect(cards(page)).toHaveCount(12);
    }
  });

  test("product tiles fill their column and line up", async ({ page }) => {
    await page.goto(CATALOG);
    await expect(cards(page)).toHaveCount(12);
    const rows = await page.evaluate(() => {
      const items = Array.from(
        document.querySelectorAll('ul[aria-label="Printing products"] > li'),
      );
      const byRow = new Map<number, { w: number; bottom: number }[]>();
      for (const el of items) {
        const r = el.getBoundingClientRect();
        const key = Math.round(r.top / 8);
        if (!byRow.has(key)) byRow.set(key, []);
        byRow.get(key)!.push({ w: Math.round(r.width), bottom: Math.round(r.bottom) });
      }
      return Array.from(byRow.values()).filter((r) => r.length > 1);
    });

    expect(rows.length).toBeGreaterThan(0);
    for (const row of rows) {
      expect([...new Set(row.map((c) => c.w))]).toHaveLength(1);
      expect([...new Set(row.map((c) => c.bottom))]).toHaveLength(1);
    }
  });

  test("keeps tap targets large enough to hit", async ({ page }) => {
    await page.goto(CATALOG);
    const undersized = await page.evaluate(() => {
      const out: { text: string; height: number; min: number }[] = [];
      for (const el of Array.from(document.querySelectorAll("a, button, input"))) {
        const rect = el.getBoundingClientRect();
        if (!rect.width || !rect.height) continue;
        const cls = el.className.toString();
        if (cls.includes("sr-only")) continue;
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

  test("marks Printing Products as the active nav item", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "desktop navigation");
    await page.goto(CATALOG);
    await expect(
      page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Printing Products" }),
    ).toHaveAttribute("aria-current", "page");
  });
});

test.describe("server-rendered filtering", () => {
  /**
   * The catalogue used to be prerendered unfiltered and narrowed by the
   * client, so a filtered link showed all 12 products for a moment. These
   * assert the fix at the source: the HTML the server sends is already
   * correct, before any JavaScript runs.
   */
  const countCards = (html: string) => (html.match(/<li class="flex">/g) ?? []).length;
  // React splits interpolated text with <!-- --> markers, so strip comments
  // and tags rather than reading up to the first "<".
  const countText = (html: string) =>
    html
      .match(/aria-live="polite">([\s\S]*?)<\/p>/)?.[1]
      ?.replace(/<!--[\s\S]*?-->/g, "")
      .replace(/<[^>]*>/g, "")
      .replace(/\s+/g, " ")
      .trim() ?? "";

  test("the HTML for a filtered URL contains only the matching products", async ({ request }) => {
    const html = await (await request.get(`${CATALOG}?q=envelope`)).text();
    expect(countCards(html)).toBe(1);
    expect(countText(html)).toBe("1 product of 12");
    expect(html).toContain("Letterhead &amp; Envelopes");
    expect(html).not.toContain("Door Hangers</h3>");
  });

  test("the HTML for a category URL is filtered too", async ({ request }) => {
    const html = await (await request.get(`${CATALOG}?category=door-hangers`)).text();
    expect(countCards(html)).toBe(1);
    expect(countText(html)).toBe("1 product of 12");
  });

  test("the HTML for a URL with no matches carries the empty state", async ({ request }) => {
    const html = await (await request.get(`${CATALOG}?q=xyzzy`)).text();
    expect(countCards(html)).toBe(0);
    expect(countText(html)).toBe("0 products of 12");
    expect(html).toContain("No products found.");
  });

  test("the unfiltered HTML still carries all 12, once", async ({ request }) => {
    const html = await (await request.get(CATALOG)).text();
    expect(countCards(html)).toBe(12);
    expect(countText(html)).toBe("12 products");
  });

  test("the search box is pre-filled from the URL in the HTML", async ({ request }) => {
    const html = await (await request.get(`${CATALOG}?q=referral`)).text();
    expect(html).toMatch(/id="product-search"[^>]*value="referral"/);
  });

  test("a filtered URL renders correctly with JavaScript turned off", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto(`${CATALOG}?q=envelope`);

    await expect(page.getByRole("list", { name: "Printing products" }).getByRole("listitem")).toHaveCount(1);
    await expect(
      page.getByRole("heading", { name: "Letterhead & Envelopes", exact: true }),
    ).toBeVisible();
    await context.close();
  });
});
