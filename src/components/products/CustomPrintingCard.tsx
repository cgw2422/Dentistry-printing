import Link from "next/link";
import { ProductMockup } from "@/components/mockups/arrangements";
import { ArrowRight } from "@/components/ui/icons";
import type { ProductEntry } from "@/content/products";

/**
 * Custom Printing is an enquiry, not something to configure, so it gets a
 * distinct navy treatment and a quote CTA rather than "View Options".
 */
export function CustomPrintingCard({ product }: { product: ProductEntry }) {
  return (
    <div className="flex w-full flex-col overflow-hidden rounded-2xl bg-navy shadow-card ring-1 ring-navy/20">
      <div className="relative bg-navy-900 p-1.5 sm:p-2">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-teal/25 blur-3xl"
        />
        <ProductMockup mockup={product.mockup} className="relative h-auto w-full" />
      </div>

      <div className="flex flex-1 flex-col gap-2 border-t border-white/10 px-4 py-3.5 sm:px-5 sm:py-4 lg:px-6 lg:py-5">
        <p className="text-[0.625rem] font-bold uppercase tracking-[0.16em] text-sky">
          Something else?
        </p>
        <h3 className="text-[0.9375rem] font-bold leading-snug text-white sm:text-base lg:text-[1.0625rem]">
          {product.name}
        </h3>
        <p className="hidden text-sm leading-relaxed text-sky-100/85 sm:block">{product.blurb}</p>

        <Link
          href="/request-a-quote"
          className="mt-auto inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-teal px-3 py-2.5 text-center text-xs font-semibold leading-snug text-white transition-colors hover:bg-teal-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky sm:px-4 sm:text-sm"
        >
          Request a Custom Quote
          {/* The arrow costs a line of wrapping in the narrow mobile column. */}
          <ArrowRight className="hidden h-3.5 w-3.5 shrink-0 sm:block" />
        </Link>
      </div>
    </div>
  );
}
