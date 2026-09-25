"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "@/components/ui/icons";
import { catalogHref } from "./catalogUrl";
import { SEARCH_BUTTON_CLASS, SEARCH_FORM_CLASS, SEARCH_INPUT_CLASS } from "./searchStyles";
import { useCatalogFilters } from "./useCatalogFilters";

/**
 * Catalogue search box. Submitting (button or Enter) writes the query to the
 * URL, which is what the catalogue below reads — so this component and the
 * grid stay in sync without being part of the same tree.
 */
export function ProductSearch({
  query: serverQuery,
  category: serverCategory,
}: {
  query?: string;
  category?: string;
}) {
  const { query, category } = useCatalogFilters(serverQuery, serverCategory);

  // Keying on the committed query remounts the field whenever the URL changes
  // from elsewhere — a category link, "Browse All Products", or the back button —
  // so the box always shows the search that is actually applied.
  return <SearchForm key={query} initialQuery={query} category={category} />;
}

function SearchForm({
  initialQuery,
  category,
}: {
  initialQuery: string;
  category: string;
}) {
  const router = useRouter();
  const [draft, setDraft] = useState(initialQuery);

  return (
    <form
      role="search"
      onSubmit={(event) => {
        event.preventDefault();
        router.push(catalogHref({ query: draft, category }), { scroll: true });
      }}
      className={SEARCH_FORM_CLASS}
    >
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
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
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
