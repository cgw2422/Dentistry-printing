import { CtaBanner } from "@/components/ui/CtaBanner";

export function FinalCta() {
  return (
    <CtaBanner
      title="Ready to Put Your Practice in Print?"
      body="Tell us what you need and we'll come back with pricing and options. No account, no checkout — just a straight answer from someone who prints for dental practices."
      primary={{ label: "Request a Quote", href: "/request-a-quote" }}
      secondary={{ label: "Browse Printing Products", href: "/printing-products" }}
    />
  );
}
