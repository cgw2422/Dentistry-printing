import type { NextConfig } from "next";

/**
 * The homepage is fully static, so it can be emitted either way:
 *
 *  - default: a normal Next.js server build, which is what Railway runs
 *    (`npm run build && npm run start`).
 *  - STATIC_EXPORT=1: a self-contained folder of HTML/CSS/JS in `out/`, used to
 *    publish a shareable preview. `assetPrefix: "."` keeps every asset URL
 *    relative so the export works when served from a sub-path.
 *
 * Remove the export branch once the site gains server-rendered pages.
 */
const staticExport = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  ...(staticExport
    ? { output: "export" as const, assetPrefix: ".", images: { unoptimized: true } }
    : {}),
};

export default nextConfig;
