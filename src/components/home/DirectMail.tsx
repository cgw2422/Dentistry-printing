import { DirectMailArrangement } from "@/components/mockups/arrangements";
import { Button, TextLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { MailIcon, MapPinIcon, PencilIcon } from "@/components/ui/icons";

const steps = [
  { icon: MapPinIcon, label: "Tell us where you want to reach." },
  { icon: PencilIcon, label: "Approve your custom design." },
  { icon: MailIcon, label: "We coordinate printing and mailing." },
];

export function DirectMail() {
  return (
    <section className="relative overflow-hidden bg-navy py-10 sm:py-14 lg:py-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-10 h-[24rem] w-[24rem] rounded-full bg-teal/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 bottom-0 h-[20rem] w-[20rem] rounded-full bg-sky/10 blur-3xl"
      />

      <Container className="relative">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
          <div className="flex flex-col">
            <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-sky sm:text-xs sm:tracking-[0.22em]">
              Reach More Local Households
            </p>
            <h2 className="text-balance-tight mt-4 text-[1.875rem] font-extrabold leading-[1.12] tracking-[-0.025em] text-white sm:text-4xl lg:text-[2.75rem]">
              Put Your Practice in Their Mailbox.
            </h2>
            <p className="mt-4 max-w-xl text-[0.9375rem] leading-relaxed text-sky-100/85 sm:mt-5 sm:text-base lg:text-[1.0625rem]">
              Reach households around your dental practice with professionally designed, printed,
              and mailed postcards. We coordinate the campaign from artwork through mailing
              preparation and fulfillment.
            </p>

            {/* Mockup sits between copy and steps on mobile, matching the reference. */}
            <div className="mt-7 lg:hidden">
              <DirectMailArrangement className="h-auto w-full" />
            </div>

            <ol className="mt-7 grid grid-cols-3 gap-3 sm:mt-9 sm:gap-5">
              {steps.map(({ icon: Icon, label }, index) => (
                <li key={label} className="flex flex-col items-center gap-2.5 text-center">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-teal text-sm font-bold text-white">
                    {index + 1}
                  </span>
                  <Icon className="h-6 w-6 text-sky" />
                  <span className="text-xs leading-snug text-sky-100/85 sm:text-sm lg:text-[0.9375rem]">
                    {label}
                  </span>
                </li>
              ))}
            </ol>

            <div className="mt-7 flex flex-col items-center gap-4 sm:mt-9 sm:flex-row sm:items-center lg:justify-start">
              <Button
                href="/direct-mail"
                variant="onDark"
                size="lg"
                withArrow
                className="w-full sm:w-auto"
              >
                Explore Direct Mail
              </Button>
              <TextLink href="/request-a-quote" tone="dark">
                Request a Campaign Quote
              </TextLink>
            </div>
          </div>

          <div className="hidden lg:block">
            <DirectMailArrangement className="h-auto w-full" />
          </div>
        </div>
      </Container>
    </section>
  );
}
