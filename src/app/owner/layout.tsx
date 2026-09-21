import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { Container } from "@/components/ui/Container";

/**
 * Owner area shell. Deliberately plain and separate from the marketing site
 * chrome: this is an internal tool, not a page customers ever see.
 */
export const metadata = { robots: { index: false, follow: false } };

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-mist">
      <header className="border-b border-line bg-white">
        <Container>
          <div className="flex items-center justify-between gap-4 py-3">
            <Link href="/owner/quotes" className="inline-flex">
              <Logo href={null} compact />
            </Link>
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
              Staff area
            </span>
          </div>
        </Container>
      </header>
      <main id="main">{children}</main>
    </div>
  );
}
