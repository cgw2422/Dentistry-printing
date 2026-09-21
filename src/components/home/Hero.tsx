import { HeroArrangement } from "@/components/mockups/arrangements";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PencilIcon, PrinterIcon, TruckIcon } from "@/components/ui/icons";

const highlights = [
  { icon: TruckIcon, title: "Nationwide", detail: "Fulfillment" },
  { icon: PencilIcon, title: "Custom Design", detail: "Services" },
  { icon: PrinterIcon, title: "Professional", detail: "Printing" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-sky-50 via-sky-50 to-white">
      {/* Soft brand shapes instead of a photographic backdrop. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-48 h-[34rem] w-[34rem] rounded-full bg-sky-100/70 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-40 h-[26rem] w-[26rem] rounded-full bg-teal-50 blur-3xl"
      />

      <Container className="relative">
        <div className="grid items-center gap-10 py-10 sm:py-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-8 lg:py-20">
          <div className="flex flex-col">
            <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-navy/70 sm:text-xs sm:tracking-[0.22em]">
              Printing &amp; Direct Mail for Dental Practices
            </p>

            <h1 className="text-balance-tight mt-4 text-[2.125rem] font-extrabold leading-[1.08] tracking-[-0.03em] text-navy sm:text-5xl lg:text-[3.5rem]">
              Professional Printing for <span className="text-teal">Dental Practices.</span>
            </h1>

            <p className="mt-5 max-w-lg text-base leading-relaxed text-muted sm:text-lg">
              From everyday practice essentials to complete new-patient direct-mail campaigns,
              we make professional dental printing simple.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
              <Button
                href="/printing-products"
                variant="onDark"
                size="lg"
                withArrow
                className="w-full sm:w-auto"
              >
                Shop Printing Products
              </Button>
              <Button
                href="/direct-mail"
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto"
              >
                Start a Direct Mail Campaign
              </Button>
            </div>

            <ul className="mt-9 grid grid-cols-3 gap-x-3 gap-y-5 sm:gap-x-6 lg:mt-10">
              {highlights.map(({ icon: Icon, title, detail }) => (
                <li key={title} className="flex flex-col items-start gap-2 sm:flex-row sm:gap-3">
                  <Icon className="h-6 w-6 shrink-0 text-teal sm:h-7 sm:w-7" />
                  <span className="text-[0.8125rem] font-semibold leading-snug text-navy sm:text-sm">
                    {title}
                    <span className="block font-medium text-muted">{detail}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative -mx-1 mt-2 lg:mx-0 lg:mt-0">
            <HeroArrangement className="h-auto w-full" />
          </div>
        </div>
      </Container>
    </section>
  );
}
