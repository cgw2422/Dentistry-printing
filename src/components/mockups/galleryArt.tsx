import { BusinessCardBack, BusinessCardFace, CardStack, PAPER_SHADOW } from "./pieces";
import { ProductMockup } from "./arrangements";
import type { MockupKey } from "@/content/products";

/**
 * Gallery artwork: the larger, single-subject views a product page shows,
 * drawn from the same vector pieces as the catalogue tiles.
 *
 * Keys are declared per product in `src/content/productDetails.ts`, so a
 * product can have as many or as few views as it has artwork for.
 */
export type GalleryViewKey =
  | "businessCardsStack"
  | "businessCardsFront"
  | "businessCardsBack"
  | "businessCardsAngled";

function Piece({ transform, children }: { transform: string; children: React.ReactNode }) {
  return (
    <g transform={transform} style={{ filter: PAPER_SHADOW }}>
      {children}
    </g>
  );
}

function View({ view }: { view: GalleryViewKey }) {
  switch (view) {
    case "businessCardsStack":
      return (
        <Piece transform="translate(30 30) scale(1.4) rotate(-4)">
          <CardStack layers={10} step={2.8}>
            <BusinessCardFace />
          </CardStack>
        </Piece>
      );
    case "businessCardsFront":
      return (
        <Piece transform="translate(28 44) scale(1.48)">
          <BusinessCardFace />
        </Piece>
      );
    case "businessCardsBack":
      return (
        <Piece transform="translate(28 44) scale(1.48)">
          <BusinessCardBack />
        </Piece>
      );
    case "businessCardsAngled":
      return (
        <g>
          <Piece transform="translate(120 48) scale(0.9) rotate(7)">
            <BusinessCardBack />
          </Piece>
          <Piece transform="translate(20 74) scale(1.12) rotate(-9) skewX(-5)">
            <CardStack layers={6} step={3}>
              <BusinessCardFace />
            </CardStack>
          </Piece>
        </g>
      );
  }
}

/**
 * One gallery view. Falls back to the product's catalogue tile artwork when a
 * product has no gallery views of its own yet.
 */
export function ProductGalleryArt({
  view,
  fallbackMockup,
  label,
  className,
}: {
  view?: GalleryViewKey;
  fallbackMockup: MockupKey;
  label: string;
  className?: string;
}) {
  if (!view) {
    return <ProductMockup mockup={fallbackMockup} className={className} />;
  }

  // Thumbnails pass no label: the button around them carries the name, so the
  // art itself is decorative there rather than an unnamed image.
  const decorative = label.length === 0;

  return (
    <svg
      viewBox="0 0 320 240"
      className={className}
      role={decorative ? "presentation" : "img"}
      aria-hidden={decorative ? true : undefined}
      aria-label={decorative ? undefined : label}
    >
      <View view={view} />
    </svg>
  );
}
