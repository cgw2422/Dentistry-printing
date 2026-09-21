import { Suspense } from "react";
import type { Metadata } from "next";
import { CatalogView } from "@/components/products/CatalogView";
import { ProductCatalog } from "@/components/products/ProductCatalog";
import { ProductsHero } from "@/components/products/ProductsHero";
import { CtaBanner } from "@/components/ui/CtaBanner";
import { CATALOG_PATH, CATALOG_ANCHOR } from "@/components/products/catalogUrl";

export const metadata: Metadata = {
  title: "Printing Products",
  description:
    "From business cards to brochures, find professional printing designed specifically for dental offices.",
};

export default function PrintingProductsPage() {
  return (
    <>
      <ProductsHero />
      {/* The fallback is the full, unfiltered catalogue, so it is present in
          the server HTML; the client swaps in the filtered view once it has
          read the URL. */}
      <Suspense fallback={<CatalogView />}>
        <ProductCatalog />
      </Suspense>
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
