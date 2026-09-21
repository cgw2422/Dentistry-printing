/**
 * Product taxonomy for the homepage.
 *
 * No prices, turnaround times or stock specifications are listed here on
 * purpose: retail pricing will be owned by the admin dashboard and served from
 * the database, not written into source.
 */

/** Keys map 1:1 to the mockup artwork in `src/components/mockups`. */
export type MockupKey =
  | "appointmentCards"
  | "businessCards"
  | "directMailPostcards"
  | "brochures"
  | "referralCards"
  | "practiceEssentials"
  | "newPatientPostcards"
  | "triFoldBrochures";

export type ProductEntry = {
  slug: string;
  name: string;
  blurb: string;
  mockup: MockupKey;
};

/** "Everything Your Practice Needs in Print" — six category tiles. */
export const productCategories: ProductEntry[] = [
  {
    slug: "appointment-cards",
    name: "Appointment Cards",
    blurb: "Front-desk reminder cards for every visit.",
    mockup: "appointmentCards",
  },
  {
    slug: "business-cards",
    name: "Business Cards",
    blurb: "Cards for every provider and team member.",
    mockup: "businessCards",
  },
  {
    slug: "new-patient-postcards",
    name: "Direct Mail Postcards",
    blurb: "New-patient postcards, printed and mailed.",
    mockup: "directMailPostcards",
  },
  {
    slug: "brochures-and-flyers",
    name: "Brochures & Flyers",
    blurb: "Explain your services in the operatory.",
    mockup: "brochures",
  },
  {
    slug: "referral-cards",
    name: "Referral Cards",
    blurb: "Make it easy for patients to refer friends.",
    mockup: "referralCards",
  },
  {
    slug: "practice-essentials",
    name: "Practice Essentials",
    blurb: "Letterhead, envelopes, rack cards and hangers.",
    mockup: "practiceEssentials",
  },
];

/** "Popular Products" — four featured items. */
export const popularProducts: ProductEntry[] = [
  {
    slug: "appointment-cards",
    name: "Appointment Cards",
    blurb: "Reminder cards your front desk hands out daily.",
    mockup: "appointmentCards",
  },
  {
    slug: "business-cards",
    name: "Business Cards",
    blurb: "A polished card for every member of your team.",
    mockup: "businessCards",
  },
  {
    slug: "new-patient-postcards",
    name: "New-Patient Postcards",
    blurb: "Designed for mailing to households near your practice.",
    mockup: "newPatientPostcards",
  },
  {
    slug: "tri-fold-brochures",
    name: "Tri-Fold Brochures",
    blurb: "Walk patients through the services you offer.",
    mockup: "triFoldBrochures",
  },
];
