import Link from "next/link";
import { ProductMockup } from "@/components/mockups/arrangements";
import { ArrowRight } from "@/components/ui/icons";
import type { ProductEntry } from "@/content/products";

/**
 * Product tile. `emphasis="category"` is the grid on the category section;
 * `emphasis="popular"` adds the "View Options" affordance from the reference.
 */
export function ProductCard({
  product,
  emphasis = "category",
}: {
  product: ProductEntry;
  emphasis?: "category" | "popular";
}) {
  return (
    <Link
      href={`/printing-products/${product.slug}`}
      className="group flex w-full flex-col overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-line transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift hover:ring-teal/40"
    >
      <div className="bg-linear-to-br from-mist to-sky-50 p-1.5 sm:p-2">
        <ProductMockup mockup={product.mockup} className="h-auto w-full" />
      </div>

      <div className="flex flex-1 flex-col gap-1 border-t border-line px-4 py-3.5 sm:px-5 sm:py-4 lg:px-6 lg:py-5">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-[0.9375rem] font-bold leading-snug text-navy sm:text-base lg:text-[1.0625rem]">
            {product.name}
          </h3>
          <ArrowRight className="h-4 w-4 shrink-0 text-teal transition-transform duration-200 group-hover:translate-x-0.5 lg:h-5 lg:w-5" />
        </div>

        {emphasis === "category" ? (
          <p className="hidden text-sm leading-relaxed text-muted sm:block">{product.blurb}</p>
        ) : (
          <span className="text-[0.8125rem] font-semibold text-teal-700 sm:text-sm">View Options</span>
        )}
      </div>
    </Link>
  );
}
