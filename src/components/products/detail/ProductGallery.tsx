"use client";

import { useState } from "react";
import { ProductGalleryArt } from "@/components/mockups/galleryArt";
import type { MockupKey } from "@/content/products";
import type { GalleryView } from "@/content/productDetails";

/**
 * Product gallery: one large view plus a thumbnail per additional view.
 *
 * Driven entirely by the views a product declares, so a product with one view
 * shows no thumbnails and a product with six shows six. Thumbnails are real
 * buttons in a tablist, so they are reachable and operable from the keyboard.
 */
export function ProductGallery({
  views,
  fallbackMockup,
  fallbackAlt,
}: {
  views: GalleryView[];
  fallbackMockup: MockupKey;
  fallbackAlt: string;
}) {
  const [selected, setSelected] = useState(0);
  const current = views[selected];

  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      <div
        id={current ? `gallery-panel-${current.key}` : undefined}
        role={views.length > 1 ? "tabpanel" : undefined}
        aria-labelledby={current && views.length > 1 ? `gallery-tab-${current.key}` : undefined}
        className="overflow-hidden rounded-2xl bg-linear-to-br from-mist to-sky-50 p-3 ring-1 ring-line sm:p-5"
      >
        <ProductGalleryArt
          view={current?.key}
          fallbackMockup={fallbackMockup}
          label={current?.alt ?? fallbackAlt}
          className="h-auto w-full"
        />
      </div>

      {views.length > 1 && (
        <div role="tablist" aria-label="Product views" className="grid grid-cols-4 gap-2 sm:gap-3">
          {views.map((view, index) => {
            const active = index === selected;
            return (
              <button
                key={view.key}
                id={`gallery-tab-${view.key}`}
                type="button"
                role="tab"
                aria-selected={active}
                aria-controls={`gallery-panel-${view.key}`}
                tabIndex={active ? 0 : -1}
                onClick={() => setSelected(index)}
                onKeyDown={(event) => {
                  if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
                  event.preventDefault();
                  const next =
                    event.key === "ArrowRight"
                      ? (index + 1) % views.length
                      : (index - 1 + views.length) % views.length;
                  setSelected(next);
                  document.getElementById(`gallery-tab-${views[next].key}`)?.focus();
                }}
                className={`overflow-hidden rounded-xl bg-linear-to-br from-mist to-sky-50 p-1 transition-all ${
                  active
                    ? "ring-2 ring-teal"
                    : "opacity-80 ring-1 ring-line hover:opacity-100 hover:ring-teal/40"
                }`}
              >
                <span className="sr-only">{view.label}</span>
                <ProductGalleryArt
                  view={view.key}
                  fallbackMockup={fallbackMockup}
                  label=""
                  className="pointer-events-none h-auto w-full"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
