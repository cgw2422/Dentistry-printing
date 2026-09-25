import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { CheckCircleIcon, MailIcon, PencilIcon, PrinterIcon } from "@/components/ui/icons";
import { contact } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact | Dentistry Printing",
  description:
    "Get in touch with Dentistry Printing. Send a quote request with the details of your job and we'll come back with pricing and options.",
};

const REASONS = [
  {
    icon: PrinterIcon,
    title: "Pricing for a print job",
    detail: "Business cards, appointment cards, brochures, letterhead — anything in the catalogue.",
  },
  {
    icon: MailIcon,
    title: "A direct mail campaign",
    detail: "Tell us the area you want to reach and roughly how many households.",
  },
  {
    icon: PencilIcon,
    title: "Design work",
    detail: "Whether you have brand files ready or are starting from scratch.",
  },
  {
    icon: CheckCircleIcon,
    title: "Something else",
    detail: "Not sure what you need yet? Describe the problem and we'll work it out.",
  },
];

export default function ContactPage() {
  const hasDirectDetails = Boolean(contact.email || contact.phone || contact.location);

  return (
    <>
      <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Contact" }]} />

      <PageHero
        eyebrow="Contact"
        title="Tell Us What You"
        highlight="Need Printed."
        body="The quote form is the fastest way to reach us. It asks for the details needed to price a job, so the first reply you get is an actual answer rather than a request for more information."
        secondary={{ label: "How It Works", href: "/how-it-works" }}
      />

      <section className="bg-white py-10 sm:py-14 lg:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] lg:gap-14">
            <div>
              <h2 className="heading-rule text-[1.75rem] font-bold tracking-[-0.02em] text-navy sm:text-4xl">
                What to get in touch about
              </h2>
              <ul className="mt-7 grid gap-5 sm:grid-cols-2">
                {REASONS.map(({ icon: Icon, title, detail }) => (
                  <li key={title} className="flex flex-col gap-2">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-teal">
                      <Icon className="h-6 w-6" />
                    </span>
                    <h3 className="text-[1.0625rem] font-bold leading-snug text-navy">{title}</h3>
                    <p className="text-[0.9375rem] leading-relaxed text-muted">{detail}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl bg-sky-50 p-6 ring-1 ring-line sm:p-8">
              <h2 className="text-xl font-bold text-navy sm:text-2xl">Send a quote request</h2>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">
                No account needed. Share your practice details and what you are looking to print,
                and we will review it and follow up with pricing and available options.
              </p>
              <Button
                href="/request-a-quote"
                variant="onDark"
                size="lg"
                withArrow
                className="mt-6 w-full"
              >
                Request a Quote
              </Button>

              {hasDirectDetails && (
                <dl className="mt-6 flex flex-col gap-3 border-t border-line pt-6 text-[0.9375rem]">
                  {contact.email && (
                    <div className="flex flex-col gap-0.5">
                      <dt className="font-semibold text-navy">Email</dt>
                      <dd>
                        <a
                          href={`mailto:${contact.email}`}
                          className="text-teal-700 underline-offset-4 hover:underline"
                        >
                          {contact.email}
                        </a>
                      </dd>
                    </div>
                  )}
                  {contact.phone && (
                    <div className="flex flex-col gap-0.5">
                      <dt className="font-semibold text-navy">Phone</dt>
                      <dd>
                        <a
                          href={`tel:${contact.phone.replace(/[^+\d]/g, "")}`}
                          className="text-teal-700 underline-offset-4 hover:underline"
                        >
                          {contact.phone}
                        </a>
                      </dd>
                    </div>
                  )}
                  {contact.location && (
                    <div className="flex flex-col gap-0.5">
                      <dt className="font-semibold text-navy">Based in</dt>
                      <dd className="text-muted">{contact.location}</dd>
                    </div>
                  )}
                </dl>
              )}

              <p className="mt-6 text-sm leading-relaxed text-muted">
                We use your details only to respond to your request — see our{" "}
                <Link
                  href="/privacy-policy"
                  className="font-semibold text-teal-700 underline-offset-4 hover:underline"
                >
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
