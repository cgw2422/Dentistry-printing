import type { NextConfig } from "next";

/**
 * Deployment config.
 *
 * Keep this file free of Next's static-export mode — including inside
 * comments, and including a conditional branch that is switched off by
 * default. Railway's builder decides how to package the app by scanning this
 * file as text rather than evaluating it. If it finds that setting it packages
 * the app as a static site, then fails copying an `out/` directory that a
 * normal `next build` never produces:
 *
 *     failed to compute cache key: "/app/out": not found
 *
 * Railway runs `npm run build` and `npm run start`, which is a Node server
 * build. The shareable preview needs a static export instead;
 * `npm run build:preview` supplies that config for the length of that one
 * build and then restores this file. See `scripts/build-preview.mjs`.
 */
const nextConfig: NextConfig = {};

export default nextConfig;
