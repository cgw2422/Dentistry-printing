import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CheckCircleIcon, CursorIcon, UploadIcon } from "@/components/ui/icons";

const steps = [
  {
    icon: CursorIcon,
    title: "Choose Your Products",
    body: "Select from our printing products or direct-mail campaigns.",
  },
  {
    icon: UploadIcon,
    title: "Upload or Request Design",
    body: "Upload your files or request our design services.",
  },
  {
    icon: CheckCircleIcon,
    title: "Approve & Receive",
    body: "Review your proof and approve the final artwork before production. We then coordinate printing and fulfillment.",
  },
];

export function HowItWorks() {
  return (
    <section className="bg-white py-14 sm:py-16 lg:py-20">
      <Container>
        <div className="grid gap-9 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.6fr)] lg:gap-14">
          <SectionHeading title="How It Works">
            Ordering professional dental printing is simple.
          </SectionHeading>

          <ol className="relative flex flex-col gap-7 lg:flex-row lg:gap-8">
            {steps.map(({ icon: Icon, title, body }, index) => (
              <li key={title} className="relative flex gap-4 lg:flex-col lg:gap-4">
                {/* Connector rail: vertical on mobile, horizontal on desktop. */}
                {index < steps.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="absolute left-[1.375rem] top-12 h-[calc(100%+1.75rem-3rem)] w-px bg-line lg:left-12 lg:top-[1.375rem] lg:h-px lg:w-[calc(100%-1rem)]"
                  />
                )}

                <span className="relative z-10 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-teal text-base font-bold text-white">
                  {index + 1}
                </span>

                <div className="flex flex-col gap-1.5 pt-1 lg:pt-0">
                  <Icon className="mb-1 h-7 w-7 text-teal" />
                  <h3 className="text-base font-bold leading-snug text-navy">{title}</h3>
                  <p className="max-w-xs text-sm leading-relaxed text-muted">{body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
