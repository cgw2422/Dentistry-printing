import type { MockupKey } from "@/content/products";
import {
  AppointmentCardFace,
  PatientLeafletFace,
  PresentationFolderFace,
  BrochurePanelFront,
  BrochurePanelInner,
  BusinessCardFace,
  CardStack,
  DoorHangerFace,
  EnvelopeFace,
  LetterheadFace,
  PAPER_SHADOW,
  PAPER_SHADOW_SM,
  PostcardCommunity,
  PostcardPlain,
  PostcardSmile,
  RackCardFace,
  ReferralCardFace,
} from "./pieces";

/**
 * Soft contact shadow, so pieces read as resting on a surface rather than
 * floating. Drawn beneath the pieces it belongs to.
 */
function Ground({
  cx,
  cy,
  rx,
  ry,
  opacity = 0.16,
}: {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  opacity?: number;
}) {
  return (
    <ellipse
      cx={cx}
      cy={cy}
      rx={rx}
      ry={ry}
      fill="#0f2d4a"
      opacity={opacity}
      filter="url(#dp-soft)"
    />
  );
}

/** Drop-shadowed wrapper so every placed piece reads as a physical object. */
function Piece({
  transform,
  soft = false,
  children,
}: {
  transform: string;
  soft?: boolean;
  children: React.ReactNode;
}) {
  return (
    <g transform={transform} style={{ filter: soft ? PAPER_SHADOW_SM : PAPER_SHADOW }}>
      {children}
    </g>
  );
}

/** Tri-fold brochure standing open. Natural bounding box ≈ 236 × 170. */
export function BrochureStanding() {
  return (
    <g>
      <Piece transform="translate(0 -4) scale(0.72 0.94) skewY(7)" soft>
        <BrochurePanelInner tone="teal" />
      </Piece>
      <Piece transform="translate(166 2) scale(0.74 0.95) skewY(-7)" soft>
        <BrochurePanelInner />
      </Piece>
      <Piece transform="translate(68 0)">
        <BrochurePanelFront />
      </Piece>
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* Hero arrangement                                                    */
/* ------------------------------------------------------------------ */

/**
 * The hero product group: new-patient postcard, standing tri-fold brochure,
 * a printed stack of business cards and a stack of appointment cards.
 */
export function HeroArrangement({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 664 428"
      className={className}
      role="img"
      aria-label="Printed dental marketing materials: a new-patient postcard, a tri-fold patient brochure, a stack of business cards and a stack of appointment reminder cards."
    >
      {/* Surface the whole group sits on. */}
      <Ground cx={332} cy={404} rx={300} ry={26} opacity={0.12} />

      <Ground cx={524} cy={196} rx={134} ry={14} />
      <Piece transform="translate(384 2) scale(1.18)">
        <BrochureStanding />
      </Piece>

      <Ground cx={548} cy={342} rx={54} ry={11} />
      <Piece transform="translate(514 190) scale(0.88) rotate(4)">
        <RackCardFace />
      </Piece>

      <Ground cx={206} cy={244} rx={184} ry={16} />
      <Piece transform="translate(22 4) scale(1.92) rotate(-2.5)">
        <PostcardSmile />
      </Piece>

      <Ground cx={112} cy={390} rx={104} ry={13} />
      <Piece transform="translate(10 258) scale(1.07) rotate(-4)">
        <CardStack layers={8}>
          <BusinessCardFace />
        </CardStack>
      </Piece>

      <Ground cx={358} cy={414} rx={108} ry={13} />
      <Piece transform="translate(236 282) scale(1.09) rotate(3)">
        <CardStack layers={6}>
          <AppointmentCardFace />
        </CardStack>
      </Piece>
    </svg>
  );
}

/**
 * Hero group for the Printing Products catalogue: the same pieces as the
 * homepage hero in a wider, flatter composition, so the page reads as a
 * continuation rather than a repeat.
 */
export function CatalogHeroArrangement({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 620 340"
      className={className}
      role="img"
      aria-label="Printed dental practice materials: a new-patient postcard, a standing rack card, a tri-fold brochure, a stack of business cards and an appointment reminder card."
    >
      <Ground cx={310} cy={318} rx={286} ry={22} opacity={0.12} />

      <Ground cx={470} cy={168} rx={110} ry={13} />
      <Piece transform="translate(376 6) scale(0.92)">
        <BrochureStanding />
      </Piece>

      <Ground cx={570} cy={288} rx={44} ry={10} />
      <Piece transform="translate(542 156) scale(0.72) rotate(5)">
        <RackCardFace />
      </Piece>

      <Ground cx={188} cy={196} rx={170} ry={15} />
      <Piece transform="translate(18 8) scale(1.7) rotate(-2.5)">
        <PostcardSmile />
      </Piece>

      <Ground cx={104} cy={310} rx={96} ry={12} />
      <Piece transform="translate(10 196) scale(0.98) rotate(-4)">
        <CardStack layers={7}>
          <BusinessCardFace />
        </CardStack>
      </Piece>

      <Ground cx={310} cy={322} rx={98} ry={12} />
      <Piece transform="translate(212 214) scale(1) rotate(3)">
        <CardStack layers={5}>
          <AppointmentCardFace />
        </CardStack>
      </Piece>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Direct-mail arrangement                                             */
/* ------------------------------------------------------------------ */

/** Large EDDM postcard with a second card fanned behind it. */
export function DirectMailArrangement({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 520 306"
      className={className}
      role="img"
      aria-label="A new-patient direct-mail postcard designed for mailing to households near a dental practice, with a second printed postcard fanned behind it."
    >
      <Ground cx={268} cy={196} rx={218} ry={20} opacity={0.34} />
      <Piece transform="translate(250 6) scale(1.32) rotate(8)" soft>
        <PostcardSmile />
      </Piece>
      <Piece transform="translate(10 52) scale(1.62) rotate(-4)">
        <PostcardCommunity />
      </Piece>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* New-practice stationery set                                         */
/* ------------------------------------------------------------------ */

/** Coordinated opening-day stationery: letterhead, envelope, cards, postcard. */
export function StationerySet({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 560 372"
      className={className}
      role="img"
      aria-label="A coordinated new-practice stationery set: letterhead, envelope, business cards, an appointment card and an opening-announcement postcard."
    >
      <Ground cx={280} cy={338} rx={252} ry={24} opacity={0.13} />
      <Piece transform="translate(14 12) scale(1.04) rotate(-3)">
        <LetterheadFace />
      </Piece>
      <Piece transform="translate(190 14) scale(1.18) rotate(2)" soft>
        <PostcardCommunity />
      </Piece>
      <Piece transform="translate(422 22) scale(0.96) rotate(4)" soft>
        <DoorHangerFace />
      </Piece>
      <Piece transform="translate(186 178) scale(1.06) rotate(-2)">
        <EnvelopeFace />
      </Piece>
      <Piece transform="translate(178 258) scale(0.88) rotate(3)">
        <CardStack layers={6}>
          <BusinessCardFace />
        </CardStack>
      </Piece>
      <Piece transform="translate(374 252) scale(0.86) rotate(-5)">
        <AppointmentCardFace />
      </Piece>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Design before / after                                               */
/* ------------------------------------------------------------------ */

export function DesignSample({
  state,
  className,
}: {
  state: "before" | "after";
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 200 140"
      className={className}
      role="img"
      aria-label={
        state === "before"
          ? "A plain, unstyled postcard layout supplied by a practice."
          : "The same postcard redesigned with practice branding, headline and service list."
      }
    >
      <Piece transform="translate(10 10)" soft>
        {state === "before" ? <PostcardPlain /> : <PostcardSmile />}
      </Piece>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Product tile mockups                                                */
/* ------------------------------------------------------------------ */

const tileLabels: Record<MockupKey, string> = {
  appointmentCards: "A printed stack of dental appointment reminder cards.",
  businessCards: "A printed stack of dental practice business cards.",
  directMailPostcards: "Dental direct-mail postcards ready for mailing.",
  brochures: "A tri-fold dental patient brochure standing open.",
  referralCards: "A printed stack of patient referral cards.",
  practiceEssentials: "Practice letterhead, envelope and rack card.",
  rackCards: "Two dental practice rack cards standing side by side.",
  doorHangers: "Dental practice door hangers with a die-cut hanging hole.",
  letterheadEnvelopes: "Dental practice letterhead with a matching printed envelope.",
  presentationFolders: "A branded pocket folder for new-patient paperwork.",
  patientEducation: "Printed patient education leaflets about treatment and aftercare.",
  customPrinting: "An assortment of printed dental practice pieces.",
  newPatientPostcards: "A new-patient dental postcard.",
  triFoldBrochures: "A tri-fold dental patient brochure standing open.",
};

function TileArt({ mockup }: { mockup: MockupKey }) {
  switch (mockup) {
    case "appointmentCards":
      return (
        <Piece transform="translate(20 16) scale(1.1) rotate(-4)">
          <CardStack layers={6}>
            <AppointmentCardFace />
          </CardStack>
        </Piece>
      );
    case "businessCards":
      return (
        <Piece transform="translate(20 16) scale(1.1) rotate(-5)">
          <CardStack layers={8}>
            <BusinessCardFace />
          </CardStack>
        </Piece>
      );
    case "referralCards":
      return (
        <Piece transform="translate(20 16) scale(1.1) rotate(-4)">
          <CardStack layers={6}>
            <ReferralCardFace />
          </CardStack>
        </Piece>
      );
    case "directMailPostcards":
      return (
        <>
          <Piece transform="translate(62 4) scale(0.92) rotate(7)" soft>
            <PostcardCommunity />
          </Piece>
          <Piece transform="translate(8 18) scale(1.06) rotate(-4)">
            <PostcardSmile />
          </Piece>
        </>
      );
    case "newPatientPostcards":
      return (
        <Piece transform="translate(20 12) scale(1.1) rotate(-3)">
          <PostcardSmile />
        </Piece>
      );
    case "brochures":
    case "triFoldBrochures":
      return (
        <Piece transform="translate(18 6) scale(0.86)">
          <BrochureStanding />
        </Piece>
      );
    case "practiceEssentials":
      return (
        <>
          <Piece transform="translate(12 8) scale(0.72) rotate(-4)" soft>
            <LetterheadFace />
          </Piece>
          <Piece transform="translate(180 14) scale(0.58) rotate(5)" soft>
            <RackCardFace />
          </Piece>
          <Piece transform="translate(56 86) scale(0.7) rotate(-2)">
            <EnvelopeFace />
          </Piece>
        </>
      );
    case "rackCards":
      return (
        <>
          <Piece transform="translate(132 18) scale(0.66) rotate(8)" soft>
            <RackCardFace />
          </Piece>
          <Piece transform="translate(66 10) scale(0.76) rotate(-4)">
            <RackCardFace />
          </Piece>
        </>
      );
    case "doorHangers":
      return (
        <>
          <Piece transform="translate(130 14) scale(0.58) rotate(8)" soft>
            <DoorHangerFace />
          </Piece>
          <Piece transform="translate(64 8) scale(0.68) rotate(-4)">
            <DoorHangerFace />
          </Piece>
        </>
      );
    case "letterheadEnvelopes":
      return (
        <>
          <Piece transform="translate(26 6) scale(0.7) rotate(-4)" soft>
            <LetterheadFace />
          </Piece>
          <Piece transform="translate(106 50) scale(0.6) rotate(-6)" soft>
            <EnvelopeFace />
          </Piece>
          <Piece transform="translate(92 88) scale(0.72) rotate(4)">
            <EnvelopeFace />
          </Piece>
        </>
      );
    case "presentationFolders":
      return (
        <>
          <Piece transform="translate(118 18) scale(0.5) rotate(8)" soft>
            <PresentationFolderFace />
          </Piece>
          <Piece transform="translate(52 10) scale(0.58) rotate(-4)">
            <PresentationFolderFace />
          </Piece>
        </>
      );
    case "patientEducation":
      return (
        <>
          <Piece transform="translate(124 20) scale(0.62) rotate(8)" soft>
            <PatientLeafletFace />
          </Piece>
          <Piece transform="translate(56 12) scale(0.7) rotate(-5)">
            <PatientLeafletFace />
          </Piece>
        </>
      );
    case "customPrinting":
      return (
        <>
          <Piece transform="translate(182 12) scale(0.46) rotate(8)" soft>
            <RackCardFace />
          </Piece>
          <Piece transform="translate(30 8) scale(0.8) rotate(-4)">
            <PostcardSmile />
          </Piece>
          <Piece transform="translate(34 80) scale(0.56) rotate(3)">
            <CardStack layers={5}>
              <BusinessCardFace />
            </CardStack>
          </Piece>
        </>
      );
  }
}

/** Mockup art sized for a product tile. Fills its container. */
export function ProductMockup({
  mockup,
  className,
}: {
  mockup: MockupKey;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 240 156"
      className={className}
      role="img"
      aria-label={tileLabels[mockup]}
    >
      <TileArt mockup={mockup} />
    </svg>
  );
}
