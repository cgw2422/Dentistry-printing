import Link from "next/link";
import { ProductCard } from "@/components/home/ProductCard";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { CloseIcon } from "@/components/ui/icons";
import { ALL_PRODUCTS, filterProducts, productCategories, products } from "@/content/products";
import { CATALOG_ANCHOR, catalogHref } from "./catalogUrl";
import { CustomPrintingCard } from "./CustomPrintingCard";
import { MobileCategoryFilter } from "./MobileCategoryFilter";

/**
 * The catalogue: category sidebar (desktop), category chips (mobile) and the
 * product grid. Every one of those reads the same `products` array and the
 * same `filterProducts` helper, so search, filtering and the counts can never
 * disagree with one another.
 *
 * Deliberately hook-free, so the server can render the unfiltered catalogue
 * into the HTML while the client component above it reads the URL. Without
 * that the whole grid would be invisible to anything that does not run
 * JavaScript, and would flash empty on first paint.
 *
 * Category options are links rather than buttons: filtering is a URL change,
 * so they are keyboard-navigable and shareable for free, and a search stays
 * applied when a category is chosen instead of being silently dropped.
 */
export function CatalogView({
  query = "",
  category = ALL_PRODUCTS,
}: {
  query?: string;
  category?: string;
}) {
  const visible = filterProducts({ query, category });
  const activeCategory = productCategories.find((option) => option.id === category);
  const filtered = query.trim().length > 0 || category !== ALL_PRODUCTS;

  return (
    <section id={CATALOG_ANCHOR} className="scroll-mt-24 bg-white py-10 sm:py-12 lg:py-14">
      <Container>
        <div className="lg:grid lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] lg:gap-10">
          {/* ---------------- Desktop category sidebar ---------------- */}
          <aside className="hidden lg:block">
            <nav aria-label="Product categories" className="sticky top-28">
              <h2 className="heading-rule text-lg font-bold text-navy">Product Categories</h2>
              <ul className="mt-6 flex flex-col gap-0.5">
                {productCategories.map((option) => {
                  const selected = option.id === category;
                  return (
                    <li key={option.id}>
                      <Link
                        href={catalogHref({ query, category: option.id })}
                        aria-current={selected ? "true" : undefined}
                        className={`block rounded-lg px-3.5 py-2.5 text-[0.9375rem] transition-colors ${
                          selected
                            ? "bg-sky-50 font-semibold text-navy ring-1 ring-inset ring-teal/40"
                            : "font-medium text-muted hover:bg-mist hover:text-navy"
                        }`}
                      >
                        {option.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-7 rounded-2xl bg-sky-50 p-5 ring-1 ring-line">
                <h3 className="text-[0.9375rem] font-bold text-navy">Need Help Choosing?</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  Our team can help you find the right printing products for your practice.
                </p>
                <Button
                  href="/request-a-quote"
                  variant="secondary"
                  size="md"
                  withArrow
                  className="mt-4 w-full"
                >
                  Request a Quote
                </Button>
              </div>
            </nav>
          </aside>

          {/* ---------------- Catalogue ---------------- */}
          <div className="min-w-0">
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
              <h2 className="heading-rule text-2xl font-bold tracking-[-0.02em] text-navy sm:text-3xl lg:text-[2rem]">
                {activeCategory && category !== ALL_PRODUCTS
                  ? activeCategory.label
                  : "All Printing Products"}
              </h2>
              <p className="text-sm text-muted" aria-live="polite">
                {visible.length} {visible.length === 1 ? "product" : "products"}
                {filtered ? ` of ${products.length}` : ""}
              </p>
            </div>

            {/* Compact filter for phones and tablets; the sidebar covers lg. */}
            <div className="mt-5">
              <MobileCategoryFilter query={query} category={category} />
            </div>

            {/* Active filters, with a way back out of them. */}
            {filtered && (
              <div className="mt-4 flex flex-wrap items-center gap-3">
                {query.trim() && (
                  <p className="text-sm text-muted">
                    Showing results for{" "}
                    <span className="font-semibold text-navy">&ldquo;{query.trim()}&rdquo;</span>
                  </p>
                )}
                {visible.length > 0 && (
                  <Link
                    href={catalogHref()}
                    className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-teal-700 underline-offset-4 hover:underline"
                  >
                    <CloseIcon className="h-3.5 w-3.5" />
                    {query.trim() ? "Clear Search" : "Clear Filter"}
                  </Link>
                )}
              </div>
            )}

            {visible.length > 0 ? (
              <ul
                aria-label="Printing products"
                className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 lg:gap-6"
              >
                {visible.map((product) => (
                  <li key={product.slug} className="flex">
                    {product.enquiryOnly ? (
                      <CustomPrintingCard product={product} />
                    ) : (
                      <ProductCard product={product} emphasis="catalog" />
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-6 rounded-2xl bg-mist px-6 py-12 text-center ring-1 ring-line">
                <p className="text-base font-semibold text-navy">
                  No products found. Try another search or request a custom quote.
                </p>
                <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <Button href={catalogHref()} variant="secondary" size="md" className="w-full sm:w-auto">
                    Clear Search
                  </Button>
                  <Button
                    href="/request-a-quote"
                    variant="onDark"
                    size="md"
                    withArrow
                    className="w-full sm:w-auto"
                  >
                    Request a Custom Quote
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
