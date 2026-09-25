import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

export type Step = { title: string; detail: string };

/**
 * A numbered sequence, using the same connected-dot treatment as the
 * homepage's How It Works section so the pages read as one site.
 */
export function Steps({
  title,
  intro,
  steps,
  className = "bg-white py-10 sm:py-14 lg:py-20",
}: {
  title: string;
  intro?: string;
  steps: Step[];
  className?: string;
}) {
  return (
    <section className={className}>
      <Container>
        <SectionHeading title={title}>{intro}</SectionHeading>

        <ol className="mt-8 grid gap-6 sm:mt-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {steps.map((step, index) => (
            <li key={step.title} className="flex gap-4 lg:flex-col lg:gap-4">
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-teal text-base font-bold text-white">
                {index + 1}
              </span>
              <div className="flex flex-col gap-1.5 pt-1 lg:pt-0">
                <h3 className="text-base font-bold leading-snug text-navy lg:text-[1.0625rem]">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted lg:text-[0.9375rem]">
                  {step.detail}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
