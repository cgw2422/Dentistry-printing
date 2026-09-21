import Link from "next/link";
import { Container } from "@/components/ui/Container";

export type Crumb = { label: string; href?: string };

/** Trail of links ending in the current page, which is not a link. */
export function Breadcrumbs({ trail }: { trail: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="border-b border-line bg-white">
      <Container>
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 py-3.5 text-[0.8125rem] sm:text-sm">
          {trail.map((crumb, index) => {
            const last = index === trail.length - 1;
            return (
              <li key={crumb.label} className="flex items-center gap-2">
                {crumb.href && !last ? (
                  <Link
                    href={crumb.href}
                    className="inline-block py-1 font-medium text-muted transition-colors hover:text-teal"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span aria-current="page" className="py-1 font-semibold text-navy">
                    {crumb.label}
                  </span>
                )}
                {!last && (
                  <span aria-hidden="true" className="text-line">
                    ›
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </Container>
    </nav>
  );
}
