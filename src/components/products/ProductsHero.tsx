import { Suspense } from "react";
import { CatalogHeroArrangement } from "@/components/mockups/arrangements";
import { Container } from "@/components/ui/Container";
import { PencilIcon, PrinterIcon, TruckIcon } from "@/components/ui/icons";
import { ProductSearch } from "./ProductSearch";
import { ProductSearchFallback } from "./ProductSearchFallback";

const highlights = [
  { icon: TruckIcon, title: "Nationwide", detail: "Fulfillment" },
  { icon: PencilIcon, title: "Custom Design", detail: "Services" },
  { icon: PrinterIcon, title: "Professional", detail: "Printing" },
];

export function ProductsHero() {
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-sky-50 via-sky-50 to-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-48 h-[34rem] w-[34rem] rounded-full bg-sky-100/70 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-40 h-[26rem] w-[26rem] rounded-full bg-teal-50 blur-3xl"
      />

      <Container className="relative">
        <div className="grid items-center gap-7 py-8 sm:gap-10 sm:py-12 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,1fr)] lg:gap-10 lg:py-14">
          <div className="flex flex-col">
            <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-navy/70 sm:text-xs sm:tracking-[0.22em]">
              Printing Products for Dental Practices
            </p>

            <h1 className="text-balance-tight mt-4 text-[2rem] font-extrabold leading-[1.1] tracking-[-0.03em] text-navy sm:text-[2.75rem] lg:text-[3.25rem]">
              High-Quality Printing for Every Part of <span className="text-teal">Your Practice.</span>
            </h1>

            <p className="mt-4 max-w-lg text-base leading-relaxed text-muted sm:mt-5 sm:text-lg">
              From business cards to brochures, find professional printing designed specifically
              for dental offices.
            </p>

            <div className="mt-6 sm:mt-7">
              {/* useSearchParams needs a boundary so the rest of the hero can
                  still be prerendered. */}
              <Suspense fallback={<ProductSearchFallback />}>
                <ProductSearch />
              </Suspense>
            </div>

            <ul className="mt-8 grid grid-cols-3 gap-x-3 gap-y-5 sm:gap-x-6 lg:mt-9">
              {highlights.map(({ icon: Icon, title, detail }) => (
                <li key={title} className="flex flex-col items-start gap-2 sm:flex-row sm:gap-3">
                  <Icon className="h-6 w-6 shrink-0 text-teal sm:h-7 sm:w-7" />
                  <span className="text-[0.8125rem] font-semibold leading-snug text-navy sm:text-[0.9375rem]">
                    {title}
                    <span className="block font-medium text-muted">{detail}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative -mx-2 sm:-mx-1 lg:mx-0 lg:-mr-8 2xl:-mr-20">
            <CatalogHeroArrangement className="h-auto w-full" />
          </div>
        </div>
      </Container>
    </section>
  );
}
