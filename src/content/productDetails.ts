/**
 * Per-product content and configuration for the product-detail pages.
 *
 * This is the seam the admin dashboard and database will replace: every page
 * is rendered by one template that reads from here, so adding a product is a
 * data change, not a new page.
 *
 * ── What deliberately is NOT in this file ────────────────────────────────
 * No sizes, paper types, finishes, quantities, coatings, print methods,
 * production times or prices are authored here, because none have been
 * verified with the supplier. An option group with no values renders as a
 * disabled control alongside a notice that specifications are being
 * finalised — never as a list of choices that look orderable.
 *
 * Supplier costs and retail prices must never be written into this module.
 * It is imported by client components, so anything with a value in it is
 * shipped to the browser. Commercial figures belong in the database, read in
 * a server component. The types below exist so the shape is ready for them.
 */

import type { GalleryViewKey } from "@/components/mockups/galleryArt";
import { findProduct, type ProductEntry } from "./products";

/* ------------------------------------------------------------------ */
/* Configuration model                                                 */
/* ------------------------------------------------------------------ */

/** A single choice within an option group, e.g. one paper type. */
export type OptionValue = {
  id: string;
  label: string;
  /** Extra detail shown beside the label once confirmed, e.g. a dimension. */
  note?: string;
  /** Supplier-confirmed availability. Unavailable values are not offered. */
  available?: boolean;
};

/** A quantity break, e.g. 250 / 500 / 1000. Prices come from the database. */
export type QuantityTier = {
  id: string;
  quantity: number;
  label: string;
};

export type OptionGroupKind = "choice" | "quantity";

/**
 * One configurable dimension of a product. `status` is what decides whether
 * the page can offer it: "pending" means the supplier has not confirmed the
 * values yet, so the control renders disabled rather than inventing choices.
 */
export type OptionGroup = {
  id: string;
  label: string;
  /** Placeholder shown when nothing is selected, e.g. "Choose a size". */
  placeholder: string;
  kind: OptionGroupKind;
  status: "pending" | "available";
  /** Empty while `status` is "pending". */
  values: OptionValue[];
  tiers?: QuantityTier[];
  /** Finishing upgrades and similar extras the customer may skip. */
  optional?: boolean;
};

/** Supplied by the database once configured; never authored in source. */
export type ProductCommercials = {
  retailFrom?: never;
  supplierCost?: never;
};

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
  optionGroups: OptionGroup[];
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
    // Declared because these are the dimensions a business card is ordered by.
    // No values: the supplier has not confirmed them, so nothing is offered.
    optionGroups: [
      {
        id: "size",
        label: "Size",
        placeholder: "Choose a size",
        kind: "choice",
        status: "pending",
        values: [],
      },
      {
        id: "paper-type",
        label: "Paper Type",
        placeholder: "Choose a paper type",
        kind: "choice",
        status: "pending",
        values: [],
      },
      {
        id: "quantity",
        label: "Quantity",
        placeholder: "Choose a quantity",
        kind: "quantity",
        status: "pending",
        values: [],
      },
    ],
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
  /** True when at least one option group has supplier-confirmed values. */
  hasConfiguredOptions: boolean;
};

/**
 * The content a product page renders, falling back to the catalogue entry for
 * products that have no authored detail yet. Those still get their name,
 * description, artwork and a quote action — just no configuration section.
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
    optionGroups: [],
    active: true,
  };

  return {
    product,
    detail,
    hasConfiguredOptions: detail.optionGroups.some(
      (group) => group.status === "available" && group.values.length > 0,
    ),
  };
}
