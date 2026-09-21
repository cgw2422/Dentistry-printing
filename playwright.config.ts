import { defineConfig, devices } from "@playwright/test";

/**
 * The suite runs against a real PostgreSQL database and the capture email
 * transport, so persistence, notification content and authorization are
 * exercised for real rather than mocked.
 */
const TEST_DATABASE_URL =
  process.env.TEST_DATABASE_URL ??
  "postgresql://postgres@127.0.0.1:5433/dentistry_printing_test";

const testEnv = {
  DATABASE_URL: TEST_DATABASE_URL,
  AUTH_SECRET: process.env.AUTH_SECRET ?? "test-secret-at-least-32-characters-long-000000",
  AUTH_URL: "http://127.0.0.1:3100",
  EMAIL_TRANSPORT: "capture",
  EMAIL_CAPTURE_DIR: ".mail-outbox",
  QUOTE_NOTIFICATION_EMAIL: "owner-inbox@test.local",
  QUOTE_FROM_EMAIL: "Dentistry Printing <quotes@test.local>",
  // The suite submits many requests from one loopback address; the limiter is
  // exercised directly in tests/quote-rate-limit.spec.ts instead.
  QUOTE_RATE_LIMIT_MAX: "500",
  // Every worker logs in from the same loopback address, so the per-address
  // bucket is widened for the suite. The per-account limit keeps its
  // production value and is asserted in tests/login-rate-limit.spec.ts.
  LOGIN_RATE_LIMIT_PER_IP: "5000",
};

Object.assign(process.env, testEnv);

/**
 * End-to-end checks run against a production build, which is the thing we
 * actually ship. `webServer` builds and serves the site automatically.
 */
export default defineConfig({
  testDir: "./tests",
  globalSetup: "./tests/support/globalSetup.ts",
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
    timeout: 240_000,
    env: testEnv,
  },
});
