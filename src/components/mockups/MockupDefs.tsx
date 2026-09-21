/**
 * Shared SVG paint + clip definitions for every printed-product mockup.
 *
 * These live in a single zero-size SVG rendered once per page so that the
 * individual mockups can reference them by id (`url(#dp-wave)`), rather than
 * each mockup emitting its own <defs> — which would produce duplicate ids
 * wherever the same product appears more than once on the page.
 */
export function MockupDefs() {
  return (
    <svg
      width="0"
      height="0"
      aria-hidden="true"
      focusable="false"
      style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
    >
      <defs>
        <linearGradient id="dp-wave" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#0f2d4a" />
          <stop offset="55%" stopColor="#0a7f92" />
          <stop offset="100%" stopColor="#00a3b4" />
        </linearGradient>

        <linearGradient id="dp-wave-soft" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#00a3b4" />
          <stop offset="100%" stopColor="#7dd3fc" />
        </linearGradient>

        <linearGradient id="dp-teal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#00a3b4" />
          <stop offset="100%" stopColor="#0089a6" />
        </linearGradient>

        <linearGradient id="dp-navy" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#14395c" />
          <stop offset="100%" stopColor="#0a2036" />
        </linearGradient>

        {/* Subtle sheen across a sheet of paper. */}
        <linearGradient id="dp-paper" x1="0" y1="0" x2="0.9" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="70%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#eef2f6" />
        </linearGradient>

        {/* Abstract artwork panel used in place of licensed photography. */}
        <linearGradient id="dp-art" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#cdf1f5" />
          <stop offset="55%" stopColor="#7dd3fc" />
          <stop offset="100%" stopColor="#00a3b4" />
        </linearGradient>

        <linearGradient id="dp-art-deep" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7dd3fc" />
          <stop offset="60%" stopColor="#0a7f92" />
          <stop offset="100%" stopColor="#0f2d4a" />
        </linearGradient>

        {/* Ink-free, faded artwork used for the "before" design sample. */}
        <linearGradient id="dp-flat" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f1f3f5" />
          <stop offset="100%" stopColor="#dfe3e8" />
        </linearGradient>

        {/* Soft blur used for contact shadows beneath placed pieces. */}
        <filter id="dp-soft" x="-40%" y="-120%" width="180%" height="340%">
          <feGaussianBlur stdDeviation="9" />
        </filter>

        {/* Corner clips, one per natural piece size (see pieces.tsx). */}
        <clipPath id="dp-clip-card">
          <rect width="180" height="103" rx="4" />
        </clipPath>
        <clipPath id="dp-clip-postcard">
          <rect width="180" height="120" rx="4" />
        </clipPath>
        <clipPath id="dp-clip-panel">
          <rect width="96" height="148" rx="3" />
        </clipPath>
        <clipPath id="dp-clip-rack">
          <rect width="72" height="168" rx="3" />
        </clipPath>
        <clipPath id="dp-clip-letter">
          <rect width="150" height="194" rx="3" />
        </clipPath>
        <clipPath id="dp-clip-envelope">
          <rect width="190" height="88" rx="3" />
        </clipPath>
        <clipPath id="dp-clip-hanger" clipRule="evenodd">
          <path
            clipRule="evenodd"
            d="M6 0h72a6 6 0 0 1 6 6v178a6 6 0 0 1-6 6H6a6 6 0 0 1-6-6V6a6 6 0 0 1 6-6Zm36 10a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z"
          />
        </clipPath>
      </defs>
    </svg>
  );
}
