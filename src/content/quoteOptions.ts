/**
 * The "Product or Service" choices on the quote form.
 *
 * Printing products come straight from the catalogue in `products.ts`, so a
 * product added there appears on the form with no second list to maintain.
 * Only the service lines that are not catalogue products are declared here.
 */

import { products } from "./products";

export type QuoteOptionGroup = "Printing products" | "Services";

export type QuoteOption = {
  /** Stable key stored on the request and accepted in ?product=. */
  key: string;
  label: string;
  group: QuoteOptionGroup;
};

export const DIRECT_MAIL_CAMPAIGN = "direct-mail-campaign";
export const CUSTOM_GRAPHIC_DESIGN = "custom-graphic-design";
export const OTHER = "other";

const SERVICE_OPTIONS: QuoteOption[] = [
  { key: DIRECT_MAIL_CAMPAIGN, label: "Direct Mail Campaign", group: "Services" },
  { key: "new-practice-package", label: "New Practice Package", group: "Services" },
  { key: CUSTOM_GRAPHIC_DESIGN, label: "Custom Graphic Design", group: "Services" },
  { key: OTHER, label: "Other / Not Sure", group: "Services" },
];

export const quoteOptions: QuoteOption[] = [
  ...products.map((product) => ({
    key: product.slug,
    label: product.name,
    group: "Printing products" as const,
  })),
  ...SERVICE_OPTIONS,
];

const byKey = new Map(quoteOptions.map((option) => [option.key, option]));

/**
 * Resolve a key to a known option, or null. Every path that accepts a product
 * — the URL parameter and the submitted form alike — goes through this, so an
 * arbitrary value can never reach the database.
 */
export function findQuoteOption(key: string | null | undefined): QuoteOption | null {
  if (!key) return null;
  return byKey.get(key.trim().toLowerCase()) ?? null;
}

/** Direct mail asks for a mailing area, households and a campaign goal. */
export function isDirectMail(key: string): boolean {
  return key === DIRECT_MAIL_CAMPAIGN || key === "direct-mail-postcards";
}

/**
 * Requests that ship nothing. A shipping ZIP is required for everything else,
 * because a printed order has to go somewhere.
 */
export function isDesignOnly(key: string): boolean {
  return key === CUSTOM_GRAPHIC_DESIGN || key === OTHER;
}

export const ARTWORK_CHOICES = [
  { value: "HAS_PRINT_READY_ARTWORK", label: "Yes, I have print-ready artwork." },
  {
    value: "HAS_BRANDING_NEEDS_DESIGN_HELP",
    label: "I have a logo or existing branding but need design help.",
  },
  { value: "NEEDS_DESIGN", label: "No, I need a design created." },
  { value: "NOT_SURE", label: "I'm not sure yet." },
] as const;

export type ArtworkChoice = (typeof ARTWORK_CHOICES)[number]["value"];
