import { Search } from "@/components/ui/icons";
import { CATALOG_PATH } from "./catalogUrl";
import { SEARCH_BUTTON_CLASS, SEARCH_FORM_CLASS, SEARCH_INPUT_CLASS } from "./searchStyles";

/**
 * Server-rendered search field, shown until the interactive one hydrates.
 * A plain GET form to the catalogue, so it still works before (or without)
 * JavaScript: submitting lands on /printing-products?q=… which the catalogue
 * reads exactly as it would after a client-side search.
 */
export function ProductSearchFallback() {
  return (
    <form role="search" action={CATALOG_PATH} method="get" className={SEARCH_FORM_CLASS}>
      <label htmlFor="product-search" className="sr-only">
        Search printing products
      </label>
      <div className="relative flex-1">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted"
        />
        <input
          id="product-search"
          name="q"
          type="search"
          placeholder="Search products..."
          autoComplete="off"
          className={SEARCH_INPUT_CLASS}
        />
      </div>
      <button type="submit" className={SEARCH_BUTTON_CLASS}>
        Search
      </button>
    </form>
  );
}
