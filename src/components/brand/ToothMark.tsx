type Variant = "brand" | "light";

/**
 * The Dentistry Printing tooth mark: an outlined modern tooth with a teal
 * highlight arc. Drawn as vector so it stays crisp at any size and works on
 * both light and navy backgrounds.
 */
export function ToothMark({
  className,
  variant = "brand",
}: {
  className?: string;
  variant?: Variant;
}) {
  const outline = variant === "light" ? "#ffffff" : "#0f2d4a";
  const accent = variant === "light" ? "#7dd3fc" : "#00a3b4";

  return (
    <svg
      viewBox="-4 -4 68 80"
      role="presentation"
      aria-hidden="true"
      focusable="false"
      className={className}
      fill="none"
    >
      <path
        d="M30 5C17 5 6 11.5 6 25.5c0 7.5 2.5 14.5 5.5 23.5 2 6 3 12 4 16 1 4.5 6 5 7.3.5 1.5-5.5 2.7-13.5 4.2-17 1-2.3 5-2.3 6 0 1.5 3.5 2.7 11.5 4.2 17 1.3 4.5 6.3 4 7.3-.5 1-4 2-10 4-16 3-9 5.5-16 5.5-23.5C54 11.5 43 5 30 5Z"
        stroke={outline}
        strokeWidth={5.5}
        strokeLinejoin="round"
      />
      <path
        d="M15.8 24.4c.4-6.2 5-10.9 11.4-12.2"
        stroke={accent}
        strokeWidth={5}
        strokeLinecap="round"
      />
    </svg>
  );
}
