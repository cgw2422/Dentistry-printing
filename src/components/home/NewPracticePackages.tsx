import { StationerySet } from "@/components/mockups/arrangements";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export function NewPracticePackages() {
  return (
    <section className="bg-sky-50 py-14 sm:py-16 lg:py-20">
      <Container>
        <div className="grid items-center gap-9 lg:grid-cols-2 lg:gap-14">
          <div className="flex flex-col">
            <h2 className="heading-rule text-balance-tight text-[1.75rem] font-bold leading-[1.15] tracking-[-0.02em] text-navy sm:text-4xl lg:text-[2.5rem]">
              Opening a New Practice? Start With the Essentials.
            </h2>
            <p className="mt-5 max-w-xl text-[0.9375rem] leading-relaxed text-muted sm:text-base">
              Get coordinated printing for your new location, from business cards and appointment
              reminders to patient brochures and opening-announcement postcards.
            </p>

            <div className="mt-8 lg:hidden">
              <StationerySet className="h-auto w-full" />
            </div>

            <div className="mt-8 flex lg:mt-9">
              <Button
                href="/new-practice-packages"
                variant="onDark"
                size="lg"
                withArrow
                className="w-full sm:w-auto"
              >
                Explore New Practice Packages
              </Button>
            </div>
          </div>

          <div className="hidden lg:block">
            <StationerySet className="h-auto w-full" />
          </div>
        </div>
      </Container>
    </section>
  );
}
