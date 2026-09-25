import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

/**
 * A genuine 404: a mistyped URL, or a link from elsewhere that no longer
 * resolves. Nothing in the site's own navigation points here — every nav and
 * footer entry is a page that exists. The job is to get a lost visitor back to
 * something useful rather than leave them on an unstyled error.
 */
export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main">
    <section className="bg-linear-to-b from-sky-50 to-white py-20 sm:py-28">
      <Container>
        <div className="mx-auto flex max-w-xl flex-col items-start gap-5 text-left sm:items-center sm:text-center">
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-teal-700">
            Page not found
          </p>
          <h1 className="text-balance-tight text-3xl font-extrabold leading-tight tracking-[-0.025em] text-navy sm:text-4xl">
            We couldn&apos;t find that page.
          </h1>
          <p className="text-[0.9375rem] leading-relaxed text-muted sm:text-base">
            The link may be out of date, or the address mistyped. Browse our printing products, or
            tell us what you need and we will quote it.
          </p>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Button href="/request-a-quote" variant="onDark" size="lg" withArrow>
              Request a Quote
            </Button>
            <Button href="/printing-products" variant="secondary" size="lg">
              Browse Printing Products
            </Button>
          </div>
        </div>
      </Container>
    </section>
      </main>
      <Footer />
    </>
  );
}
