/**
 * Single source of truth for the Dentistry Printing tooth mark.
 *
 * Both the site logo (`ToothMark.tsx`) and the small mark printed onto the
 * product mockups (`mockups/pieces.tsx`) draw these two paths, so replacing the
 * placeholder mark with the final logo is a one-file change.
 *
 * To swap in the real logo:
 *   1. Replace the two paths below with the outline and accent paths from the
 *      final SVG, and set MARK_VIEWBOX to that file's viewBox.
 *   2. Update `src/app/icon.svg` (the browser tab icon) to match.
 * If the final logo is a raster file or too detailed to inline, render it with
 * next/image inside `ToothMark.tsx` instead and keep MARK_* for the mockups.
 */

/** Drawn as a stroke, in navy on light backgrounds and white on navy. */
export const MARK_OUTLINE_PATH =
  "M30 5C17 5 6 11.5 6 25.5c0 7.5 2.5 14.5 5.5 23.5 2 6 3 12 4 16 1 4.5 6 5 7.3.5 1.5-5.5 2.7-13.5 4.2-17 1-2.3 5-2.3 6 0 1.5 3.5 2.7 11.5 4.2 17 1.3 4.5 6.3 4 7.3-.5 1-4 2-10 4-16 3-9 5.5-16 5.5-23.5C54 11.5 43 5 30 5Z";

/** The teal highlight arc inside the crown. */
export const MARK_ACCENT_PATH = "M15.8 24.4c.4-6.2 5-10.9 11.4-12.2";

/** Natural drawing space of the two paths, before stroke width is added. */
export const MARK_VIEWBOX = { width: 60, height: 72 } as const;
