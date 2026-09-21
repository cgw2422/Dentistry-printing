import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PencilIcon } from "@/components/ui/icons";

export function CustomDesignBanner({ productName }: { productName: string }) {
  return (
    <section className="bg-white pb-10 sm:pb-14 lg:pb-16">
      <Container>
        <div className="flex flex-col gap-5 rounded-2xl bg-sky-50 px-6 py-7 ring-1 ring-line sm:px-8 sm:py-8 lg:flex-row lg:items-center lg:gap-10 lg:px-10">
          <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-teal ring-1 ring-teal/20">
            <PencilIcon className="h-7 w-7" />
          </span>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-navy sm:text-2xl">Need a Custom Design?</h2>
            <p className="mt-2 max-w-2xl text-[0.9375rem] leading-relaxed text-muted">
              Our design team can help create {productName.toLowerCase()} that reflect your
              practice&apos;s branding. Provide your logo and existing artwork, or tell us what you
              have in mind.
            </p>
          </div>
          <Button
            href="/custom-design"
            variant="secondary"
            size="lg"
            className="w-full shrink-0 lg:w-auto"
          >
            Request Custom Design
          </Button>
        </div>
      </Container>
    </section>
  );
}
