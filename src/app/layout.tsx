import type { Metadata, Viewport } from "next";
import { MockupDefs } from "@/components/mockups/MockupDefs";
import { brand } from "@/content/site";
import { poppins } from "./fonts";
import "./globals.css";

/**
 * Document shell only. The marketing header and footer live in the `(site)`
 * route group, so internal areas such as `/owner` do not inherit them.
 */
export const metadata: Metadata = {
  title: {
    default: `${brand.name} — Printing & Direct Mail for Dental Practices`,
    template: `%s | ${brand.name}`,
  },
  description: brand.description,
};

export const viewport: Viewport = {
  themeColor: "#0f2d4a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="min-h-dvh bg-white font-sans antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-navy focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-white"
        >
          Skip to content
        </a>
        <MockupDefs />
        {children}
      </body>
    </html>
  );
}
