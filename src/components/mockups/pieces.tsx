/**
 * Individual printed pieces, drawn at the origin in fixed "natural" units so
 * that arrangements can place them with translate / rotate / scale.
 *
 * Natural sizes:
 *   card 180×103 · postcard 180×120 · brochure panel 96×148
 *   rack card 72×168 · door hanger 84×190 · letterhead 150×194 · envelope 190×88
 *
 * These are vector mockups authored for this site, not crops of the design
 * comps — they stay sharp at any render size.
 */

const NAVY = "#0f2d4a";
const TEAL = "#00a3b4";
const MUTED = "#8b98a8";

export const PAPER_SHADOW = "drop-shadow(0 12px 20px rgba(15,45,74,0.22))";
export const PAPER_SHADOW_SM = "drop-shadow(0 6px 12px rgba(15,45,74,0.18))";

/* ------------------------------------------------------------------ */
/* Shared artwork primitives                                           */
/* ------------------------------------------------------------------ */

/** Curved brand band that anchors the bottom of most pieces. */
export function Swoosh({
  w,
  h,
  top,
  fill = "url(#dp-wave)",
  opacity = 1,
}: {
  w: number;
  h: number;
  top: number;
  fill?: string;
  opacity?: number;
}) {
  const d = `M0 ${top + h * 0.07} C ${w * 0.24} ${top - h * 0.085}, ${w * 0.52} ${
    top + h * 0.12
  }, ${w} ${top - h * 0.03} L ${w} ${h} L 0 ${h} Z`;
  return <path d={d} fill={fill} opacity={opacity} />;
}

/** The tooth mark at mockup scale. `size` is the drawn height. */
export function MarkGlyph({
  size = 16,
  outline = NAVY,
  accent = TEAL,
}: {
  size?: number;
  outline?: string;
  accent?: string;
}) {
  const s = size / 72;
  return (
    <g transform={`scale(${s})`}>
      <path
        d="M30 5C17 5 6 11.5 6 25.5c0 7.5 2.5 14.5 5.5 23.5 2 6 3 12 4 16 1 4.5 6 5 7.3.5 1.5-5.5 2.7-13.5 4.2-17 1-2.3 5-2.3 6 0 1.5 3.5 2.7 11.5 4.2 17 1.3 4.5 6.3 4 7.3-.5 1-4 2-10 4-16 3-9 5.5-16 5.5-23.5C54 11.5 43 5 30 5Z"
        fill="none"
        stroke={outline}
        strokeWidth={6}
        strokeLinejoin="round"
      />
      <path
        d="M15.8 24.4c.4-6.2 5-10.9 11.4-12.2"
        fill="none"
        stroke={accent}
        strokeWidth={5.5}
        strokeLinecap="round"
      />
    </g>
  );
}

/** Tooth mark + stacked wordmark, as it appears printed on a piece. */
export function MiniLogo({
  size = 15,
  light = false,
}: {
  size?: number;
  light?: boolean;
}) {
  const gap = size * 0.88;
  return (
    <g>
      <MarkGlyph
        size={size}
        outline={light ? "#ffffff" : NAVY}
        accent={light ? "#7dd3fc" : TEAL}
      />
      <text
        x={gap}
        y={size * 0.45}
        fontSize={size * 0.44}
        fontWeight={700}
        fill={light ? "#ffffff" : NAVY}
      >
        Dentistry
      </text>
      <text
        x={gap}
        y={size * 0.94}
        fontSize={size * 0.44}
        fontWeight={700}
        fill={light ? "#7dd3fc" : TEAL}
      >
        Printing
      </text>
    </g>
  );
}

/** Abstract stand-ins for body copy that would be illegible at mockup scale. */
export function Lines({
  x = 0,
  y = 0,
  widths,
  gap = 5,
  height = 2.4,
  fill = MUTED,
  opacity = 0.55,
}: {
  x?: number;
  y?: number;
  widths: number[];
  gap?: number;
  height?: number;
  fill?: string;
  opacity?: number;
}) {
  return (
    <g opacity={opacity}>
      {widths.map((w, i) => (
        <rect
          key={i}
          x={x}
          y={y + i * (height + gap)}
          width={w}
          height={height}
          rx={height / 2}
          fill={fill}
        />
      ))}
    </g>
  );
}

/** Ticked service list, as printed on new-patient postcards. */
export function TickList({
  x = 0,
  y = 0,
  items,
  gap = 9,
  size = 5.2,
  color = NAVY,
  tick = TEAL,
}: {
  x?: number;
  y?: number;
  items: string[];
  gap?: number;
  size?: number;
  color?: string;
  tick?: string;
}) {
  return (
    <g>
      {items.map((label, i) => {
        const cy = y + i * gap;
        return (
          <g key={label}>
            <path
              d={`M${x} ${cy - 1.4} l1.8 1.9 3.4-4`}
              fill="none"
              stroke={tick}
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <text x={x + 8} y={cy + 1.1} fontSize={size} fontWeight={500} fill={color}>
              {label}
            </text>
          </g>
        );
      })}
    </g>
  );
}

/**
 * Artwork panel used where a printed piece would carry a photograph.
 *
 * This is a designed graphic — layered "smile" arcs over a brand gradient —
 * rather than unrelated stock photography. Swap for licensed imagery once
 * photo assets are supplied.
 */
export function ArtPanel({
  w,
  h,
  deep = false,
  showMark = true,
}: {
  w: number;
  h: number;
  deep?: boolean;
  /** Suppress the tooth watermark where headline type sits over the panel. */
  showMark?: boolean;
}) {
  const cx = w * 0.52;
  const cy = h * 1.02;
  return (
    <g>
      <rect width={w} height={h} fill={deep ? "url(#dp-art-deep)" : "url(#dp-art)"} />
      {[0.92, 0.72, 0.52, 0.32].map((r, i) => (
        <circle
          key={r}
          cx={cx}
          cy={cy}
          r={Math.min(w, h) * r}
          fill="none"
          stroke="#ffffff"
          strokeWidth={Math.max(0.9, h * 0.012)}
          opacity={0.14 + i * 0.05}
        />
      ))}
      <path
        d={`M${w * -0.05} ${h * 0.78} C ${w * 0.3} ${h * 0.52}, ${w * 0.7} ${h * 0.52}, ${
          w * 1.05
        } ${h * 0.78}`}
        fill="none"
        stroke="#ffffff"
        strokeWidth={Math.max(1.2, h * 0.018)}
        opacity={0.32}
      />
      {showMark && (
        <g transform={`translate(${w * 0.5 - h * 0.13} ${h * 0.2})`} opacity={0.9}>
          <MarkGlyph size={h * 0.26} outline="#ffffff" accent="#ffffff" />
        </g>
      )}
    </g>
  );
}

/** Paper base: sheen fill plus a hairline edge so pieces read as stock. */
function Sheet({ w, h, rx = 4 }: { w: number; h: number; rx?: number }) {
  return (
    <>
      <rect width={w} height={h} rx={rx} fill="url(#dp-paper)" />
      <rect
        x={0.35}
        y={0.35}
        width={w - 0.7}
        height={h - 0.7}
        rx={rx}
        fill="none"
        stroke="#0f2d4a"
        strokeOpacity={0.09}
        strokeWidth={0.7}
      />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Business card — 180 × 103                                           */
/* ------------------------------------------------------------------ */

export function BusinessCardFace() {
  return (
    <g>
      <Sheet w={180} h={103} />
      <g clipPath="url(#dp-clip-card)">
        <Swoosh w={180} h={103} top={72} fill="url(#dp-wave-soft)" opacity={0.28} />
        <Swoosh w={180} h={103} top={82} />
      </g>
      <g transform="translate(20 26)">
        <MiniLogo size={26} />
      </g>
      <Lines x={20} y={62} widths={[62, 44]} gap={4} height={2.2} />
    </g>
  );
}

/** A printed stack: visible paper edges with the face on top. */
export function CardStack({
  layers = 7,
  step = 2.6,
  w = 180,
  h = 103,
  children,
}: {
  layers?: number;
  step?: number;
  w?: number;
  h?: number;
  children: React.ReactNode;
}) {
  return (
    <g>
      {Array.from({ length: layers }).map((_, i) => {
        const offset = (layers - i) * step;
        return (
          <g key={i} transform={`translate(${offset * 0.28} ${offset})`}>
            <rect width={w} height={h} rx={4} fill={i % 2 === 0 ? "#ffffff" : "#eaeef3"} />
            <rect
              x={0.3}
              y={0.3}
              width={w - 0.6}
              height={h - 0.6}
              rx={4}
              fill="none"
              stroke="#0f2d4a"
              strokeOpacity={0.12}
              strokeWidth={0.6}
            />
          </g>
        );
      })}
      {children}
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* Appointment card — 180 × 103                                        */
/* ------------------------------------------------------------------ */

export function AppointmentCardFace() {
  return (
    <g>
      <Sheet w={180} h={103} />
      <g clipPath="url(#dp-clip-card)">
        {/* Faint tooth watermark, as printed. */}
        <g transform="translate(118 20)" opacity={0.12}>
          <MarkGlyph size={78} outline={TEAL} accent={TEAL} />
        </g>
        <Swoosh w={180} h={103} top={90} fill="url(#dp-wave-soft)" opacity={0.5} />
      </g>
      <text x={16} y={22} fontSize={11} fontWeight={700} fill={NAVY}>
        Your Next
      </text>
      <text x={16} y={34} fontSize={11} fontWeight={700} fill={NAVY}>
        Appointment
      </text>
      {["Name", "Date", "Time"].map((label, i) => {
        const y = 50 + i * 13;
        return (
          <g key={label}>
            <text x={16} y={y} fontSize={6} fontWeight={500} fill={MUTED}>
              {label}
            </text>
            <line
              x1={34}
              y1={y + 1}
              x2={108}
              y2={y + 1}
              stroke={NAVY}
              strokeOpacity={0.22}
              strokeWidth={0.8}
            />
          </g>
        );
      })}
      <g transform="translate(16 84)">
        <MiniLogo size={13} />
      </g>
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* Referral card — 180 × 103                                           */
/* ------------------------------------------------------------------ */

export function ReferralCardFace() {
  return (
    <g>
      <Sheet w={180} h={103} />
      <g clipPath="url(#dp-clip-card)">
        <rect width={180} height={30} fill="url(#dp-teal)" />
        <Swoosh w={180} h={103} top={92} opacity={0.9} />
      </g>
      <text x={16} y={19} fontSize={9.5} fontWeight={700} fill="#ffffff">
        Refer a Friend
      </text>
      <text x={16} y={46} fontSize={7.5} fontWeight={600} fill={NAVY}>
        Know someone looking
      </text>
      <text x={16} y={56} fontSize={7.5} fontWeight={600} fill={NAVY}>
        for a new dentist?
      </text>
      <Lines x={16} y={64} widths={[96, 74]} gap={4} height={2.2} />
      <g transform="translate(126 42)">
        <MarkGlyph size={30} outline={TEAL} accent="#7dd3fc" />
      </g>
      <g transform="translate(16 84)">
        <MiniLogo size={12} />
      </g>
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* Postcards — 180 × 120                                               */
/* ------------------------------------------------------------------ */

/** New-patient postcard: headline + service ticks + artwork panel. */
export function PostcardSmile() {
  return (
    <g>
      <Sheet w={180} h={120} />
      <g clipPath="url(#dp-clip-postcard)">
        <g transform="translate(104 0)">
          <ArtPanel w={76} h={92} />
        </g>
        <Swoosh w={180} h={120} top={92} fill="url(#dp-wave-soft)" opacity={0.3} />
        <Swoosh w={180} h={120} top={100} />
      </g>
      <text x={13} y={24} fontSize={11} fontWeight={700} fill={NAVY}>
        A Brighter
      </text>
      <text x={13} y={36} fontSize={11} fontWeight={700} fill={TEAL}>
        Smile Starts
      </text>
      <text x={13} y={48} fontSize={11} fontWeight={700} fill={NAVY}>
        Here.
      </text>
      <text x={13} y={60} fontSize={6} fontWeight={600} fill={TEAL}>
        New Patients Welcome!
      </text>
      <TickList
        x={13}
        y={71}
        gap={8}
        size={5}
        items={["General Dentistry", "Cosmetic Dentistry", "Family Dentistry"]}
      />
      <g transform="translate(13 104)">
        <MiniLogo size={12} light />
      </g>
      <text x={112} y={110} fontSize={5.4} fontWeight={600} fill="#ffffff" opacity={0.95}>
        Healthy Smiles,
      </text>
      <text x={112} y={116} fontSize={5.4} fontWeight={600} fill="#ffffff" opacity={0.95}>
        Healthier Lives.
      </text>
    </g>
  );
}

/** Community/EDDM postcard: full-bleed artwork with a headline overlay. */
export function PostcardCommunity() {
  return (
    <g>
      <Sheet w={180} h={120} />
      <g clipPath="url(#dp-clip-postcard)">
        <ArtPanel w={180} h={120} deep showMark={false} />
        <rect width={180} height={120} fill={NAVY} opacity={0.28} />
        <g transform="translate(134 14)" opacity={0.85}>
          <MarkGlyph size={30} outline="#ffffff" accent="#7dd3fc" />
        </g>
        <Swoosh w={180} h={120} top={98} fill="#ffffff" opacity={0.96} />
      </g>
      <text x={13} y={26} fontSize={10.5} fontWeight={700} fill="#ffffff">
        Healthy Smiles,
      </text>
      <text x={13} y={38} fontSize={10.5} fontWeight={700} fill="#ffffff">
        Happier
      </text>
      <text x={13} y={50} fontSize={10.5} fontWeight={700} fill="#7dd3fc">
        Communities.
      </text>
      <rect x={13} y={58} width={86} height={13} rx={6.5} fill="#ffffff" opacity={0.94} />
      <text x={20} y={66.8} fontSize={5.8} fontWeight={700} fill={NAVY}>
        New Patients Welcome!
      </text>
      <g transform="translate(13 104)">
        <MiniLogo size={12} />
      </g>
      <g transform="translate(112 102)">
        {["General", "Cosmetic", "Family"].map((label, i) => (
          <g key={label} transform={`translate(${i * 22} 0)`}>
            <MarkGlyph size={9} outline={TEAL} accent={TEAL} />
            <text x={0} y={15} fontSize={3.8} fontWeight={600} fill={NAVY}>
              {label}
            </text>
          </g>
        ))}
      </g>
    </g>
  );
}

/** The "before" sample in the design section: unstyled, type-only artwork. */
export function PostcardPlain() {
  return (
    <g>
      <Sheet w={180} h={120} />
      <g clipPath="url(#dp-clip-postcard)">
        <rect width={180} height={120} fill="url(#dp-flat)" />
      </g>
      <text x={24} y={52} fontSize={13} fontWeight={600} fill="#8a939e">
        New Patients
      </text>
      <text x={24} y={68} fontSize={13} fontWeight={600} fill="#8a939e">
        Welcome!
      </text>
      <Lines x={24} y={80} widths={[86, 62]} gap={5} height={2.6} fill="#a8b0ba" opacity={0.8} />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* Brochure — panel 96 × 148                                           */
/* ------------------------------------------------------------------ */

export function BrochurePanelFront() {
  return (
    <g>
      <Sheet w={96} h={148} rx={3} />
      <g clipPath="url(#dp-clip-panel)">
        <g transform="translate(0 40)">
          <ArtPanel w={96} h={62} />
        </g>
        <Swoosh w={96} h={148} top={126} />
      </g>
      <text x={10} y={18} fontSize={8.5} fontWeight={700} fill={NAVY}>
        Confident
      </text>
      <text x={10} y={28} fontSize={8.5} fontWeight={700} fill={TEAL}>
        Smiles for Life.
      </text>
      <Lines x={10} y={108} widths={[70, 58, 64]} gap={4} height={2.2} />
      <g transform="translate(10 132)">
        <MiniLogo size={11} light />
      </g>
    </g>
  );
}

export function BrochurePanelInner({ tone = "light" }: { tone?: "light" | "teal" }) {
  const teal = tone === "teal";
  return (
    <g>
      <Sheet w={96} h={148} rx={3} />
      <g clipPath="url(#dp-clip-panel)">
        {teal && <rect width={96} height={40} fill="url(#dp-teal)" />}
        <g transform="translate(10 52)">
          <ArtPanel w={76} h={40} />
        </g>
        <Swoosh w={96} h={148} top={134} fill="url(#dp-wave-soft)" opacity={0.45} />
      </g>
      <text x={10} y={teal ? 22 : 20} fontSize={7} fontWeight={700} fill={teal ? "#ffffff" : NAVY}>
        Our Services
      </text>
      <Lines x={10} y={teal ? 28 : 28} widths={[58, 44]} gap={4} height={2} fill={teal ? "#ffffff" : MUTED} opacity={teal ? 0.75 : 0.5} />
      <TickList
        x={10}
        y={104}
        gap={8}
        size={4.6}
        items={["Preventive Care", "Restorative", "Cosmetic", "Implants"]}
      />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* Rack card — 72 × 168                                                */
/* ------------------------------------------------------------------ */

export function RackCardFace() {
  return (
    <g>
      <Sheet w={72} h={168} rx={3} />
      <g clipPath="url(#dp-clip-rack)">
        <rect width={72} height={168} fill="url(#dp-teal)" />
        <g transform="translate(0 96)">
          <ArtPanel w={72} h={72} deep />
        </g>
        <Swoosh w={72} h={168} top={150} fill="#ffffff" opacity={0.95} />
      </g>
      <g transform="translate(21 16)">
        <MarkGlyph size={30} outline="#ffffff" accent="#7dd3fc" />
      </g>
      <text x={11} y={68} fontSize={7.5} fontWeight={700} fill="#ffffff">
        Healthy
      </text>
      <text x={11} y={78} fontSize={7.5} fontWeight={700} fill="#ffffff">
        Smiles,
      </text>
      <text x={11} y={88} fontSize={7.5} fontWeight={700} fill="#7dd3fc">
        Brighter Lives.
      </text>
      <g transform="translate(11 154)">
        <MiniLogo size={10} />
      </g>
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* Door hanger — 84 × 190                                              */
/* ------------------------------------------------------------------ */

/** Hanger body with the hanging hole as a second, even-odd subpath. */
const HANGER_OUTLINE =
  "M6 0h72a6 6 0 0 1 6 6v178a6 6 0 0 1-6 6H6a6 6 0 0 1-6-6V6a6 6 0 0 1 6-6Zm36 10a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z";

export function DoorHangerFace() {
  return (
    <g>
      {/* Body and die-cut hanging hole as a single even-odd path. */}
      <path
        fillRule="evenodd"
        d={HANGER_OUTLINE}
        fill="url(#dp-paper)"
      />
      <g clipPath="url(#dp-clip-hanger)">
        <rect width={84} height={190} fill="url(#dp-teal)" />
        <Swoosh w={84} h={190} top={162} fill="#ffffff" opacity={0.95} />
      </g>
      <text x={12} y={62} fontSize={8.5} fontWeight={700} fill="#ffffff">
        We&apos;re
      </text>
      <text x={12} y={73} fontSize={8.5} fontWeight={700} fill="#ffffff">
        Accepting
      </text>
      <text x={12} y={84} fontSize={8.5} fontWeight={700} fill="#ffffff">
        New Patients!
      </text>
      <Lines x={12} y={94} widths={[58, 44]} gap={4} height={2.2} fill="#ffffff" opacity={0.7} />
      <g transform="translate(27 114)">
        <MarkGlyph size={28} outline="#ffffff" accent="#7dd3fc" />
      </g>
      <g transform="translate(12 168)">
        <MiniLogo size={11} />
      </g>
      <path
        fillRule="evenodd"
        d={HANGER_OUTLINE}
        fill="none"
        stroke="#0f2d4a"
        strokeOpacity={0.12}
        strokeWidth={0.7}
      />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* Letterhead 150 × 194 and envelope 190 × 88                          */
/* ------------------------------------------------------------------ */

export function LetterheadFace() {
  return (
    <g>
      <Sheet w={150} h={194} rx={3} />
      <g clipPath="url(#dp-clip-letter)">
        <Swoosh w={150} h={194} top={176} fill="url(#dp-wave-soft)" opacity={0.55} />
      </g>
      <g transform="translate(16 16)">
        <MiniLogo size={17} />
      </g>
      <line x1={16} y1={44} x2={134} y2={44} stroke={TEAL} strokeWidth={1.2} opacity={0.6} />
      <Lines x={16} y={56} widths={[54, 40]} gap={4} height={2.2} />
      <Lines x={16} y={82} widths={[116, 104, 112, 92, 108, 70]} gap={5} height={2.4} opacity={0.4} />
      <Lines x={16} y={140} widths={[100, 84, 46]} gap={5} height={2.4} opacity={0.4} />
    </g>
  );
}

export function EnvelopeFace() {
  return (
    <g>
      <Sheet w={190} h={88} rx={3} />
      <g clipPath="url(#dp-clip-envelope)">
        <Swoosh w={190} h={88} top={74} fill="url(#dp-wave-soft)" opacity={0.5} />
        {/* Flap seam */}
        <path
          d="M0 0 L95 42 L190 0"
          fill="none"
          stroke="#0f2d4a"
          strokeOpacity={0.12}
          strokeWidth={0.8}
        />
      </g>
      <g transform="translate(14 12)">
        <MiniLogo size={13} />
      </g>
      <Lines x={14} y={38} widths={[46, 34]} gap={3.5} height={2} />
      <rect
        x={150}
        y={10}
        width={26}
        height={22}
        rx={2}
        fill="none"
        stroke={NAVY}
        strokeOpacity={0.2}
        strokeWidth={0.8}
        strokeDasharray="2 2"
      />
    </g>
  );
}
