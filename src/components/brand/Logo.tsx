import Link from "next/link";
import { brand } from "@/content/site";
import { ToothMark } from "./ToothMark";

type Variant = "brand" | "light";

/**
 * Full logo lockup: tooth mark + stacked wordmark + tagline rule.
 * `compact` drops the tagline for tight mobile headers.
 */
export function Logo({
  variant = "brand",
  compact = false,
  className = "",
  href = "/",
}: {
  variant?: Variant;
  compact?: boolean;
  className?: string;
  href?: string | null;
}) {
  const light = variant === "light";

  const inner = (
    <span className={`flex items-center gap-2.5 sm:gap-3 ${className}`}>
      <ToothMark variant={variant} className={compact ? "h-9 w-auto" : "h-11 w-auto sm:h-12"} />
      <span className="flex flex-col leading-none">
        <span
          className={`text-[1.15rem] font-bold leading-[1.05] tracking-[-0.02em] sm:text-[1.3rem] ${
            light ? "text-white" : "text-navy"
          }`}
        >
          Dentistry
        </span>
        <span
          className={`text-[1.15rem] font-bold leading-[1.05] tracking-[-0.02em] sm:text-[1.3rem] ${
            light ? "text-sky" : "text-teal"
          }`}
        >
          Printing
        </span>
        {!compact && (
          <span
            className={`mt-1 hidden text-[0.5rem] font-medium uppercase tracking-[0.18em] sm:block ${
              light ? "text-sky-200/80" : "text-muted"
            }`}
          >
            {brand.tagline}
          </span>
        )}
      </span>
    </span>
  );

  if (!href) return inner;

  return (
    <Link href={href} aria-label={`${brand.name} — home`} className="inline-flex">
      {inner}
    </Link>
  );
}
