import { CtaBanner } from "@/components/ui/CtaBanner";

export function FinalCta() {
  return (
    <CtaBanner
      title="Ready to Put Your Practice in Print?"
      body="Explore our printing products or tell us what you need. We'll help you find the right solution for your practice."
      primary={{ label: "Shop Printing Products", href: "/printing-products" }}
      secondary={{ label: "Request a Quote", href: "/request-a-quote" }}
    />
  );
}
