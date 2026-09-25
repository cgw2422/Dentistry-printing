import type { Metadata } from "next";
import Link from "next/link";
import { Prose } from "@/components/content/Prose";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { PageHero } from "@/components/ui/PageHero";

export const metadata: Metadata = {
  title: "Terms of Service | Dentistry Printing",
  description:
    "The terms that apply to using the Dentistry Printing website and requesting a quote.",
};

const LAST_UPDATED = "September 2026";

/**
 * Scoped to what this site does today: it is a brochure site with a quote
 * form. There is no cart, no checkout and no payment handling, so these terms
 * deliberately do not pretend to govern a transaction.
 */
const SECTIONS = [
  {
    heading: "What these terms cover",
    body: [
      <>
        These terms apply to your use of the Dentistry Printing website and to quote requests you
        send through it. By using the site or submitting the quote form, you agree to them.
      </>,
      <>
        They do not govern a printing order. Any work we actually do for you is governed by the
        quote we send and accept in writing, which will set out the specification, price and terms
        for that job.
      </>,
    ],
  },
  {
    heading: "A quote request is not an order",
    body: [
      <>
        Submitting the form starts a conversation. It does not place an order, reserve production
        capacity, or create a contract, and it does not oblige either of us to proceed.
      </>,
      <>
        Nothing on this website is an offer to sell at a stated price. No prices are published
        here, precisely because printing costs depend on the specification of the job. A price
        becomes binding when we put it in a written quote and you accept it.
      </>,
    ],
  },
  {
    heading: "Quotes",
    body: [
      <>
        A quote is based on the information you give us. If the specification changes — quantity,
        size, stock, finish, mailing area or artwork — the price may change with it, and we will
        tell you before proceeding.
      </>,
      <>
        Quotes are valid for the period stated on them. Where no period is stated, treat a quote as
        open for 30 days.
      </>,
    ],
  },
  {
    heading: "Artwork and proofs",
    body: [
      <>
        If you supply artwork, you confirm that you own it or have the right to use it, and that it
        does not infringe anyone else&apos;s rights. You are responsible for the content of what you
        ask us to print, including any claims it makes.
      </>,
      <>
        Every job is proofed before production. Once you approve a proof, that approved artwork is
        what prints — please check spelling, contact details, licence numbers and any offer terms
        carefully, because reprints for errors approved at proof stage are chargeable.
      </>,
      <>
        Where we create artwork for you as part of a paid design service, the rights in the
        finished piece pass to you once the job is paid for.
      </>,
    ],
  },
  {
    heading: "Printing realities",
    body: [
      <>
        Printed colour varies slightly from what a screen displays, and between print runs.
        Reasonable variation in colour, trim position and quantity is normal in commercial printing
        and is not a defect.
      </>,
      <>
        Where a delivery date matters to you, tell us before we start and we will confirm in the
        quote what is achievable. We do not guarantee a delivery date that is not written into an
        accepted quote.
      </>,
    ],
  },
  {
    heading: "Direct mail",
    body: [
      <>
        For mail campaigns, you are responsible for the accuracy of the offer and any claims in the
        piece, and for ensuring the campaign complies with the advertising and professional-conduct
        rules that apply to your practice. Delivery timing within the postal system is outside our
        control.
      </>,
      <>
        We do not guarantee any level of response, enquiries or new patients from a campaign. No
        marketing result is promised anywhere on this site.
      </>,
    ],
  },
  {
    heading: "Using this website",
    body: [
      <>
        Please use the site for its purpose: learning about our products and requesting a quote. Do
        not attempt to gain unauthorised access to any part of it, interfere with its operation,
        submit automated or fraudulent requests, or use it to send unlawful content.
      </>,
      <>
        The site&apos;s text, artwork, branding and product illustrations belong to Dentistry
        Printing and may not be copied or reused without permission.
      </>,
    ],
  },
  {
    heading: "Accuracy",
    body: [
      <>
        We keep the site accurate, but product descriptions are general. Specifications, available
        options and pricing are confirmed in your quote, and the quote governs if the two ever
        disagree.
      </>,
    ],
  },
  {
    heading: "Liability",
    body: [
      <>
        The website is provided as it is. To the extent the law allows, we are not liable for
        indirect or consequential loss — including lost profits or lost business — arising from use
        of this site.
      </>,
      <>
        Our responsibility for a printing job is governed by the accepted quote for that job, not
        by these website terms.
      </>,
    ],
  },
  {
    heading: "Changes",
    body: [
      <>
        We may update these terms as the site develops. The version published here is the one that
        applies, and the date below tells you when it last changed.
      </>,
    ],
  },
  {
    heading: "Contact",
    body: [
      <>
        Questions about these terms can be sent through our{" "}
        <Link
          href="/contact"
          className="font-semibold text-teal-700 underline-offset-4 hover:underline"
        >
          contact page
        </Link>
        .
      </>,
    ],
  },
];

export default function TermsOfServicePage() {
  return (
    <>
      <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Terms of Service" }]} />

      <PageHero
        eyebrow={`Last updated ${LAST_UPDATED}`}
        title="Terms of Service"
        body="The terms that apply to using this website and requesting a quote."
        primary={null}
      />

      <Prose
        sections={SECTIONS}
        footnote="These terms describe how we intend to work, in plain language. They are not legal advice and have not been reviewed by an attorney. Have a qualified lawyer review them before you rely on them commercially."
      />
    </>
  );
}
