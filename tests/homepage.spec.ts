import { expect, test } from "@playwright/test";

const NAV_LABELS = [
  "Home",
  "Printing Products",
  "Direct Mail",
  "New Practice Packages",
  "Custom Design",
  "How It Works",
  "About",
  "Contact",
];

test.describe("homepage content", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("renders the hero headline with the brand split", async ({ page }) => {
    const h1 = page.getByRole("heading", { level: 1 });
    await expect(h1).toHaveText("Professional Printing for Dental Practices.");
    await expect(h1.locator("span")).toHaveClass(/text-teal/);
  });

  test("shows all six product categories and four popular products", async ({ page }) => {
    const categories = page
      .locator("section")
      .filter({ has: page.getByRole("heading", { name: "Everything Your Practice Needs in Print" }) });

    for (const name of [
      "Appointment Cards",
      "Business Cards",
      "Direct Mail Postcards",
      "Brochures & Flyers",
      "Referral Cards",
      "Practice Essentials",
    ]) {
      await expect(categories.getByRole("heading", { name, exact: true })).toBeVisible();
    }

    const popular = page
      .locator("section")
      .filter({ has: page.getByRole("heading", { name: "Popular Products", exact: true }) });
    for (const name of [
      "Appointment Cards",
      "Business Cards",
      "New-Patient Postcards",
      "Tri-Fold Brochures",
    ]) {
      await expect(popular.getByRole("heading", { name, exact: true })).toBeVisible();
    }
    await expect(page.getByText("View Options")).toHaveCount(4);
  });

  test("every section heading from the brief is present", async ({ page }) => {
    for (const name of [
      "Everything Your Practice Needs in Print",
      "Put Your Practice in Their Mailbox.",
      "Popular Products",
      "Opening a New Practice? Start With the Essentials.",
      "How It Works",
      "Need Help With the Design?",
      "Frequently Asked Questions",
      "Ready to Put Your Practice in Print?",
    ]) {
      await expect(page.getByRole("heading", { name, exact: true })).toBeVisible();
    }
  });

  test("product mockups carry descriptive alternative text", async ({ page }) => {
    const images = page.getByRole("img");
    const count = await images.count();
    expect(count).toBeGreaterThan(10);
    for (let i = 0; i < count; i++) {
      await expect(images.nth(i)).toHaveAttribute("aria-label", /^[\s\S]{20,}$/);
    }
  });

  test("makes no claim about price, turnaround or results", async ({ page }) => {
    const body = await page.locator("body").innerText();
    // Guards against copy drifting into invented pricing or guarantees.
    expect(body).not.toMatch(/\$\d/);
    expect(body).not.toMatch(/guarantee/i);
    expect(body).not.toMatch(/\b\d+\s*(business\s*)?days?\b/i);
    expect(body).not.toMatch(/\b(ROI|return on investment)\b/i);
  });
});

test.describe("navigation", () => {
  test("desktop header exposes the full nav, account and cart", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "desktop layout only");
    await page.goto("/");

    const nav = page.getByRole("navigation", { name: "Main" });
    for (const label of NAV_LABELS) {
      await expect(nav.getByRole("link", { name: label, exact: true })).toBeVisible();
    }
    const header = page.getByRole("banner");
    await expect(header.getByRole("link", { name: "My Account" })).toBeVisible();
    await expect(header.getByRole("link", { name: "Shopping cart, 0 items" })).toBeVisible();
    await expect(header.getByRole("link", { name: "Request a Quote", exact: true })).toBeVisible();
  });

  test("mobile menu opens, traps scroll, and closes on Escape", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === "desktop", "compact layout only");
    await page.goto("/");

    await expect(page.locator("#mobile-menu")).toHaveCount(0);
    await page.getByRole("button", { name: "Open menu" }).click();

    const panel = page.locator("#mobile-menu");
    await expect(panel).toBeVisible();
    await expect(panel.getByRole("navigation", { name: "Mobile" }).getByRole("link")).toHaveCount(
      NAV_LABELS.length + 2, // nav links + Request a Quote + My Account
    );
    await expect(page.locator("body")).toHaveCSS("overflow", "hidden");

    await page.keyboard.press("Escape");
    await expect(panel).toHaveCount(0);
    await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
  });

  test("mobile menu navigates and closes", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === "desktop", "compact layout only");
    await page.goto("/");

    await page.getByRole("button", { name: "Open menu" }).click();
    await page.locator("#mobile-menu").getByRole("link", { name: "Direct Mail", exact: true }).click();

    await page.waitForURL("**/direct-mail");
    await expect(page.locator("#mobile-menu")).toHaveCount(0);
  });

  test("routes that are not built yet render the branded placeholder", async ({ page }) => {
    await page.goto("/printing-products");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("hasn't been built yet");
    await expect(page.locator("header")).toBeVisible();
    await expect(page.locator("footer")).toBeVisible();
  });
});

test.describe("FAQ accordion", () => {
  test("starts collapsed, toggles independently, and works from the keyboard", async ({ page }) => {
    await page.goto("/");

    const questions = page.getByRole("button", { name: /\?$/ });
    await expect(questions).toHaveCount(6);
    await expect(page.locator("[role='region'][aria-labelledby]")).toHaveCount(6);
    await expect(page.locator("[role='region'][aria-labelledby]:not([hidden])")).toHaveCount(0);

    const first = questions.first();
    const second = questions.nth(1);

    await first.click();
    await expect(first).toHaveAttribute("aria-expanded", "true");
    const panelId = await first.getAttribute("aria-controls");
    await expect(page.locator(`#${panelId}`)).toBeVisible();

    await second.click();
    await expect(page.locator("[role='region'][aria-labelledby]:not([hidden])")).toHaveCount(2);

    await first.click();
    await expect(first).toHaveAttribute("aria-expanded", "false");

    await first.focus();
    await page.keyboard.press("Enter");
    await expect(first).toHaveAttribute("aria-expanded", "true");
  });
});

test.describe("responsive layout", () => {
  test("never scrolls horizontally", async ({ page }) => {
    await page.goto("/");
    const { scrollWidth, clientWidth } = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(scrollWidth).toBe(clientWidth);
  });

  test("keeps tap targets large enough to hit", async ({ page }) => {
    await page.goto("/");
    const undersized = await page.evaluate(() => {
      const out: { text: string; height: number; min: number }[] = [];
      for (const el of Array.from(document.querySelectorAll("a, button"))) {
        const rect = el.getBoundingClientRect();
        if (!rect.width || !rect.height) continue;
        const cls = el.className.toString();
        if (cls.includes("sr-only")) continue; // skip link is sized only on focus
        // Pill CTAs get the 44px comfort target; text links get WCAG 2.5.8's 24px.
        const min = /(^|\s)(rounded-full|min-h-12)/.test(cls) ? 44 : 24;
        if (rect.height < min) {
          out.push({
            text: (el as HTMLElement).innerText.replace(/\s+/g, " ").slice(0, 40),
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
    await page.goto("/");
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
          const overlapX = Math.min(ra.right, rb.right) - Math.max(ra.left, rb.left);
          const overlapY = Math.min(ra.bottom, rb.bottom) - Math.max(ra.top, rb.top);
          if (overlapX > 4 && overlapY > 4) {
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
