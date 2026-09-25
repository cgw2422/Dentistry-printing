/**
 * Per-product content for the product-detail pages.
 *
 * Every page is rendered by one template that reads from here, so adding a
 * product is a data change, not a new page.
 *
 * ── What deliberately is NOT in this file ────────────────────────────────
 * No sizes, paper weights, finishes, coatings, print methods, production
 * times or prices are authored here, because none have been verified with the
 * supplier. `customization` names the dimensions a job is specified by — the
 * questions we will ask — never the answers. "Paper Type" is a thing you can
 * choose; claiming a particular stock is available is not ours to say yet.
 *
 * This site does not sell online. There is no cart, no configured pricing and
 * no checkout, so nothing here drives an order form: the page explains the
 * product and sends the visitor to Request a Quote.
 *
 * Supplier costs and retail prices must never be written into this module. It
 * is imported by client components, so anything with a value in it is shipped
 * to the browser.
 */

import type { GalleryViewKey } from "@/components/mockups/galleryArt";
import { findProduct, type ProductEntry } from "./products";

/* ------------------------------------------------------------------ */
/* Customization                                                       */
/* ------------------------------------------------------------------ */

/**
 * One dimension a job is specified by, e.g. "Size" or "Paper Type".
 *
 * Deliberately a plain label and nothing more. These are printed as a short
 * list so a visitor knows what is adjustable before they ask, and they become
 * the things we confirm on the quote. They are not a form.
 */
export type CustomizationOption = string;

/** Verified only. Absent means we say nothing about timing. */
export type ProductionEstimate = {
  label: string;
};

export type ArtworkRequirement = {
  label: string;
  detail: string;
};

/* ------------------------------------------------------------------ */
/* Page content model                                                  */
/* ------------------------------------------------------------------ */

export type HighlightKey = "printing" | "design" | "fulfillment" | "proof";

export type ProductHighlight = {
  icon: HighlightKey;
  title: string;
  detail: string;
};

export type GalleryView = {
  key: GalleryViewKey;
  label: string;
  /** Description used for the image's accessible name. */
  alt: string;
};

export type ProductDetail = {
  slug: string;
  eyebrow: string;
  headline: string;
  description: string;
  highlights: ProductHighlight[];
  gallery: GalleryView[];
  customization: CustomizationOption[];
  details?: { intro: string; points: string[] };
  /** Set false to take a product off sale without deleting it. */
  active: boolean;
  production?: ProductionEstimate;
  artworkRequirements?: ArtworkRequirement[];
};

/* ------------------------------------------------------------------ */
/* Authored content                                                    */
/* ------------------------------------------------------------------ */

const SHARED_HIGHLIGHTS: ProductHighlight[] = [
  { icon: "printing", title: "Professional Printing", detail: "" },
  { icon: "design", title: "Custom Design Available", detail: "" },
  { icon: "fulfillment", title: "Nationwide Fulfillment", detail: "" },
];

/**
 * Only Business Cards is authored so far. Every other product falls back to
 * its catalogue entry, which is why the template has to work without any of
 * this being present.
 */
const details: Record<string, ProductDetail> = {
  "business-cards": {
    slug: "business-cards",
    eyebrow: "Business Cards",
    headline: "Professional Business Cards for Dental Practices",
    description:
      "Make a great first impression with custom business cards designed specifically for dental professionals.",
    highlights: SHARED_HIGHLIGHTS,
    gallery: [
      {
        key: "businessCardsStack",
        label: "Stacked cards",
        alt: "A printed stack of dental practice business cards showing the front design.",
      },
      {
        key: "businessCardsFront",
        label: "Front",
        alt: "The front of a dental practice business card with the practice logo.",
      },
      {
        key: "businessCardsBack",
        label: "Back",
        alt: "The back of a dental practice business card, laid out for a name, role and contact details.",
      },
      {
        key: "businessCardsAngled",
        label: "Angled view",
        alt: "A stack of business cards at an angle, with a single card showing its reverse.",
      },
    ],
    // The dimensions a business card job is specified by — what we will ask
    // about, not what we claim to stock.
    customization: ["Size", "Paper type and finish", "Quantity", "Single or double sided"],
    details: {
      intro:
        "Business cards are what your team hands to a patient at the front desk, leaves with a referring practice, or includes with a treatment plan. We print them for the whole practice — one design across every provider, or a separate card for each member of the team.",
      points: [
        "One design across the practice, or a card per provider",
        "Printed from your existing branding, or designed for you",
        "Front and back both printable",
        "Shipped to your practice address",
      ],
    },
    active: true,
  },
};

/* ------------------------------------------------------------------ */
/* Lookup                                                              */
/* ------------------------------------------------------------------ */

export type ResolvedProduct = {
  product: ProductEntry;
  detail: ProductDetail;
};

/**
 * The content a product page renders, falling back to the catalogue entry for
 * products that have no authored detail yet. Those still get their name,
 * description, artwork and a quote action — just no customization list.
 */
export function resolveProduct(slug: string): ResolvedProduct | null {
  const product = findProduct(slug);
  if (!product) return null;

  const authored = details[slug];
  const detail: ProductDetail = authored ?? {
    slug,
    eyebrow: product.name,
    headline: product.name,
    description: product.blurb,
    highlights: SHARED_HIGHLIGHTS,
    gallery: [],
    customization: [],
    active: true,
  };

  return { product, detail };
}
