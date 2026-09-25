"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { CloseIcon, MenuIcon } from "@/components/ui/icons";
import { primaryNav } from "@/content/site";

/** "/" matches only itself; other entries also match their sub-routes. */
function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Close on Escape, and hold the page still while the panel is open.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    panelRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/95 backdrop-blur-sm">
      <Container wide>
        <div className="flex items-center gap-4 py-3 xl:items-stretch xl:gap-8 xl:py-3.5">
          <div className="flex items-center">
            <Logo />
          </div>

          {/* ---- Desktop navigation ---- */}
          <nav aria-label="Main" className="hidden flex-1 items-center xl:flex">
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-1">
              {primaryNav.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={`inline-block py-1.5 text-sm font-medium transition-colors hover:text-teal ${
                        active
                          ? "text-navy underline decoration-teal decoration-2 underline-offset-[8px]"
                          : "text-muted"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* The only header action: this site sells by quote, so nothing
              competes with the one conversion. */}
          <div className="ml-auto hidden items-center xl:flex">
            <Button href="/request-a-quote" size="md" className="px-6">
              Request a Quote
            </Button>
          </div>

          {/* ---- Compact header controls ---- */}
          <div className="ml-auto flex items-center gap-0.5 xl:hidden">
            <button
              ref={toggleRef}
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full text-navy transition-colors hover:bg-mist"
            >
              {open ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </Container>

      {/* ---- Mobile menu panel ---- */}
      {open && (
        <div className="xl:hidden">
          <button
            type="button"
            aria-label="Close menu"
            tabIndex={-1}
            onClick={() => setOpen(false)}
            className="fixed inset-0 top-[var(--header-h,68px)] z-40 cursor-default bg-navy/35"
          />
          <div
            id="mobile-menu"
            ref={panelRef}
            tabIndex={-1}
            className="absolute inset-x-0 top-full z-50 max-h-[calc(100dvh-68px)] overflow-y-auto border-b border-line bg-white shadow-lift outline-none"
          >
            <Container>
              <nav aria-label="Mobile" className="py-4">
                <ul className="flex flex-col">
                  {primaryNav.map((item) => {
                    const active = isActive(pathname, item.href);
                    return (
                      <li key={item.href} className="border-b border-line/70 last:border-b-0">
                        <Link
                          href={item.href}
                          onClick={() => setOpen(false)}
                          aria-current={active ? "page" : undefined}
                          className={`block py-3.5 text-base font-semibold ${
                            active ? "text-teal" : "text-navy"
                          }`}
                        >
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>

                <div className="mt-5 flex flex-col gap-3 pb-6">
                  <Button
                    href="/request-a-quote"
                    fullWidth
                    withArrow
                    size="lg"
                    className="justify-center"
                  >
                    Request a Quote
                  </Button>
                </div>
              </nav>
            </Container>
          </div>
        </div>
      )}
    </header>
  );
}
