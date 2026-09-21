"use client";

import { CatalogView } from "./CatalogView";
import { useCatalogFilters } from "./useCatalogFilters";

/**
 * Renders the catalogue under the filters currently in effect. Kept to this
 * one job so `CatalogView` stays server-renderable — see the note there.
 */
export function ProductCatalog({
  query,
  category,
}: {
  query?: string;
  category?: string;
}) {
  const filters = useCatalogFilters(query, category);
  return <CatalogView {...filters} />;
}
