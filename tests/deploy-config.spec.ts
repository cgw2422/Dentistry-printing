import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { expect, test } from "@playwright/test";

/**
 * Railway scans next.config.ts as text to decide how to package the app. A
 * static-export setting anywhere in it — including in a comment, or in a
 * conditional branch that is off by default — makes it build a static site and
 * then fail on a missing `out/` directory:
 *
 *     failed to compute cache key: "/app/out": not found
 *
 * That took a deploy down once. This keeps it from coming back.
 */
test("the deployed Next config never declares static export", () => {
  const config = readFileSync(resolve(process.cwd(), "next.config.ts"), "utf8");
  expect(config).not.toMatch(/output\s*:\s*['"`]export['"`]/);
  expect(config).not.toMatch(/['"`]export['"`]\s*as\s*const/);
});
