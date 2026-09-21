import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { CheckIcon, PencilIcon, PrinterIcon, TruckIcon, CheckCircleIcon } from "@/components/ui/icons";
import type { HighlightKey, ResolvedProduct } from "@/content/productDetails";
import { CustomDesignBanner } from "./CustomDesignBanner";
import { ArtworkOptions, ProductConfigurator } from "./ProductConfigurator";
import { ProductGallery } from "./ProductGallery";

const HIGHLIGHT_ICONS: Record<HighlightKey, typeof PrinterIcon> = {
  printing: PrinterIcon,
  design: PencilIcon,
  fulfillment: TruckIcon,
  proof: CheckCircleIcon,
};

/**
 * The one product-detail template. Every product in the catalogue renders
 * through this; what differs between them is the data in
 * `src/content/productDetails.ts`, never the layout.
 *
 * Sections the product has no data for are simply not rendered — a product
 * with no confirmed option groups shows no configuration section rather than
 * a set of empty fields borrowed from another product.
 */
export function ProductDetailPage({ resolved }: { resolved: ResolvedProduct }) {
  const { product, detail } = resolved;

  return (
    <>
      <Breadcrumbs
        trail={[
          { label: "Home", href: "/" },
          { label: "Printing Products", href: "/printing-products" },
          { label: product.name },
        ]}
      />

      <section className="bg-white py-7 sm:py-9 lg:py-12">
        <Container>
          <div className="grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-12">
            {/* Gallery — left column on desktop, first on mobile. */}
            <div className="lg:col-start-1 lg:row-start-1">
              <ProductGallery
                views={detail.gallery}
                fallbackMockup={product.mockup}
                fallbackAlt={`${product.name} for dental practices.`}
              />
            </div>

            {/* Product information and configuration — right column, and the
                full width of the second row on mobile. */}
            <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1">
              <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-muted sm:text-xs sm:tracking-[0.22em]">
                {detail.eyebrow}
              </p>
              <h1 className="text-balance-tight mt-3 text-[1.75rem] font-extrabold leading-[1.15] tracking-[-0.025em] text-navy sm:text-[2.125rem] lg:text-[2.5rem]">
                {detail.headline}
              </h1>
              <p className="mt-4 max-w-xl text-[0.9375rem] leading-relaxed text-muted sm:text-base">
                {detail.description}
              </p>

              <ul className="mt-6 grid grid-cols-3 gap-x-3 gap-y-4">
                {detail.highlights.map(({ icon, title }) => {
                  const Icon = HIGHLIGHT_ICONS[icon];
                  return (
                    <li key={title} className="flex items-start gap-2">
                      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-teal sm:h-6 sm:w-6" />
                      <span className="text-[0.75rem] font-semibold leading-snug text-navy sm:text-[0.8125rem]">
                        {title}
                      </span>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-7">
                <ProductConfigurator
                  optionGroups={detail.optionGroups}
                  productName={product.name.toLowerCase()}
                  productSlug={product.slug}
                />
              </div>

              <ArtworkOptions />
            </div>

            {/* Product details — under the gallery on desktop, last on mobile. */}
            {detail.details && (
              <section className="lg:col-start-1 lg:row-start-2">
                <h2 className="heading-rule text-xl font-bold text-navy sm:text-2xl">
                  Product Details
                </h2>
                <p className="mt-5 text-[0.9375rem] leading-relaxed text-muted">
                  {detail.details.intro}
                </p>
                <ul className="mt-5 flex flex-col gap-3">
                  {detail.details.points.map((point) => (
                    <li key={point} className="flex items-start gap-3">
                      <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal text-white">
                        <CheckIcon className="h-3 w-3" />
                      </span>
                      <span className="text-[0.9375rem] leading-relaxed text-navy">{point}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </Container>
      </section>

      <CustomDesignBanner productName={product.name} />
    </>
  );
}
