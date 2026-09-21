import type { ReactNode } from "react";

/** Page gutter. 20px on phones, widening with the viewport. */
export function Container({
  children,
  className = "",
  wide = false,
}: {
  children: ReactNode;
  className?: string;
  wide?: boolean;
}) {
  return (
    <div
      className={`mx-auto w-full px-5 sm:px-6 lg:px-10 ${
        wide ? "max-w-[1440px]" : "max-w-[1200px]"
      } ${className}`}
    >
      {children}
    </div>
  );
}
