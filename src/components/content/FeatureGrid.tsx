import type { ComponentType } from "react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

export type Feature = {
  icon?: ComponentType<{ className?: string }>;
  title: string;
  detail: string;
};

/** A grid of icon-led points. Used across the content pages. */
export function FeatureGrid({
  title,
  intro,
  features,
  columns = 3,
  className = "bg-mist py-10 sm:py-14 lg:py-20",
}: {
  title: string;
  intro?: string;
  features: Feature[];
  columns?: 2 | 3;
  className?: string;
}) {
  return (
    <section className={className}>
      <Container>
        <SectionHeading title={title}>{intro}</SectionHeading>

        <ul
          className={`mt-8 grid gap-5 sm:mt-10 sm:grid-cols-2 sm:gap-6 ${
            columns === 3 ? "lg:grid-cols-3" : ""
          }`}
        >
          {features.map(({ icon: Icon, title: heading, detail }) => (
            <li
              key={heading}
              className="flex flex-col gap-3 rounded-2xl bg-white p-6 shadow-card ring-1 ring-line"
            >
              {Icon && (
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-teal">
                  <Icon className="h-6 w-6" />
                </span>
              )}
              <h3 className="text-[1.0625rem] font-bold leading-snug text-navy">{heading}</h3>
              <p className="text-[0.9375rem] leading-relaxed text-muted">{detail}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
