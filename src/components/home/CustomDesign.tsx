import { DesignSample } from "@/components/mockups/arrangements";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

function Sample({ label, state }: { label: string; state: "before" | "after" }) {
  return (
    <figure className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-line">
      <figcaption
        className={`px-3 py-2 text-[0.6875rem] font-bold uppercase tracking-[0.12em] ${
          state === "before" ? "bg-mist text-muted" : "bg-teal text-white"
        }`}
      >
        {label}
      </figcaption>
      <div className="bg-linear-to-br from-mist to-sky-50 p-1">
        <DesignSample state={state} className="h-auto w-full" />
      </div>
    </figure>
  );
}

export function CustomDesign() {
  return (
    <section className="bg-mist py-10 sm:py-14 lg:py-20">
      <Container>
        <div className="grid items-center gap-7 lg:grid-cols-2 lg:gap-14">
          <div className="flex flex-col">
            <h2 className="heading-rule text-balance-tight text-[1.75rem] font-bold leading-[1.15] tracking-[-0.02em] text-navy sm:text-4xl lg:text-[2.5rem]">
              Need Help With the Design?
            </h2>
            <p className="mt-4 max-w-xl text-[0.9375rem] leading-relaxed text-muted sm:mt-5 sm:text-base lg:text-[1.0625rem]">
              We can help. Send us the artwork you already have and we will prepare it for print,
              or ask our design team to create something new. We can work from your existing
              practice branding — your logo, colors and fonts — or start from scratch if you are
              opening a new practice.
            </p>

            <div className="mt-7 grid grid-cols-2 gap-3 sm:gap-4 lg:hidden">
              <Sample label="Before" state="before" />
              <Sample label="After" state="after" />
            </div>

            <div className="mt-7 flex lg:mt-9">
              <Button
                href="/custom-design"
                variant="onDark"
                size="lg"
                withArrow
                className="w-full sm:w-auto"
              >
                Explore Design Services
              </Button>
            </div>
          </div>

          <div className="hidden grid-cols-2 gap-5 lg:grid">
            <Sample label="Before" state="before" />
            <Sample label="After" state="after" />
          </div>
        </div>
      </Container>
    </section>
  );
}
