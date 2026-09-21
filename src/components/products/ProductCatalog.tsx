"use client";

import { useSearchParams } from "next/navigation";
import { ALL_PRODUCTS } from "@/content/products";
import { CatalogView } from "./CatalogView";

/**
 * Reads the active search and category from the URL and hands them to the
 * presentational catalogue. Kept to this one job so `CatalogView` stays
 * server-renderable — see the note there.
 */
export function ProductCatalog() {
  const params = useSearchParams();
  return (
    <CatalogView
      query={params.get("q") ?? ""}
      category={params.get("category") ?? ALL_PRODUCTS}
    />
  );
}
