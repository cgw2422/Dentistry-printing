import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight } from "./icons";

type Variant = "primary" | "secondary" | "onDark" | "ghostOnDark";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors duration-200 " +
  // 48px min target on phones keeps every CTA comfortably tappable.
  "min-h-12 text-center";

const variants: Record<Variant, string> = {
  primary: "bg-teal text-white hover:bg-teal-700",
  secondary: "bg-white text-navy ring-1 ring-inset ring-navy/25 hover:ring-navy/50 hover:bg-mist",
  onDark: "bg-teal text-white hover:bg-teal-600",
  ghostOnDark: "bg-transparent text-white ring-1 ring-inset ring-white/45 hover:bg-white/10",
};

const sizes: Record<Size, string> = {
  md: "px-5 py-3 text-[0.9375rem]",
  lg: "px-7 py-3.5 text-base",
};

export function Button({
  href,
  children,
  variant = "primary",
  size = "md",
  withArrow = false,
  fullWidth = false,
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  withArrow?: boolean;
  fullWidth?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`${base} ${variants[variant]} ${sizes[size]} ${
        fullWidth ? "w-full" : ""
      } ${className}`}
    >
      {children}
      {withArrow && <ArrowRight className="h-4 w-4 shrink-0" />}
    </Link>
  );
}

/** Understated text link with a trailing arrow, used under primary CTAs. */
export function TextLink({
  href,
  children,
  tone = "light",
  className = "",
}: {
  href: string;
  children: ReactNode;
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-1.5 py-1 text-[0.9375rem] font-semibold underline-offset-4 hover:underline ${
        tone === "dark" ? "text-white" : "text-teal-700"
      } ${className}`}
    >
      {children}
      <ArrowRight className="h-3.5 w-3.5 shrink-0" />
    </Link>
  );
}
