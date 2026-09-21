import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { CheckCircleIcon } from "@/components/ui/icons";
import { unsign } from "@/server/crypto";
import { CONFIRMATION_COOKIE } from "@/server/quotes/confirmation";

export const metadata: Metadata = {
  title: "Quote Request Received",
  robots: { index: false, follow: false },
};

/**
 * Shown after a successful submission.
 *
 * The reference comes from a signed, HttpOnly cookie set by the Server Action
 * — never from the URL — so one practice cannot read another's confirmation by
 * guessing an id. Opening the page without that cookie still gives a safe,
 * generic confirmation with a way back to the form.
 */
export default async function ConfirmationPage() {
  const cookieStore = await cookies();
  const reference = unsign(cookieStore.get(CONFIRMATION_COOKIE)?.value);

  return (
    <section className="bg-linear-to-b from-sky-50 to-white py-14 sm:py-20 lg:py-24">
      <Container>
        <div className="mx-auto flex max-w-2xl flex-col items-start gap-5 rounded-2xl bg-white p-7 text-left shadow-card ring-1 ring-line sm:items-center sm:p-10 sm:text-center">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-teal-50 text-teal ring-1 ring-teal/20">
            <CheckCircleIcon className="h-8 w-8" />
          </span>

          <h1 className="text-balance-tight text-[1.75rem] font-extrabold leading-tight tracking-[-0.025em] text-navy sm:text-[2.25rem]">
            Your Quote Request Has Been Received!
          </h1>
          <p className="text-[0.9375rem] leading-relaxed text-muted sm:text-base">
            Thank you for contacting Dentistry Printing. We&apos;ll review your project details and
            follow up with you.
          </p>

          {reference ? (
            <p className="w-full rounded-xl bg-sky-50 px-5 py-4 text-sm text-navy ring-1 ring-inset ring-teal/20">
              Your reference is{" "}
              <strong className="font-bold tracking-wide">{reference}</strong>. We have emailed a
              copy to the address you gave us.
            </p>
          ) : (
            <p className="w-full rounded-xl bg-mist px-5 py-4 text-sm leading-relaxed text-muted ring-1 ring-inset ring-line">
              If you have just sent a request, a copy is on its way to the email address you gave
              us. Need to send another?{" "}
              <a href="/request-a-quote" className="font-semibold text-teal-700 underline-offset-4 hover:underline">
                Open the quote form
              </a>
              .
            </p>
          )}

          <div className="mt-2 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Button href="/" variant="onDark" size="lg" withArrow className="w-full sm:w-auto">
              Return to Home
            </Button>
            <Button href="/printing-products" variant="secondary" size="lg" className="w-full sm:w-auto">
              Explore Printing Products
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
