# Dentistry Printing

Nationwide printing and direct mail for dental practices — **Print • Promote • Grow**.

**Phase 1 of the build: the homepage and its reusable design system only.**
No other public page, customer account system, cart, checkout or admin dashboard
has been built yet. See [Status](#status) for exactly what does and does not work.

## Stack

| Concern    | Choice                                  |
| ---------- | --------------------------------------- |
| Framework  | Next.js 16 (App Router, React 19)       |
| Language   | TypeScript (strict)                     |
| Styling    | Tailwind CSS v4, tokens in `globals.css` |
| Typography | Poppins, self-hosted via `next/font/local` |
| Imagery    | Authored SVG product mockups (no raster assets) |
| Testing    | Playwright (desktop + 360px/390px mobile) |
| Hosting    | Railway (not yet deployed)              |

Phase 1 ships with **no database**. The homepage is fully static, so Postgres and
Prisma would only add deployment surface with nothing to store yet.

## Getting started

```bash
npm install
npm run dev          # http://localhost:3000
```

| Script              | What it does                                      |
| ------------------- | ------------------------------------------------- |
| `npm run dev`       | Development server                                 |
| `npm run build`     | Production build (also runs the type check)        |
| `npm run start`     | Serve the production build                         |
| `npm run lint`      | ESLint                                             |
| `npm run typecheck` | `tsc --noEmit`                                     |
| `npm test`          | Playwright suite; builds and serves on port 3100   |

The test suite needs a Chromium. Either run `npx playwright install chromium`, or
point `PLAYWRIGHT_CHROMIUM_PATH` at an existing binary if your CI image pins one.

## Project structure

```
src/
  app/
    layout.tsx          Header + footer shell, fonts, metadata
    page.tsx            Homepage — composes the sections below
    not-found.tsx       Branded "coming in a later phase" page
    globals.css         Brand tokens (@theme) and base styles
  content/              ← the seam for the future database
    site.ts             Brand details, primary nav, footer nav
    products.ts         Product categories and featured products
    faqs.ts             Homepage FAQ copy
    photos.ts           Photography slots on the postcard mockups
  components/
    brand/              mark.ts (the tooth paths), ToothMark, Logo lockup
    ui/                 Container, Button, SectionHeading, icons
    layout/             Header (with mobile menu), Footer
    mockups/            Printed-product artwork, drawn as SVG
    home/               One component per homepage section
public/photos/          Where licensed patient photography goes (see photos.ts)
docs/screenshots/       Screenshots of the built homepage
tests/homepage.spec.ts  Content, navigation, FAQ and layout checks
```

### Why `src/content` matters

Every product name, nav link and FAQ answer is plain typed data, not JSX buried
in a component. When the admin dashboard and database arrive, each export is
replaced by a Prisma query returning the same shape and **no component changes**.
This is also why the codebase contains no prices: retail pricing will be owned by
the admin dashboard and editable without touching source, as required.

### Why the product imagery is SVG

The printed pieces — business cards, appointment cards, postcards, brochures,
rack cards, door hangers, letterhead, envelopes — are drawn as vector artwork in
`src/components/mockups/`. Cropping the design comps would have produced blurry
images with distorted text, and generic dental-office stock photography is not
product imagery. Vector mockups stay sharp at any size, weigh almost nothing, and
can be restyled from the brand tokens.

`pieces.tsx` holds individual pieces at fixed natural sizes; `arrangements.tsx`
composes them into the hero group, the direct-mail pair, the new-practice
flat-lay and the product tiles. Shared gradients and clip paths live in
`MockupDefs.tsx`, rendered once per page.

## Status

### Working

- Homepage, fully responsive, verified at 360px, 390px, 768px, 1280px and 1440px
- Header: desktop navigation, and a mobile menu that opens, locks page scroll,
  closes on Escape or on navigating
- FAQ accordion: keyboard operable, items toggle independently
- Every navigation link routes correctly; destinations that are not built yet
  land on a branded placeholder page
- Footer with product, marketing, company, legal and account links

### Not built yet

Product listing and detail pages, Direct Mail, New Practice Packages, Custom
Design, How It Works, About, Contact, Request a Quote, search, customer accounts,
the shopping cart and checkout, Privacy Policy, Terms of Service, and the admin
dashboard. **The cart badge is a static zero — there is no cart.**

## Planned phases

Phase 1 is approved. **The remaining phases are a sketch of the likely order, not
an approved plan.** Pages are specified and approved one at a time: do not build
a page from this list without its own design and requirements from the owner.

1. **Homepage + design system** — approved
2. Public pages, one at a time: products, product detail, direct mail, packages,
   design, about, contact, quote request, legal pages
3. Database (Postgres + Prisma) and the admin dashboard: products, retail pricing,
   wholesale costs, quotes, orders, payments, artwork, proofs, campaigns,
   fulfillment, revenue and gross profit
4. Customer accounts: practices with multiple staff members and multiple
   locations, artwork library, proof approval, order history and reordering
5. Cart, checkout and payments

Supplier orders are submitted manually; no supplier API is assumed. Supplier
identity, wholesale costs and margins never appear in customer-facing code.

Patient photography is deferred by decision, not blocked: the postcard mockups
keep their graphic treatment, and `src/content/photos.ts` holds the slots and the
licensing bar a photo has to clear before it goes in one.
