import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

/**
 * Phase 1 ships the homepage only. Every other route in the navigation lands
 * here until its page is built, so the site never drops a visitor on an
 * unstyled 404 while the rest of the site is under construction.
 */
export default function NotFound() {
  return (
    <section className="bg-linear-to-b from-sky-50 to-white py-20 sm:py-28">
      <Container>
        <div className="mx-auto flex max-w-xl flex-col items-start gap-5 text-left sm:items-center sm:text-center">
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-teal-700">
            Coming in a later phase
          </p>
          <h1 className="text-balance-tight text-3xl font-extrabold leading-tight tracking-[-0.025em] text-navy sm:text-4xl">
            This page hasn&apos;t been built yet.
          </h1>
          <p className="text-[0.9375rem] leading-relaxed text-muted sm:text-base">
            The Dentistry Printing homepage is live for review. Product pages, direct mail,
            accounts and checkout are scheduled for the next phases of the build.
          </p>
          <Button href="/" variant="onDark" size="lg" withArrow className="w-full sm:w-auto">
            Back to the homepage
          </Button>
        </div>
      </Container>
    </section>
  );
}
