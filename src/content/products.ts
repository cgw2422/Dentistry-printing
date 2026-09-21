/**
 * The product catalogue — the single source of truth for every surface that
 * shows a product: the Printing Products page (desktop grid, mobile grid,
 * category sidebar, mobile filter and search) and the homepage sections.
 *
 * No prices, paper stocks, finishes or production times appear here on
 * purpose: retail pricing will be owned by the admin dashboard and served from
 * the database, and anything we cannot yet promise is left unsaid.
 */

/** Keys map 1:1 to the mockup artwork in `src/components/mockups`. */
export type MockupKey =
  | "appointmentCards"
  | "businessCards"
  | "directMailPostcards"
  | "brochures"
  | "referralCards"
  | "practiceEssentials"
  | "rackCards"
  | "doorHangers"
  | "letterheadEnvelopes"
  | "presentationFolders"
  | "patientEducation"
  | "customPrinting"
  // Homepage-only presentations of catalogue products.
  | "newPatientPostcards"
  | "triFoldBrochures";

export type ProductEntry = {
  /** Also the category id and the URL segment under /printing-products. */
  slug: string;
  name: string;
  blurb: string;
  mockup: MockupKey;
  /**
   * Extra search terms a practice might type that do not appear in the name
   * or blurb — "eddm" for direct mail, "post-op" for patient education.
   */
  keywords: string[];
  /**
   * Custom Printing is an enquiry rather than something to configure, so it
   * gets its own card treatment and a quote CTA instead of "View Options".
   */
  enquiryOnly?: boolean;
};

export const products: ProductEntry[] = [
  {
    slug: "business-cards",
    name: "Business Cards",
    blurb: "Make a great first impression with professional business cards.",
    mockup: "businessCards",
    keywords: ["card", "staff", "provider", "dentist", "hygienist", "contact details"],
  },
  {
    slug: "appointment-cards",
    name: "Appointment Cards",
    blurb: "Keep your schedule organised with custom appointment cards.",
    mockup: "appointmentCards",
    keywords: ["reminder", "recall", "visit", "front desk", "schedule", "booking"],
  },
  {
    slug: "direct-mail-postcards",
    name: "Direct Mail Postcards",
    blurb: "Reach new patients in your community with targeted mailers.",
    mockup: "directMailPostcards",
    keywords: [
      "postcard",
      "eddm",
      "every door direct mail",
      "mailer",
      "mailing",
      "new patient",
      "campaign",
    ],
  },
  {
    slug: "brochures-and-flyers",
    name: "Brochures & Flyers",
    blurb: "Educate and inform patients about your services.",
    mockup: "brochures",
    keywords: ["brochure", "flyer", "tri-fold", "trifold", "leaflet", "handout"],
  },
  {
    slug: "rack-cards",
    name: "Rack Cards",
    blurb: "Perfect for waiting rooms and front desks.",
    mockup: "rackCards",
    keywords: ["rack", "display", "counter", "waiting room", "reception"],
  },
  {
    slug: "door-hangers",
    name: "Door Hangers",
    blurb: "Get noticed in local neighbourhoods.",
    mockup: "doorHangers",
    keywords: ["hanger", "door", "neighbourhood", "neighborhood", "local", "canvassing"],
  },
  {
    slug: "letterhead-and-envelopes",
    name: "Letterhead & Envelopes",
    blurb: "Maintain a professional brand identity.",
    mockup: "letterheadEnvelopes",
    keywords: ["letterhead", "envelope", "stationery", "correspondence", "letters"],
  },
  {
    slug: "referral-cards",
    name: "Referral Cards",
    blurb: "Encourage patient referrals with custom cards.",
    mockup: "referralCards",
    keywords: ["referral", "refer a friend", "word of mouth", "recommend"],
  },
  {
    slug: "practice-essentials",
    name: "Practice Essentials",
    blurb: "Essential printing for your daily operations.",
    mockup: "practiceEssentials",
    keywords: ["essentials", "notepad", "forms", "stationery", "office", "front desk"],
  },
  {
    slug: "presentation-folders",
    name: "Presentation Folders",
    blurb: "Hand patients their paperwork in a branded folder.",
    mockup: "presentationFolders",
    keywords: ["folder", "pocket folder", "new patient packet", "treatment plan", "welcome pack"],
  },
  {
    slug: "patient-education-materials",
    name: "Patient Education Materials",
    blurb: "Explain treatments and aftercare in the operatory.",
    mockup: "patientEducation",
    keywords: ["education", "aftercare", "post-op", "instructions", "booklet", "treatment", "care"],
  },
  {
    slug: "custom-printing",
    name: "Custom Printing",
    blurb: "Need something that isn't listed? Tell us what your practice needs.",
    mockup: "customPrinting",
    keywords: ["custom", "bespoke", "special", "other", "quote", "something else"],
    enquiryOnly: true,
  },
];

/** Sentinel for "no category filter". Not a product slug. */
export const ALL_PRODUCTS = "all";

export type Category = { id: string; label: string };

/**
 * Sidebar / filter options, derived from the catalogue so the two can never
 * drift. Today each product is its own category; when a product grows
 * variants, `slug` becomes the category holding them.
 */
export const productCategories: Category[] = [
  { id: ALL_PRODUCTS, label: "All Products" },
  ...products.map((product) => ({ id: product.slug, label: product.name })),
];

function normalise(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

/**
 * Filter the catalogue by free-text query and/or category. Both narrow the
 * result, so searching inside a category keeps that category selected.
 *
 * Matching is case-insensitive, ignores surrounding whitespace, and requires
 * every word typed to appear somewhere in the product's name, description or
 * keywords — so "business card" matches Business Cards but not Rack Cards.
 */
export function filterProducts({
  query = "",
  category = ALL_PRODUCTS,
  catalogue = products,
}: {
  query?: string;
  category?: string;
  catalogue?: ProductEntry[];
} = {}): ProductEntry[] {
  const byCategory =
    category === ALL_PRODUCTS
      ? catalogue
      : catalogue.filter((product) => product.slug === category);

  const terms = normalise(query).split(" ").filter(Boolean);
  if (terms.length === 0) return byCategory;

  return byCategory.filter((product) => {
    const haystack = normalise(
      [product.name, product.blurb, ...product.keywords].join(" "),
    );
    return terms.every((term) => haystack.includes(term));
  });
}

export function findProduct(slug: string): ProductEntry | undefined {
  return products.find((product) => product.slug === slug);
}

/* ------------------------------------------------------------------ */
/* Homepage selections                                                 */
/* ------------------------------------------------------------------ */

/**
 * The homepage shows curated copy and artwork for some products — the same
 * catalogue entry presented as "New-Patient Postcards" rather than "Direct
 * Mail Postcards", for instance. Overrides are presentation only: the slug,
 * and therefore the route, always comes from the catalogue.
 */
function feature(slug: string, overrides: Partial<ProductEntry> = {}): ProductEntry {
  const product = findProduct(slug);
  if (!product) throw new Error(`Unknown product slug: ${slug}`);
  return { ...product, ...overrides, slug: product.slug };
}

/** "Everything Your Practice Needs in Print" — six category tiles. */
export const homeCategories: ProductEntry[] = [
  feature("appointment-cards", { blurb: "Front-desk reminder cards for every visit." }),
  feature("business-cards", { blurb: "Cards for every provider and team member." }),
  feature("direct-mail-postcards", { blurb: "New-patient postcards, printed and mailed." }),
  feature("brochures-and-flyers", { blurb: "Explain your services in the operatory." }),
  feature("referral-cards", { blurb: "Make it easy for patients to refer friends." }),
  feature("practice-essentials", { blurb: "Letterhead, envelopes, rack cards and hangers." }),
];

/** "Popular Products" — four featured items. */
export const homePopular: ProductEntry[] = [
  feature("appointment-cards", { blurb: "Reminder cards your front desk hands out daily." }),
  feature("business-cards", { blurb: "A polished card for every member of your team." }),
  feature("direct-mail-postcards", {
    name: "New-Patient Postcards",
    blurb: "Designed for mailing to households near your practice.",
    mockup: "newPatientPostcards",
  }),
  feature("brochures-and-flyers", {
    name: "Tri-Fold Brochures",
    blurb: "Walk patients through the services you offer.",
    mockup: "triFoldBrochures",
  }),
];
