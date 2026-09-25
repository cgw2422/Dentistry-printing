# Dentistry Printing

Nationwide printing and direct mail for dental practices — **Print • Promote • Grow**.

**This is a lead-generation site, not a store.** The whole public site exists to
get a dental practice to the Request a Quote form; the owner then follows up
personally. There is deliberately no customer account, no cart, no checkout, no
payment handling, no order tracking and no online pricing — and no UI anywhere
that hints at any of them.

Quote requests are stored in PostgreSQL so a lead survives an email failure, and
`/owner` is a small internal utility for reading them. That is the entire
backend. See [Status](#status) for exactly what does and does not work.

## Stack

| Concern    | Choice                                  |
| ---------- | --------------------------------------- |
| Framework  | Next.js 16 (App Router, React 19)       |
| Language   | TypeScript (strict)                     |
| Styling    | Tailwind CSS v4, tokens in `globals.css` |
| Typography | Poppins, self-hosted via `next/font/local` |
| Imagery    | Authored SVG product mockups (no raster assets) |
| Database   | PostgreSQL via Prisma 7 (`@prisma/adapter-pg`) |
| Auth       | Auth.js v5 (`next-auth`), credentials provider |
| Email      | Resend, behind a transport seam           |
| Testing    | Playwright (desktop + 360px/390px mobile) against a real PostgreSQL |
| Hosting    | Railway (not yet deployed)              |

The marketing pages are still static. The database exists for the quote system
and the identities that read it, and the schema is already shaped for the
practices, locations and memberships that later phases need.

## Getting started

```bash
npm install
cp .env.example .env          # then fill in the values below
npx prisma migrate deploy     # create the schema
npm run owner:create -- you@example.com   # your sign-in account
npm run dev                   # http://localhost:3000
```

You need a PostgreSQL database reachable at `DATABASE_URL` before the first two
of those commands will work. Any Postgres 14+ will do; Railway can provision one.

`AUTH_SECRET` must be set to a long random string — `openssl rand -base64 33`
produces one. It signs sessions and keys the hashing of the identifiers used for
rate limiting, so changing it signs everyone out and resets those counters.

| Script              | What it does                                      |
| ------------------- | ------------------------------------------------- |
| `npm run dev`       | Development server                                 |
| `npm run build`     | Production build (also runs the type check)        |
| `npm run start`     | Serve the production build                         |
| `npm run lint`      | ESLint                                             |
| `npm run typecheck` | `tsc --noEmit`                                     |
| `npm test`          | Playwright suite; builds and serves on port 3100   |
| `npm run build:preview` | Static export into `out/`, for the shareable preview |
| `npm run owner:create -- <email>` | Create or update a platform-admin account |

`npm test` needs a PostgreSQL database of its own — it migrates and seeds it, so
point `TEST_DATABASE_URL` at a scratch database, never at real data.

The test suite needs a Chromium. Either run `npx playwright install chromium`, or
point `PLAYWRIGHT_CHROMIUM_PATH` at an existing binary if your CI image pins one.

## Environment variables

`.env.example` is the authoritative list, with an explanation beside each name.
It contains **no real credentials** and none are committed anywhere. Summary:

| Variable | Required | What it is |
| -------- | -------- | ---------- |
| `DATABASE_URL` | yes | PostgreSQL connection string |
| `AUTH_SECRET` | yes | Long random string; signs sessions and keys identifier hashing |
| `AUTH_URL` | in production | The site's own origin, e.g. `https://dentistryprinting.com` |
| `RESEND_API_KEY` | to send email | Resend API key |
| `QUOTE_FROM_EMAIL` | to send email | The From address, on a domain verified with Resend |
| `QUOTE_NOTIFICATION_EMAIL` | to send email | Where new quote requests are announced — your address, never hardcoded |
| `QUOTE_RATE_LIMIT_MAX` / `_WINDOW_MINUTES` | no | Quote submissions allowed per address per window (default 5 / 30) |
| `LOGIN_RATE_LIMIT_PER_EMAIL` / `_PER_IP` / `_WINDOW_MINUTES` | no | Failed sign-ins allowed before lockout (default 5 / 20 / 15) |
| `EMAIL_TRANSPORT` / `EMAIL_CAPTURE_DIR` | tests only | `capture` writes emails to disk instead of sending them |

**What you still have to supply.** Nothing external is connected. Email needs a
Resend account, an API key, and a domain verified with them — until
`RESEND_API_KEY` and `QUOTE_FROM_EMAIL` are both set, sending is recorded as
`SKIPPED` rather than attempted, and no message leaves the server. Because no
credential exists here, **real delivery to a real inbox has not been tested**;
what is tested is that both messages are composed, addressed, dispatched through
the transport and recorded against the request. The site's public phone number
and email address are still placeholders in `src/content/site.ts` for the same
reason: they are yours to provide.

## Data model

`prisma/schema.prisma` is the whole definition; the migration in
`prisma/migrations/` is what has actually been applied.

**Identity.** `User` holds the email, a password hash, a `platformRole`
(`PLATFORM_ADMIN`, `PLATFORM_STAFF` or `CUSTOMER`), a `status` and a
`sessionEpoch`. Auth.js's `Account`, `Session` and `VerificationToken` tables
exist so an OAuth provider can be added later without a migration.

**Organizations.** `Organization` is a dental practice, `OrganizationLocation`
one of its addresses, and `OrganizationMembership` joins a user to a practice
with an `OrganizationRole` of its own. The join is unique per
`(userId, organizationId)`, so one person can belong to several practices with a
different role in each.

**The two role systems are deliberately separate.** `User.platformRole` decides
what someone may do to *Dentistry Printing* — read quote requests, change their
status. `OrganizationMembership.role` decides what they may do within *their own
practice*. Nothing derives one from the other. A practice owner who is an
`OWNER` of their organization still has `platformRole: CUSTOMER`, and owning a
practice can never grant platform-admin rights.

**Quotes.** `QuoteRequest` stores the practice and contact details, the product
(both its key and the label as shown), the specifications, the direct-mail
fields, the artwork answer, the consent timestamp, a `status`, and the delivery
state of each of the two emails. `organizationId` is nullable: a request from a
visitor with no account is complete on its own, and can be attached to an
organization later without changing the row's meaning. `QuoteNote` holds staff
notes, attributed to their author and never shown to a customer.

**Abuse records.** `LoginAttempt` records sign-in attempts. It stores HMAC hashes
of the email and IP address, not the values — enough to count against a limit,
useless as a list of who tried to sign in.

## Authentication and authorization

Credentials sign-in **forces JWT sessions**, not database sessions. Auth.js
refuses the combination outright:
`@auth/core/lib/utils/assert.js` throws `UnsupportedStrategy("Signing in with
credentials only supported if JWT strategy is enabled")`. The Prisma adapter is
still installed, and its tables are still there for a future OAuth provider, but
it is not what holds a credentials session. That is a real constraint, so the
consequence — a token the server cannot revoke by deleting a row — is
compensated for rather than ignored:

- The token carries `sessionEpoch`, and every authorization call re-reads the
  user and compares it. Bumping the column signs that person out everywhere, on
  the next request.
- The same re-read checks `status`, so disabling an account takes effect
  immediately rather than when the token expires.
- **Roles are never read from the token.** They are read from the database on
  each call, so a demotion applies at once.
- Sessions expire after 8 hours.

`src/server/auth/guards.ts` holds the only functions that grant access:
`requireStaff()` for actions, `requireStaffPage()` for pages,
`assertOrganizationAccess()` for later phases. Every owner page, every Server
Action and every database read in `/owner` calls one of them first.
`src/middleware.ts` only checks whether a session cookie exists, to redirect
signed-out visitors before rendering; it is a convenience, and the file says so.
**Removing it would not expose anything.**

Passwords are hashed with scrypt (N=65536, r=8, p=1) via `node:crypto` and
compared in constant time. A hash never leaves the server — not in a page, a
prop, or an API response.

Sign-in failures are counted per account and per address, and a wrong password,
an unknown address and a locked-out account all produce the **same** message and
take a similar amount of time: a password is verified even when no such user
exists, so the response time does not reveal which addresses are real.

### Creating your account

```bash
npm run owner:create -- you@example.com
```

It prompts for a password (or reads `OWNER_PASSWORD` for non-interactive use),
hashes it, and creates or updates that `PLATFORM_ADMIN`. Nothing is hardcoded and
no credential is committed. Running it again on an existing account resets the
password **and** bumps `sessionEpoch`, which signs out every existing session —
which is what you want if a password has been exposed.

## How a quote request is handled

1. The page renders a fresh idempotency token. Submitting twice — a double click,
   a refresh, a retried request — cannot create two rows.
2. The Server Action revalidates everything with zod, **server-side**. Client
   validation is only a convenience; nothing reaches the database without passing
   again here. Every length limit mirrors its database column, so an oversized
   field is rejected rather than silently truncated.
3. The product is checked against the catalogue. A `?product=` parameter that
   does not name a real product is ignored, and a tampered `<select>` value is
   refused — a URL can never invent a product record.
4. The request is written to PostgreSQL. **Only then** is the customer told it
   was received: a success message is never shown for something that was not
   saved.
5. Both emails are sent afterwards, and cannot fail the submission. Each
   recipient's delivery state, error and attempt count are recorded on the row,
   and the staff page shows them with a retry button. **A failed notification
   never loses a request and never tells the customer their request failed.**
6. The reference is returned in a signed, HttpOnly cookie and read back on the
   confirmation page. It is never in the URL, so no reference can be guessed or
   shared into someone else's request, and the confirmation page is `noindex`.
   Opened directly, without the cookie, it renders a generic page with no
   customer data on it.

The owner email carries the full detail. The customer email confirms receipt and
the reference and nothing else: no price, no supplier, no internal note, and **no
promised response time** — none is claimed anywhere until one is configured.
Neither message, and no log line, contains supplier identity or cost. Errors are
logged by type only, never with customer data.

Quote data is reachable only through `/owner`, behind the guards above. There is
no public API route that returns it and no unauthenticated path to it.

## Deploying to Railway

Railway runs `npm run build` then `npm run start`, and `next start` picks up
Railway's `PORT` on its own. **Nothing here has been deployed — this is the
procedure, not a report.** With a database now in play the steps are:

1. Add a PostgreSQL service. Railway supplies `DATABASE_URL`; reference it from
   the app service rather than copying the value.
2. Set `AUTH_SECRET` (a fresh `openssl rand -base64 33`, not the development
   one) and `AUTH_URL` (the deployed origin).
3. Set `RESEND_API_KEY`, `QUOTE_FROM_EMAIL` and `QUOTE_NOTIFICATION_EMAIL` once
   the Resend domain is verified. Left unset, the site still accepts and stores
   quote requests and records the emails as skipped.
4. Run `npx prisma migrate deploy` against the deployed database — as a release
   command or once from the Railway shell. The build does not migrate, so a
   deploy can never alter the schema by surprise.
5. Run `npm run owner:create -- you@example.com` from the Railway shell to
   create your account. Do not put a password in an environment variable that
   outlives the command.

No payment setup is needed; none exists.

**Do not put Next's static-export mode in `next.config.ts`** — not in a comment,
and not in a conditional branch that is switched off by default. Railway's
builder scans that file as text rather than evaluating it; if it finds the
setting it packages the app as a static site and then fails on a directory a
normal build never produces:

```
failed to compute cache key: "/app/out": not found
```

The shareable preview does need a static export. `npm run build:preview`
supplies that config for the length of one build and restores the file
afterwards, so the committed config stays deployable. `tests/deploy-config.spec.ts`
fails the suite if the setting ever reappears.

## Project structure

```
prisma/
  schema.prisma         Identity, organizations, quotes, abuse records
  migrations/           What has actually been applied
prisma.config.ts        Prisma 7 holds the datasource URL here, not in the schema
src/
  middleware.ts         Cookie check for /owner — a redirect, not the guard
  auth.ts               Auth.js: credentials provider, lockout, session policy
  app/
    layout.tsx          Document shell only: fonts and base metadata
    (site)/             Everything with the marketing header and footer
      layout.tsx        Header + footer chrome
      page.tsx          Homepage — composes the sections below
      printing-products/  Product catalogue: hero, search, sidebar, grid, CTA
        [slug]/         One product-detail page per catalogue product
      request-a-quote/  The quote form, and its confirmation page
      direct-mail/      Campaign explainer, converting to the quote form
      custom-design/    Design services explainer
      how-it-works/     The four-step process
      about/            What the business does and how it works
      contact/          Routes to the quote form; shows details once configured
      privacy-policy/   What happens to quote-form data
      terms-of-service/ Scoped to a brochure site with a quote form
    owner/              Staff area — its own shell, no marketing chrome, noindex
      login/            Sign in
      quotes/           Quote list, and one page per request
      actions.ts        Server Actions; each one authorizes before it reads
    not-found.tsx       Branded "coming in a later phase" page
    globals.css         Brand tokens (@theme) and base styles
  server/               Server-only. Never imported by a client component
    db.ts               Prisma client, created lazily so builds need no database
    crypto.ts           Password hashing, identifier hashing, signed cookies
    auth/guards.ts      The authorization boundary
    quotes/             Validation, submission, notification, confirmation
    email/              Transport and the two message templates
  content/              ← the seam for the future database
    site.ts             Brand details, primary nav, footer nav
    products.ts         The product catalogue, categories and search
    faqs.ts             Homepage FAQ copy
    photos.ts           Photography slots on the postcard mockups
    productDetails.ts   Per-product page content and option groups
  components/
    content/            Steps, FeatureGrid and Prose — shared by the content pages
    brand/              mark.ts (the tooth paths), ToothMark, Logo lockup
    ui/                 Container, Button, SectionHeading, icons
    layout/             Header (with mobile menu), Footer
    mockups/            Printed-product artwork, drawn as SVG
    home/               One component per homepage section
    products/           Catalogue view, search field, mobile filter dialog
                        and URL helpers
      detail/           The product-detail template: gallery, configurator,
                        artwork and custom-design blocks
public/photos/          Where licensed patient photography goes (see photos.ts)
scripts/build-preview.mjs  Static export for the preview, without touching the
                        deployed config
scripts/create-owner.mjs   Create or update a platform-admin account
docs/screenshots/       Screenshots of the built pages
tests/                  Playwright suite, run against a real PostgreSQL
```

### Why filters live in the URL

Search and category on `/printing-products` are held in the query string
(`?q=…&category=…`), not in React state. Category options are therefore plain
links: keyboard-navigable and shareable for free, with "Shop All Products"
clearing everything simply by pointing at the bare route.

The page reads those parameters on the **server**, per request — awaiting
`searchParams` in `page.tsx` is what opts the route into that. So the HTML that
arrives is already filtered, with the right product count and the right empty
state, before any JavaScript runs. Crawlers and no-JS visitors see the same
thing, and a filtered link never flashes the full catalogue.

The static export used for the shareable preview has no request to read, so
there the page is prerendered unfiltered and the client applies the URL — the
one place the old flash remains. `useCatalogFilters` reads the URL first and
the server's values second, which keeps one component correct in both.

### One product-detail template

`/printing-products/[slug]` renders every product through a single template.
What differs between products is data in `src/content/productDetails.ts`, never
layout: gallery views, customization and detail copy are declared per product,
and a section with no data simply is not rendered. Only Business Cards is
authored so far; the other eleven fall back to their catalogue entry and get
their name, artwork and a quote action without inventing anything.

**No specifications or prices are authored anywhere.** `customization` lists the
dimensions a job is specified by — "Size", "Paper type and finish", "Quantity" —
which are the questions we ask, never the answers. Claiming a particular stock
or weight is available is not ours to say until the supplier confirms it, and a
test fails the build if a paper weight or turnaround time appears on the page.

These pages carry no form controls at all. The product page's job is to explain
the product and send the visitor to the quote form, so there is nothing to
configure and nothing disabled implying that configuring is coming. Supplier
costs and retail prices must never be written into this module: it is imported
by client components, so any value in it ships to the browser.

### Why `src/content` matters

Every product name, nav link and FAQ answer is plain typed data, not JSX buried
in a component. When the admin dashboard takes over, each export is replaced by a
Prisma query returning the same shape and **no component changes**. This is also
why the codebase contains no prices: retail pricing will be owned by the admin
dashboard and editable without touching source, as required.

The quote form already relies on this. `src/content/quoteOptions.ts` derives its
printing options from the same `products` array the catalogue renders, so there
is no second list to keep in step, and the server validates the submitted
product against it.

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

- **Home**, fully responsive, verified at 360px, 390px, 768px, 1280px and 1440px
- **Printing Products** (`/printing-products`): all 12 products, working search,
  category filtering from the desktop sidebar and a mobile Filter Products
  dialog, an empty state and Clear Search — all resolved server-side, so a
  filtered URL arrives filtered
- **Product pages** for all 12 products at `/printing-products/<slug>`, with a
  keyboard-operable gallery. Customization is explained in prose; there are no
  form controls on these pages at all
- **Request a Quote** (`/request-a-quote`): validated on the server, saved to
  PostgreSQL, owner notification and customer confirmation emailed, confirmation
  page with the real reference. Every quote button across the site opens it with
  the right product selected. No account needed, and none offered
- **Direct Mail**, **Custom Design**, **How It Works**, **About**, **Contact**,
  **Privacy Policy**, **Terms of Service**
- **Owner area** (`/owner`): sign-in, quote list, per-request detail, status
  changes, internal notes, per-recipient email state with retry
- Every link in the header and footer resolves to a real page — enforced by a
  test that crawls them

All of it is verified by the Playwright suite against a real PostgreSQL:
persistence, both emails, authorization, session revocation, role separation and
both rate limiters are exercised, not mocked. **Delivery to a real inbox is the
one thing not tested**, because no Resend credential exists here.

### Deliberately not built

Customer accounts, customer login, shopping cart, checkout, payments, customer
dashboard, online proof management, order tracking, online pricing or
configuration, and an admin dashboard. These are **not** "coming soon" — the
business sells by quote, and no part of the UI may imply otherwise.

The database carries organization, location and membership tables from an
earlier design. They are unused, and no interface creates them. They cost
nothing to leave in place and would be the right shape if practice accounts are
ever wanted; until then a quote request stands entirely on its own.

### The owner area is frozen

`/owner` is an internal utility for reading quote requests, changing a status and
adding a note. It is not an admin platform and should not grow into one. Product
data, pricing and customers all stay out of it.

## Rules the public site holds to

These are enforced by tests, not just convention:

- **No ecommerce chrome.** No cart, no account link, no search box, no disabled
  "configure your order" controls. A test asserts each is absent.
- **No dead links.** A test crawls every header and footer link and fails if any
  returns an error or lands on the 404 page.
- **No invented specifics.** No paper weights, coatings, turnaround times,
  prices, testimonials, customer counts or guaranteed marketing results appear
  anywhere. Product pages name the *dimensions* a job is specified by — "Size",
  "Paper type and finish" — never claimed stock.
- **No supplier information.** Supplier identity, wholesale costs and margins
  never appear in customer-facing code.
- **No invented contact details.** `contact` in `src/content/site.ts` is empty
  until real values are supplied; components omit the row rather than fill it in.
- **Request a Quote is the primary action** on every page that has one.

## Planned next

1. Owner supplies real contact details for `src/content/site.ts`
2. Legal review of the Privacy Policy and Terms drafts
3. Deploy to Railway and configure the production environment

Supplier orders are submitted manually; no supplier API is assumed. Supplier
identity, wholesale costs and margins never appear in customer-facing code.

Patient photography is deferred by decision, not blocked: the postcard mockups
keep their graphic treatment, and `src/content/photos.ts` holds the slots and the
licensing bar a photo has to clear before it goes in one.
