import type { MockupKey } from "@/content/products";
import {
  AppointmentCardFace,
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
      viewBox="0 0 660 452"
      className={className}
      role="img"
      aria-label="Printed dental marketing materials: a new-patient postcard, a tri-fold patient brochure, a stack of business cards and a stack of appointment reminder cards."
    >
      {/* Surface the whole group sits on. */}
      <Ground cx={330} cy={418} rx={286} ry={26} opacity={0.12} />

      <Ground cx={528} cy={212} rx={128} ry={14} />
      <Piece transform="translate(398 14) scale(1.1)">
        <BrochureStanding />
      </Piece>

      <Ground cx={548} cy={366} rx={52} ry={11} />
      <Piece transform="translate(506 218) scale(0.84) rotate(4)">
        <RackCardFace />
      </Piece>

      <Ground cx={220} cy={250} rx={172} ry={16} />
      <Piece transform="translate(52 20) scale(1.78) rotate(-2.5)">
        <PostcardSmile />
      </Piece>

      <Ground cx={122} cy={400} rx={100} ry={13} />
      <Piece transform="translate(30 276) rotate(-4)">
        <CardStack layers={8}>
          <BusinessCardFace />
        </CardStack>
      </Piece>

      <Ground cx={362} cy={424} rx={100} ry={13} />
      <Piece transform="translate(272 300) rotate(3)">
        <CardStack layers={6}>
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
  newPatientPostcards: "A new-patient dental postcard.",
  triFoldBrochures: "A tri-fold dental patient brochure standing open.",
};

function TileArt({ mockup }: { mockup: MockupKey }) {
  switch (mockup) {
    case "appointmentCards":
      return (
        <Piece transform="translate(34 24) scale(0.96) rotate(-4)">
          <CardStack layers={6}>
            <AppointmentCardFace />
          </CardStack>
        </Piece>
      );
    case "businessCards":
      return (
        <Piece transform="translate(32 24) scale(0.98) rotate(-5)">
          <CardStack layers={8}>
            <BusinessCardFace />
          </CardStack>
        </Piece>
      );
    case "referralCards":
      return (
        <Piece transform="translate(32 24) scale(0.96) rotate(-4)">
          <CardStack layers={6}>
            <ReferralCardFace />
          </CardStack>
        </Piece>
      );
    case "directMailPostcards":
      return (
        <>
          <Piece transform="translate(64 12) scale(0.82) rotate(7)" soft>
            <PostcardCommunity />
          </Piece>
          <Piece transform="translate(22 26) scale(0.94) rotate(-4)">
            <PostcardSmile />
          </Piece>
        </>
      );
    case "newPatientPostcards":
      return (
        <Piece transform="translate(32 20) scale(0.98) rotate(-3)">
          <PostcardSmile />
        </Piece>
      );
    case "brochures":
    case "triFoldBrochures":
      return (
        <Piece transform="translate(30 20) scale(0.74)">
          <BrochureStanding />
        </Piece>
      );
    case "practiceEssentials":
      return (
        <>
          <Piece transform="translate(22 16) scale(0.62) rotate(-4)" soft>
            <LetterheadFace />
          </Piece>
          <Piece transform="translate(168 22) scale(0.5) rotate(5)" soft>
            <RackCardFace />
          </Piece>
          <Piece transform="translate(64 92) scale(0.6) rotate(-2)">
            <EnvelopeFace />
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
