/**
 * Photography slots on the printed-product mockups.
 *
 * Most pieces (business cards, appointment cards, letterhead, envelopes, rack
 * cards, door hangers) are pure vector artwork and need no photography. The
 * two pieces below are the ones the design references show carrying a patient
 * photograph: the new-patient postcard and the community/EDDM postcard.
 *
 * Every slot is `null` until a licensed image is supplied. While a slot is
 * null the mockup falls back to its designed graphic treatment, so the page is
 * complete either way — dropping a file in upgrades it with no other change.
 *
 * ── What a photo in these slots has to clear ──────────────────────────────
 * These mockups are marketing material for Dentistry Printing, and the same
 * artwork is what a practice would print and mail. A photograph of an
 * identifiable person used that way needs BOTH:
 *
 *   1. A commercial-use licence for the image itself, and
 *   2. A signed model release from the person shown.
 *
 * A "free for commercial use" stock licence (Unsplash, Pexels and similar)
 * grants the first and explicitly does NOT grant the second. Do not put a
 * photo in these slots on a stock licence alone.
 *
 * ── Adding a photo ───────────────────────────────────────────────────────
 *   1. Put the file in `public/photos/`.
 *   2. Fill in the slot below, recording the licence and release in `rights`
 *      so the provenance stays with the code.
 * Recommended: JPEG or WebP, at least 1200px on the long edge, sRGB.
 */

export type PatientPhoto = {
  /** Path under `public/`, e.g. "/photos/new-patient-portrait.jpg". */
  src: string;
  /** Where the licence and the model release are recorded. Required. */
  rights: string;
  /**
   * Which part of the frame to keep when the photo is cropped to the panel,
   * as an SVG preserveAspectRatio alignment. Defaults to centre.
   */
  align?: "xMidYMid" | "xMidYMin" | "xMidYMax" | "xMinYMid" | "xMaxYMid";
};

export type PatientPhotoSlots = {
  /**
   * Portrait panel on the "A Brighter Smile Starts Here." new-patient
   * postcard. Roughly 3:4 (taller than wide) after cropping.
   */
  newPatientPortrait: PatientPhoto | null;
  /**
   * Full-bleed panel on the "Healthy Smiles, Happier Communities." direct-mail
   * postcard. Roughly 3:2 (landscape) after cropping.
   */
  communityLifestyle: PatientPhoto | null;
};

export const patientPhotos: PatientPhotoSlots = {
  newPatientPortrait: null,
  communityLifestyle: null,
};
