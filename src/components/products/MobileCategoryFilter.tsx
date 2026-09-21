"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { CheckIcon, CloseIcon, FilterIcon } from "@/components/ui/icons";
import { ALL_PRODUCTS, productCategories } from "@/content/products";
import { catalogHref } from "./catalogUrl";

/**
 * Compact category filter for phones and tablets, replacing the desktop
 * sidebar below `lg`.
 *
 * The options are links to the same filtered URLs the sidebar uses, so
 * filtering stays in the URL: an active search is carried through rather than
 * dropped, and a chosen category can be shared or bookmarked.
 */
export function MobileCategoryFilter({
  query = "",
  category = ALL_PRODUCTS,
}: {
  query?: string;
  category?: string;
}) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  const active = productCategories.find((option) => option.id === category);
  const isFiltered = category !== ALL_PRODUCTS;

  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;

    const panel = panelRef.current;
    panel?.querySelector<HTMLElement>("[data-autofocus]")?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== "Tab" || !panel) return;

      // Keep Tab inside the dialog while it is open.
      const focusable = Array.from(
        panel.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'),
      ).filter((el) => el.offsetParent !== null);
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, close]);

  return (
    <div className="lg:hidden">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-haspopup="dialog"
        className="inline-flex min-h-12 w-full items-center gap-2.5 rounded-full bg-white px-5 text-[0.9375rem] font-semibold text-navy ring-1 ring-inset ring-line transition-colors hover:bg-mist sm:w-auto"
      >
        <FilterIcon className="h-5 w-5 shrink-0 text-teal" />
        Filter Products
        {isFiltered && active ? (
          <span className="ml-auto max-w-[55%] truncate rounded-full bg-sky-50 px-3 py-1 text-[0.8125rem] font-semibold text-teal-700 ring-1 ring-inset ring-teal/30 sm:ml-2">
            {active.label}
          </span>
        ) : (
          <span className="ml-auto text-[0.8125rem] font-medium text-muted sm:ml-2">
            All Products
          </span>
        )}
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-label="Close filter"
            tabIndex={-1}
            onClick={close}
            className="fixed inset-0 z-50 cursor-default bg-navy/45"
          />

          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="fixed inset-x-0 bottom-0 z-50 flex max-h-[85dvh] flex-col rounded-t-3xl bg-white shadow-lift"
          >
            <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4">
              <h2 id={titleId} className="text-base font-bold text-navy">
                Filter Products
              </h2>
              <button
                type="button"
                onClick={close}
                aria-label="Close filter"
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-navy transition-colors hover:bg-mist"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>

            <ul className="flex-1 overflow-y-auto overscroll-contain px-3 py-2">
              {productCategories.map((option) => {
                const selected = option.id === category;
                return (
                  <li key={option.id}>
                    <Link
                      href={catalogHref({ query, category: option.id })}
                      onClick={() => setOpen(false)}
                      aria-current={selected ? "true" : undefined}
                      data-autofocus={selected ? "" : undefined}
                      className={`flex min-h-12 items-center justify-between gap-3 rounded-xl px-4 py-2.5 text-[0.9375rem] transition-colors ${
                        selected
                          ? "bg-sky-50 font-semibold text-navy ring-1 ring-inset ring-teal/40"
                          : "font-medium text-muted hover:bg-mist hover:text-navy"
                      }`}
                    >
                      {option.label}
                      {selected && <CheckIcon className="h-4 w-4 shrink-0 text-teal" />}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="flex items-center gap-3 border-t border-line px-5 py-4">
              {isFiltered ? (
                <Link
                  href={catalogHref({ query })}
                  onClick={() => setOpen(false)}
                  className="inline-flex min-h-12 flex-1 items-center justify-center rounded-full bg-white px-5 text-[0.9375rem] font-semibold text-navy ring-1 ring-inset ring-navy/25 transition-colors hover:bg-mist"
                >
                  Clear filter
                </Link>
              ) : null}
              <button
                type="button"
                onClick={close}
                className="inline-flex min-h-12 flex-1 items-center justify-center rounded-full bg-teal px-5 text-[0.9375rem] font-semibold text-white transition-colors hover:bg-teal-700"
              >
                Done
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
