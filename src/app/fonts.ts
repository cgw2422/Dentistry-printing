import localFont from "next/font/local";

export const poppins = localFont({
  variable: "--font-poppins",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "Segoe UI", "Helvetica Neue", "Arial", "sans-serif"],
  src: [
    { path: "../../public/fonts/poppins-400-latin.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/poppins-500-latin.woff2", weight: "500", style: "normal" },
    { path: "../../public/fonts/poppins-600-latin.woff2", weight: "600", style: "normal" },
    { path: "../../public/fonts/poppins-700-latin.woff2", weight: "700", style: "normal" },
    { path: "../../public/fonts/poppins-800-latin.woff2", weight: "800", style: "normal" },
  ],
});
