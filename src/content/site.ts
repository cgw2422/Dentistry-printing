/**
 * Static site content for Phase 1 (homepage only).
 *
 * Everything in `src/content` is deliberately plain, typed data rather than
 * hard-coded JSX. When the admin dashboard and database land, these modules
 * become the seam: each export is replaced by a Prisma query returning the
 * same shape, and no component has to change.
 */

export type NavLink = {
  label: string;
  href: string;
  /** True once the destination page actually exists. */
  built?: boolean;
};

export const brand = {
  name: "Dentistry Printing",
  tagline: "Print • Promote • Grow",
  description:
    "Nationwide printing and direct mail for dental practices — from everyday practice essentials to complete new-patient campaigns.",
} as const;

/** Primary navigation. Mirrors the long-term public site structure. */
export const primaryNav: NavLink[] = [
  { label: "Home", href: "/", built: true },
  { label: "Printing Products", href: "/printing-products", built: true },
  { label: "Direct Mail", href: "/direct-mail" },
  { label: "New Practice Packages", href: "/new-practice-packages" },
  { label: "Custom Design", href: "/custom-design" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const footerNav: { heading: string; links: NavLink[] }[] = [
  {
    heading: "Printing Products",
    links: [
      { label: "Business Cards", href: "/printing-products/business-cards" },
      { label: "Appointment Cards", href: "/printing-products/appointment-cards" },
      { label: "Referral Cards", href: "/printing-products/referral-cards" },
      { label: "Brochures & Flyers", href: "/printing-products/brochures-and-flyers" },
      { label: "Rack Cards", href: "/printing-products/rack-cards" },
      { label: "Door Hangers", href: "/printing-products/door-hangers" },
      { label: "Letterhead & Envelopes", href: "/printing-products/letterhead-and-envelopes" },
    ],
  },
  {
    heading: "Marketing & Design",
    links: [
      { label: "Direct Mail Campaigns", href: "/direct-mail" },
      { label: "New-Patient Postcards", href: "/printing-products/direct-mail-postcards" },
      { label: "New Practice Packages", href: "/new-practice-packages" },
      { label: "Custom Graphic Design", href: "/custom-design" },
      { label: "Request a Quote", href: "/request-a-quote" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "How It Works", href: "/how-it-works" },
      { label: "Contact", href: "/contact" },
      { label: "My Account", href: "/account" },
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms of Service", href: "/terms-of-service" },
    ],
  },
];
