import type { ReactNode } from "react";

/**
 * Section title with the teal underline rule from the design reference.
 * On desktop the supporting copy can sit beside the heading (`side`);
 * on mobile it always stacks underneath.
 */
export function SectionHeading({
  title,
  children,
  tone = "light",
  layout = "stacked",
  action,
  className = "",
}: {
  title: ReactNode;
  children?: ReactNode;
  tone?: "light" | "dark";
  layout?: "stacked" | "side";
  action?: ReactNode;
  className?: string;
}) {
  const dark = tone === "dark";

  const heading = (
    <h2
      className={`heading-rule text-balance-tight text-[1.75rem] font-bold leading-[1.15] tracking-[-0.02em] sm:text-4xl lg:text-[2.75rem] ${
        dark ? "text-white" : "text-navy"
      }`}
    >
      {title}
    </h2>
  );

  const body = children && (
    <p
      className={`max-w-xl text-[0.9375rem] leading-relaxed sm:text-base ${
        dark ? "text-sky-100/85" : "text-muted"
      }`}
    >
      {children}
    </p>
  );

  if (layout === "side") {
    return (
      <div
        className={`grid gap-4 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:items-end lg:gap-10 ${className}`}
      >
        <div>{heading}</div>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-6 lg:pb-2">
          {body}
          {action && <div className="shrink-0">{action}</div>}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {heading}
      {body}
      {action && <div>{action}</div>}
    </div>
  );
}
