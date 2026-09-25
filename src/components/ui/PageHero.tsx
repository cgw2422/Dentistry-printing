import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

/**
 * The hero shared by the content pages (Direct Mail, Custom Design, How It
 * Works, About, Contact and the legal pages).
 *
 * It matches the approved catalogue hero — same gradient, same soft blooms,
 * same type scale — so a visitor moving between pages stays in one site. The
 * primary action defaults to Request a Quote because that is the site's only
 * conversion; pages that need no action simply omit both.
 */
export function PageHero({
  eyebrow,
  title,
  highlight,
  body,
  primary = { label: "Request a Quote", href: "/request-a-quote" },
  secondary,
  aside,
}: {
  eyebrow: string;
  title: string;
  /** Rendered in teal at the end of the title. */
  highlight?: string;
  body?: string;
  primary?: { label: string; href: string } | null;
  secondary?: { label: string; href: string };
  /** Artwork for the right-hand column. Without it the hero is single column. */
  aside?: ReactNode;
}) {
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
        <div
          className={`grid items-center gap-7 py-10 sm:gap-10 sm:py-14 lg:gap-10 lg:py-16 ${
            aside ? "lg:grid-cols-[minmax(0,1.02fr)_minmax(0,1fr)]" : ""
          }`}
        >
          <div className={`flex flex-col ${aside ? "" : "max-w-3xl"}`}>
            <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-navy/70 sm:text-xs sm:tracking-[0.22em]">
              {eyebrow}
            </p>

            <h1 className="text-balance-tight mt-4 text-[2rem] font-extrabold leading-[1.1] tracking-[-0.03em] text-navy sm:text-[2.75rem] lg:text-[3.25rem]">
              {title} {highlight && <span className="text-teal">{highlight}</span>}
            </h1>

            {body && (
              <p className="mt-4 max-w-xl text-base leading-relaxed text-muted sm:mt-5 sm:text-lg">
                {body}
              </p>
            )}

            {(primary || secondary) && (
              <div className="mt-6 flex flex-col gap-3 sm:mt-7 sm:flex-row sm:flex-wrap sm:gap-4">
                {primary && (
                  <Button
                    href={primary.href}
                    variant="onDark"
                    size="lg"
                    withArrow
                    className="w-full sm:w-auto"
                  >
                    {primary.label}
                  </Button>
                )}
                {secondary && (
                  <Button
                    href={secondary.href}
                    variant="secondary"
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    {secondary.label}
                  </Button>
                )}
              </div>
            )}
          </div>

          {aside && <div className="relative -mx-2 sm:-mx-1 lg:mx-0 lg:-mr-8">{aside}</div>}
        </div>
      </Container>
    </section>
  );
}
