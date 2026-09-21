"use client";

import { useSearchParams } from "next/navigation";
import { ALL_PRODUCTS } from "@/content/products";

export type CatalogFilters = { query: string; category: string };

/**
 * The filters currently in effect, reading the URL first and the values the
 * server resolved second.
 *
 * On the deployed site `/printing-products` is rendered per request, so the
 * server has already read the query string and passes it in. The URL and the
 * props agree, the first client render matches the HTML exactly, and nothing
 * flashes — a filtered link arrives filtered.
 *
 * The static export used for the shareable preview has no request to read, so
 * the props are empty there and the URL is the only source. Consulting both
 * keeps one component correct in either setting.
 */
export function useCatalogFilters(
  serverQuery = "",
  serverCategory = ALL_PRODUCTS,
): CatalogFilters {
  const params = useSearchParams();
  return {
    query: params.get("q") ?? serverQuery,
    category: params.get("category") ?? serverCategory,
  };
}
