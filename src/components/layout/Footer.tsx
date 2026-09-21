import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { Container } from "@/components/ui/Container";
import { ArrowRight } from "@/components/ui/icons";
import { brand, footerNav } from "@/content/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-white">
      <Container>
        <div className="grid gap-7 py-10 sm:gap-10 sm:py-14 lg:grid-cols-[minmax(0,1.15fr)_repeat(3,minmax(0,1fr))] lg:gap-8 lg:py-16">
          <div className="flex flex-col gap-4">
            <Logo />
            <p className="max-w-xs text-sm leading-relaxed text-muted lg:text-[0.9375rem]">
              {brand.description}
            </p>
            <Link
              href="/request-a-quote"
              className="inline-flex items-center gap-1.5 py-1 text-sm font-semibold text-teal-700 underline-offset-4 hover:underline"
            >
              Request a Quote
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {footerNav.map((group) => (
            <div key={group.heading}>
              <h2 className="text-sm font-bold text-navy">{group.heading}</h2>
              <ul className="mt-3 flex flex-col gap-1.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="inline-block py-1 text-sm text-muted transition-colors hover:text-teal"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3 border-t border-line py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted">
            © {year} {brand.name}. All rights reserved.
          </p>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-teal-700">
            {brand.tagline}
          </p>
        </div>
      </Container>
    </footer>
  );
}
