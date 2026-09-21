import { ToothMark } from "@/components/brand/ToothMark";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export function FinalCta() {
  return (
    <section className="bg-white pb-10 sm:pb-14 lg:pb-20">
      <Container>
        <div className="relative overflow-hidden rounded-3xl bg-navy px-6 py-9 sm:px-10 sm:py-12 lg:px-14 lg:py-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-teal/20 blur-3xl"
          />

          <div className="relative flex flex-col gap-6 sm:gap-7 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
            <div className="flex items-start gap-4 sm:gap-6">
              <ToothMark variant="light" className="h-12 w-auto shrink-0 sm:h-16" />
              <div>
                <h2 className="text-balance-tight text-[1.625rem] font-extrabold leading-[1.15] tracking-[-0.02em] text-white sm:text-[2rem] lg:text-[2.5rem]">
                  Ready to Put Your Practice in Print?
                </h2>
                <p className="mt-3 max-w-lg text-[0.9375rem] leading-relaxed text-sky-100/85 sm:text-base">
                  Explore our printing products or tell us what you need. We&apos;ll help you find
                  the right solution for your practice.
                </p>
              </div>
            </div>

            <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
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
                href="/request-a-quote"
                variant="ghostOnDark"
                size="lg"
                className="w-full sm:w-auto"
              >
                Request a Quote
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
