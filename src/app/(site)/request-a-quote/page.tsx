import { randomUUID } from "node:crypto";
import type { Metadata } from "next";
import { QuoteForm } from "@/components/quote/QuoteForm";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { CheckCircleIcon, PencilIcon, TruckIcon } from "@/components/ui/icons";
import { findQuoteOption } from "@/content/quoteOptions";

export const metadata: Metadata = {
  title: "Request a Quote",
  description:
    "Request a personalized quote for printing, design services, or direct mail for your dental practice.",
};

const STEPS = [
  {
    icon: PencilIcon,
    title: "Tell us about your project",
    body: "Share what you need printed, how much of it, and anything you already have ready.",
  },
  {
    icon: CheckCircleIcon,
    title: "We review the details",
    body: "We check what is possible, confirm the options available, and put together your pricing.",
  },
  {
    icon: TruckIcon,
    title: "We follow up with you",
    body: "You get a quote covering printing, any design work, and nationwide fulfillment.",
  },
];

export default async function RequestAQuotePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const raw = params.product;
  // A ?product= value only counts if it names something in the catalogue;
  // anything else is ignored rather than carried into the form.
  const option = findQuoteOption(Array.isArray(raw) ? raw[0] : raw);

  return (
    <>
      <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Request a Quote" }]} />

      <section className="bg-linear-to-b from-sky-50 to-white py-8 sm:py-12 lg:py-14">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:items-start lg:gap-14">
            {/*
              The form is much taller than this column, so on wide screens the
              introduction follows the customer down rather than leaving a long
              empty margin beside the fields.
            */}
            <div className="lg:sticky lg:top-[calc(var(--header-h,68px)+2.5rem)]">
              <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-navy/70 sm:text-xs sm:tracking-[0.22em]">
                Custom Printing &amp; Direct Mail
              </p>
              <h1 className="text-balance-tight mt-3 text-[2rem] font-extrabold leading-[1.1] tracking-[-0.03em] text-navy sm:text-[2.5rem] lg:text-[3rem]">
                Tell Us What Your Practice Needs.
              </h1>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
                Request a personalized quote for printing, design services, or direct mail. Tell us
                about your project, and we&apos;ll review the details and follow up with pricing and
                available options.
              </p>

              <ol className="mt-8 flex flex-col gap-5">
                {STEPS.map(({ icon: Icon, title, body }, index) => (
                  <li key={title} className="flex gap-4">
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal text-[0.9375rem] font-bold text-white">
                      {index + 1}
                    </span>
                    <div>
                      <h2 className="flex items-center gap-2 text-[0.9375rem] font-bold text-navy">
                        <Icon className="h-5 w-5 text-teal" />
                        {title}
                      </h2>
                      <p className="mt-1 text-sm leading-relaxed text-muted">{body}</p>
                    </div>
                  </li>
                ))}
              </ol>

              <p className="mt-8 rounded-2xl bg-white px-5 py-4 text-sm leading-relaxed text-muted ring-1 ring-line">
                Prefer to talk it through? Practice phone and email will appear here once they are
                configured.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-card ring-1 ring-line sm:p-7 lg:p-8">
              <QuoteForm initialProduct={option?.key ?? ""} submissionToken={randomUUID()} />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
