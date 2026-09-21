/**
 * Line-icon set. All icons are 24×24, stroke-based and inherit `currentColor`
 * so a single component works on white, light-blue and navy backgrounds.
 */
type IconProps = { className?: string };

const S = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  focusable: "false",
} as const;

export const ArrowRight = ({ className }: IconProps) => (
  <svg {...S} className={className}>
    <path d="M4 12h15" />
    <path d="m13 6 6 6-6 6" />
  </svg>
);

export const Search = ({ className }: IconProps) => (
  <svg {...S} className={className}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m16 16 4 4" />
  </svg>
);

export const UserIcon = ({ className }: IconProps) => (
  <svg {...S} className={className}>
    <circle cx="12" cy="8" r="3.75" />
    <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
  </svg>
);

export const CartIcon = ({ className }: IconProps) => (
  <svg {...S} className={className}>
    <path d="M2.5 3.5h2.2l2.3 11h10.2l2.3-8H6" />
    <circle cx="9" cy="19.2" r="1.5" />
    <circle cx="17" cy="19.2" r="1.5" />
  </svg>
);

export const MenuIcon = ({ className }: IconProps) => (
  <svg {...S} strokeWidth={2} className={className}>
    <path d="M3.5 7h17" />
    <path d="M3.5 12h17" />
    <path d="M3.5 17h17" />
  </svg>
);

export const CloseIcon = ({ className }: IconProps) => (
  <svg {...S} strokeWidth={2} className={className}>
    <path d="m6 6 12 12" />
    <path d="M18 6 6 18" />
  </svg>
);

export const PlusIcon = ({ className }: IconProps) => (
  <svg {...S} strokeWidth={2} className={className}>
    <path d="M12 5.5v13" />
    <path d="M5.5 12h13" />
  </svg>
);

export const MinusIcon = ({ className }: IconProps) => (
  <svg {...S} strokeWidth={2} className={className}>
    <path d="M5.5 12h13" />
  </svg>
);

export const TruckIcon = ({ className }: IconProps) => (
  <svg {...S} className={className}>
    <path d="M2.5 6.5h10.5v10H2.5z" />
    <path d="M13 9.5h3.7l2.8 3v4H13z" />
    <circle cx="7" cy="18" r="1.7" />
    <circle cx="16.5" cy="18" r="1.7" />
  </svg>
);

export const PencilIcon = ({ className }: IconProps) => (
  <svg {...S} className={className}>
    <path d="M4 20h4l10-10a2.6 2.6 0 0 0-3.7-3.7L4.3 16.3 4 20Z" />
    <path d="m13.6 7.4 3.3 3.3" />
  </svg>
);

export const PrinterIcon = ({ className }: IconProps) => (
  <svg {...S} className={className}>
    <path d="M7 8.5v-5h10v5" />
    <path d="M7 17H4.5v-6a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v6H17" />
    <path d="M7 13.5h10V21H7z" />
  </svg>
);

export const CursorIcon = ({ className }: IconProps) => (
  <svg {...S} className={className}>
    <path d="m5.5 3.5 4.3 16 2.6-6.4 6.6-2.4L5.5 3.5Z" />
  </svg>
);

export const UploadIcon = ({ className }: IconProps) => (
  <svg {...S} className={className}>
    <path d="M6.5 17.5a4 4 0 0 1-.4-8 5.5 5.5 0 0 1 10.6-1.2 3.9 3.9 0 0 1 .8 7.8" />
    <path d="M12 20.5V10.8" />
    <path d="m8.8 13.8 3.2-3.2 3.2 3.2" />
  </svg>
);

export const CheckCircleIcon = ({ className }: IconProps) => (
  <svg {...S} className={className}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="m8.3 12.2 2.6 2.6 4.8-5.2" />
  </svg>
);

export const MapPinIcon = ({ className }: IconProps) => (
  <svg {...S} className={className}>
    <path d="M12 21s6.5-5.7 6.5-10.3a6.5 6.5 0 1 0-13 0C5.5 15.3 12 21 12 21Z" />
    <circle cx="12" cy="10.5" r="2.4" />
  </svg>
);

export const MailIcon = ({ className }: IconProps) => (
  <svg {...S} className={className}>
    <rect x="2.8" y="5.3" width="18.4" height="13.4" rx="2" />
    <path d="m3.6 6.6 8.4 6.2 8.4-6.2" />
  </svg>
);

export const CheckIcon = ({ className }: IconProps) => (
  <svg {...S} strokeWidth={2.4} className={className}>
    <path d="m5 12.5 4.5 4.5L19 7" />
  </svg>
);
