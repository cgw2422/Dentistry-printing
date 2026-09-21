import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

/**
 * The public site: marketing header, page content, marketing footer.
 *
 * Kept as a route group so the owner area does not inherit any of it. Route
 * groups do not appear in URLs, so every public path is unchanged.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main id="main">{children}</main>
      <Footer />
    </>
  );
}
