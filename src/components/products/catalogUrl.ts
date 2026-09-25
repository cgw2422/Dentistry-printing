import { ALL_PRODUCTS } from "@/content/products";

/**
 * Search and category live in the URL rather than component state, so the two
 * controls stay in sync without sharing a parent, filters survive a refresh or
 * a shared link, the browser back button works, and "Browse All Products" can
 * clear everything simply by linking to the bare route.
 */
export const CATALOG_PATH = "/printing-products";
export const CATALOG_ANCHOR = "all-products";

export function catalogHref({
  query = "",
  category = ALL_PRODUCTS,
  anchor = true,
}: {
  query?: string;
  category?: string;
  anchor?: boolean;
} = {}): string {
  const params = new URLSearchParams();
  const trimmed = query.trim();
  if (trimmed) params.set("q", trimmed);
  if (category && category !== ALL_PRODUCTS) params.set("category", category);

  const search = params.toString();
  return `${CATALOG_PATH}${search ? `?${search}` : ""}${anchor ? `#${CATALOG_ANCHOR}` : ""}`;
}
