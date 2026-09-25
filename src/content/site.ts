/**
 * Static site content: brand details and navigation.
 *
 * Everything in `src/content` is deliberately plain, typed data rather than
 * hard-coded JSX, so content changes never require touching a component.
 *
 * Nothing in here may point at a page that does not exist. This is a lead
 * generation site: a visitor who clicks "About" and lands on a placeholder
 * does not come back to fill in the quote form. Add the link when the page
 * ships, not before.
 */

export type NavLink = {
  label: string;
  href: string;
};

export const brand = {
  name: "Dentistry Printing",
  tagline: "Print • Promote • Grow",
  description:
    "Nationwide printing and direct mail for dental practices — from everyday practice essentials to complete new-patient campaigns.",
} as const;

/**
 * Contact details, as configured by the owner.
 *
 * Every field is deliberately optional and empty until real values are
 * supplied. Nothing here may be invented: a fabricated phone number or address
 * on a printing company's site is worse than none at all. Components check for
 * a value and simply omit the row when it is absent, so filling one of these in
 * is the only step needed to make it appear everywhere it belongs.
 */
export const contact: {
  email?: string;
  phone?: string;
  /** Free-form, e.g. "Austin, TX". Not a full mailing address unless set. */
  location?: string;
} = {};

/** Primary navigation. Every entry is a page that exists. */
export const primaryNav: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Printing Products", href: "/printing-products" },
  { label: "Direct Mail", href: "/direct-mail" },
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
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms of Service", href: "/terms-of-service" },
    ],
  },
];
