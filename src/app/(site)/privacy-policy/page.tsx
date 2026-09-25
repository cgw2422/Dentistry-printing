import type { Metadata } from "next";
import Link from "next/link";
import { Prose } from "@/components/content/Prose";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { PageHero } from "@/components/ui/PageHero";
import { contact } from "@/content/site";

export const metadata: Metadata = {
  title: "Privacy Policy | Dentistry Printing",
  description:
    "How Dentistry Printing handles the information you send through a quote request.",
};

/**
 * Written to describe what this site actually does, and nothing more: one
 * quote form, stored in our own database, with two emails sent about it. When
 * the site gains a capability, this page changes with it.
 */
const LAST_UPDATED = "September 2026";

const SECTIONS = [
  {
    heading: "The short version",
    body: [
      <>
        We collect the details you type into the quote form, we store them so your request is not
        lost, and we use them to reply to you about that request. We do not sell your information,
        we do not add you to a marketing list, and there are no advertising trackers on this site.
      </>,
    ],
  },
  {
    heading: "What we collect",
    body: [
      <>
        When you submit a quote request we collect the practice name, contact name, email address
        and phone number you provide, together with the details of the job itself — the product,
        quantity, specifications, shipping ZIP code, and anything you tell us in the notes. If you
        give us a practice website or a desired delivery date, we collect that too.
      </>,
      <>
        We also record the time you submitted the form and your consent to be contacted about it.
        For protection against automated abuse we store a one-way cryptographic hash of your IP
        address. That hash lets us count how many requests came from one connection; it is not
        reversible, and we do not keep the address itself.
      </>,
      <>
        We do not ask for and do not want patient information, medical records, payment card
        details, or any other sensitive data. Please do not include any of that in a quote request.
      </>,
    ],
  },
  {
    heading: "Why we collect it",
    body: [
      <>
        Solely to price your job and get back to you about it. Your details are used to prepare a
        quote, to ask follow-up questions if we need to, and to carry out the work if you go ahead.
      </>,
      <>
        We do not use your information for advertising, we do not build a profile from it, and
        submitting a quote request does not sign you up for promotional email or text messages.
      </>,
    ],
  },
  {
    heading: "Who can see it",
    body: [
      <>
        Quote requests are visible only to Dentistry Printing staff, through a password-protected
        internal area. They are not published, not searchable, and not reachable from any public
        page or link.
      </>,
      <>
        To actually fulfil a job we share what is necessary with the production and fulfilment
        partners printing and shipping your order — typically the artwork and the delivery address.
        We share the minimum required to complete the work.
      </>,
      <>
        We use a third-party email provider to deliver the notification and confirmation emails
        described below, and a third-party hosting provider that operates the servers and database
        this site runs on. We may also disclose information where the law requires it.
      </>,
      <>We do not sell, rent or trade your information to anyone.</>,
    ],
  },
  {
    heading: "Emails we send",
    body: [
      <>
        Submitting the quote form triggers exactly two emails: one to us announcing your request,
        and one to you confirming we received it and giving you a reference number. That is the
        whole of it. You are not enrolled in any mailing list, and any further email is a person
        replying to your request.
      </>,
    ],
  },
  {
    heading: "Cookies",
    body: [
      <>
        This site does not use advertising or analytics cookies. After you submit a quote request
        we set one short-lived, signed cookie holding your reference number, so the confirmation
        page can show it to you. It expires on its own and is used for nothing else.
      </>,
      <>
        If you sign in to the internal staff area, a session cookie keeps you signed in. That
        applies to Dentistry Printing staff only; there are no customer accounts on this site.
      </>,
    ],
  },
  {
    heading: "How long we keep it",
    body: [
      <>
        We keep quote requests for as long as they are useful as a business record — to service
        repeat work, to honour a previous quote, and to meet our accounting obligations. If you
        would like your request deleted, ask us and we will remove it, except where we are required
        to retain a record.
      </>,
    ],
  },
  {
    heading: "Your choices",
    body: [
      <>
        You can ask us what we hold about you, ask us to correct it, or ask us to delete it. Get in
        touch through the{" "}
        <Link
          href="/contact"
          className="font-semibold text-teal-700 underline-offset-4 hover:underline"
        >
          contact page
        </Link>{" "}
        and we will deal with it.
      </>,
    ],
  },
  {
    heading: "Children",
    body: [
      <>
        This site is intended for dental practices and the people who run them. It is not directed
        at children, and we do not knowingly collect information from them.
      </>,
    ],
  },
  {
    heading: "Changes",
    body: [
      <>
        If what we do with your information changes, this page changes with it, and the date below
        is updated. This site is new and deliberately simple; we will keep this page matching
        reality rather than describing capabilities we do not have.
      </>,
    ],
  },
  {
    heading: "Contact us",
    body: [
      contact.email ? (
        <>
          Questions about this policy can go to{" "}
          <a
            href={`mailto:${contact.email}`}
            className="font-semibold text-teal-700 underline-offset-4 hover:underline"
          >
            {contact.email}
          </a>
          .
        </>
      ) : (
        <>
          Questions about this policy can be sent through our{" "}
          <Link
            href="/contact"
            className="font-semibold text-teal-700 underline-offset-4 hover:underline"
          >
            contact page
          </Link>
          .
        </>
      ),
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]} />

      <PageHero
        eyebrow={`Last updated ${LAST_UPDATED}`}
        title="Privacy Policy"
        body="What happens to the information you send us through a quote request."
        primary={null}
      />

      <Prose
        sections={SECTIONS}
        footnote="This policy describes our own practices in plain language. It is not legal advice, and it is not a substitute for review by a qualified attorney familiar with the rules that apply to your business."
      />
    </>
  );
}
