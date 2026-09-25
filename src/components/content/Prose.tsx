import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";

export type ProseSection = { heading: string; body: ReactNode[] };

/**
 * Plain readable body copy for the legal pages. Narrow measure, generous
 * leading, brand type — no separate typography plugin needed for two pages.
 */
export function Prose({ sections, footnote }: { sections: ProseSection[]; footnote?: string }) {
  return (
    <section className="bg-white py-10 sm:py-14 lg:py-16">
      <Container>
        <div className="max-w-2xl">
          {sections.map((section) => (
            <section key={section.heading} className="mt-9 first:mt-0">
              <h2 className="text-xl font-bold tracking-[-0.015em] text-navy sm:text-2xl">
                {section.heading}
              </h2>
              {section.body.map((paragraph, index) => (
                <div
                  key={index}
                  className="mt-3 text-[0.9375rem] leading-relaxed text-muted sm:text-base"
                >
                  {paragraph}
                </div>
              ))}
            </section>
          ))}

          {footnote && (
            <p className="mt-10 border-t border-line pt-6 text-sm leading-relaxed text-muted">
              {footnote}
            </p>
          )}
        </div>
      </Container>
    </section>
  );
}
