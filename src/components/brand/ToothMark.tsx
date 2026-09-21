import { MARK_ACCENT_PATH, MARK_OUTLINE_PATH, MARK_VIEWBOX } from "./mark";

type Variant = "brand" | "light";

/** Stroke width is added outside the path bounds, so pad the viewBox to match. */
const PAD = 4;
const STROKE = 5.5;

/**
 * The Dentistry Printing tooth mark: an outlined modern tooth with a teal
 * highlight arc. Drawn as vector so it stays crisp at any size and works on
 * both light and navy backgrounds.
 *
 * The artwork itself lives in `mark.ts` — see the note there on replacing the
 * placeholder mark with the final logo.
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
      viewBox={`${-PAD} ${-PAD} ${MARK_VIEWBOX.width + PAD * 2} ${MARK_VIEWBOX.height + PAD * 2}`}
      role="presentation"
      aria-hidden="true"
      focusable="false"
      className={className}
      fill="none"
    >
      <path d={MARK_OUTLINE_PATH} stroke={outline} strokeWidth={STROKE} strokeLinejoin="round" />
      <path d={MARK_ACCENT_PATH} stroke={accent} strokeWidth={5} strokeLinecap="round" />
    </svg>
  );
}
