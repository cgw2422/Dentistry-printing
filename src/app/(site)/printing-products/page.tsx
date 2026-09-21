import { Suspense } from "react";
import type { Metadata } from "next";
import { CatalogView } from "@/components/products/CatalogView";
import { ProductCatalog } from "@/components/products/ProductCatalog";
import { ProductsHero } from "@/components/products/ProductsHero";
import { CtaBanner } from "@/components/ui/CtaBanner";
import { CATALOG_PATH, CATALOG_ANCHOR } from "@/components/products/catalogUrl";
import { ALL_PRODUCTS } from "@/content/products";

export const metadata: Metadata = {
  title: "Printing Products",
  description:
    "From business cards to brochures, find professional printing designed specifically for dental offices.",
};

/**
 * The shareable preview is a static export, which has no request to read
 * filters from. Everywhere else the page is rendered per request.
 */
const STATIC_EXPORT = process.env.STATIC_EXPORT === "1";

type SearchParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function PrintingProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  // Awaiting this is what opts the route into per-request rendering, so the
  // HTML already carries the right products, the right count and the empty
  // state. Skipped in the static export, where there is nothing to await.
  const params: SearchParams = STATIC_EXPORT ? {} : await searchParams;
  const query = first(params.q) ?? "";
  const category = first(params.category) ?? ALL_PRODUCTS;

  return (
    <>
      <ProductsHero query={query} category={category} />

      {/* Per request there is nothing to suspend on, and a boundary would put
          the whole catalogue into the HTML twice — once as the fallback, once
          resolved. The static export does need it, because there the client is
          what applies the URL. */}
      {STATIC_EXPORT ? (
        <Suspense fallback={<CatalogView query={query} category={category} />}>
          <ProductCatalog query={query} category={category} />
        </Suspense>
      ) : (
        <ProductCatalog query={query} category={category} />
      )}
      <CtaBanner
        title="Ready to Get Started?"
        body="Explore our printing products or tell us what you need. We'll help you find the right solution for your practice."
        // A bare catalogue link: no query, no category, so it clears both.
        primary={{ label: "Shop All Products", href: `${CATALOG_PATH}#${CATALOG_ANCHOR}` }}
        secondary={{ label: "Request a Quote", href: "/request-a-quote" }}
      />
    </>
  );
}
