import { defineConfig, devices } from "@playwright/test";

/**
 * End-to-end checks run against a production build, which is the thing we
 * actually ship. `webServer` builds and serves the site automatically.
 */
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "line" : "list",
  use: {
    baseURL: "http://127.0.0.1:3100",
    trace: "on-first-retry",
    launchOptions: {
      // Some CI images ship a pinned Chromium instead of Playwright's own
      // download. Point PLAYWRIGHT_CHROMIUM_PATH at it when that is the case;
      // otherwise Playwright uses the browser from `npx playwright install`.
      executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH || undefined,
      // Don't send loopback traffic through an outbound HTTP proxy.
      args: ["--no-proxy-server"],
    },
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    // Chromium everywhere: the sandbox image ships only a pinned Chromium.
    {
      name: "mobile-390",
      use: { ...devices["Pixel 5"], viewport: { width: 390, height: 844 }, deviceScaleFactor: 3 },
    },
    { name: "mobile-360", use: { ...devices["Pixel 5"], viewport: { width: 360, height: 780 } } },
  ],
  webServer: {
    command: "npm run build && npm run start -- --port 3100",
    url: "http://127.0.0.1:3100",
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
