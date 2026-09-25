import { Button } from "@/components/ui/Button";
import { CheckCircleIcon, CheckIcon, PencilIcon, TruckIcon } from "@/components/ui/icons";
import type { CustomizationOption } from "@/content/productDetails";

const ASSURANCES = [
  { icon: PencilIcon, label: "Design support available" },
  { icon: CheckCircleIcon, label: "Proof before printing" },
  { icon: TruckIcon, label: "Nationwide fulfillment" },
];

/**
 * The right-hand card: what can be customized, and the one action.
 *
 * Dentistry Printing does not sell online. There is no cart, no configured
 * pricing and no checkout, so this card does not pretend to be an order form.
 * It tells the visitor what is adjustable — in prose, not in controls they
 * cannot use — and sends them to Request a Quote with this product selected.
 */
export function ProductQuotePanel({
  customization,
  productName,
  productSlug,
}: {
  customization: CustomizationOption[];
  productName: string;
  /** Preselects this product on the quote form. */
  productSlug: string;
}) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-card ring-1 ring-line sm:p-6 lg:p-7">
      {customization.length > 0 && (
        <>
          <h2 className="text-xl font-bold text-navy sm:text-2xl">Customize Your Order</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Tell us what you need and we will confirm the options available for your practice.
          </p>
          <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
            {customization.map((option) => (
              <li key={option} className="flex items-start gap-2.5">
                <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal text-white">
                  <CheckIcon className="h-3 w-3" />
                </span>
                <span className="text-[0.9375rem] leading-snug text-navy">{option}</span>
              </li>
            ))}
          </ul>
        </>
      )}

      <div
        className={`rounded-xl bg-sky-50 px-4 py-3.5 ring-1 ring-inset ring-teal/20 ${
          customization.length > 0 ? "mt-6" : ""
        }`}
      >
        <p className="text-[0.9375rem] font-semibold text-navy">Pricing is quoted per job.</p>
        <p className="mt-1 text-sm leading-relaxed text-muted">
          {productName.charAt(0).toUpperCase() + productName.slice(1)} are priced on quantity and
          specification, so you get a real number for the job you actually need — not a starting
          price that changes at checkout.
        </p>
      </div>

      <div className="mt-5 flex flex-col gap-3">
        <Button
          href={`/request-a-quote?product=${encodeURIComponent(productSlug)}`}
          variant="onDark"
          size="lg"
          withArrow
          className="w-full"
        >
          Request a Quote
        </Button>
        <Button href="/custom-design" variant="secondary" size="lg" className="w-full">
          Request Design Assistance
        </Button>
      </div>

      <ul className="mt-5 grid gap-3 border-t border-line pt-5 sm:grid-cols-3">
        {ASSURANCES.map(({ icon: Icon, label }) => (
          <li key={label} className="flex items-start gap-2">
            <Icon className="mt-0.5 h-5 w-5 shrink-0 text-teal" />
            <span className="text-[0.8125rem] leading-snug text-muted">{label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** The two routes artwork can take. Both run through the quote, not an upload. */
export function ArtworkOptions() {
  return (
    <section className="mt-6 rounded-2xl bg-mist p-5 ring-1 ring-line sm:p-6">
      <h2 className="text-base font-bold text-navy sm:text-lg">Your artwork</h2>
      <ul className="mt-4 flex flex-col gap-4">
        <li className="flex gap-3">
          <CheckCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-teal" />
          <div>
            <h3 className="text-[0.9375rem] font-semibold text-navy">Already Have Artwork</h3>
            <p className="mt-1 text-sm leading-relaxed text-muted">
              Send us your print-ready files or existing branding when we follow up on your quote,
              and we will prepare them for print.
            </p>
          </div>
        </li>
        <li className="flex gap-3">
          <PencilIcon className="mt-0.5 h-5 w-5 shrink-0 text-teal" />
          <div>
            <h3 className="text-[0.9375rem] font-semibold text-navy">Need a Design</h3>
            <p className="mt-1 text-sm leading-relaxed text-muted">
              Our design team can work from your existing branding or start from scratch. Design
              services are quoted alongside your printing.
            </p>
            <a
              href="/custom-design"
              className="mt-2 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-teal-700 underline-offset-4 hover:underline"
            >
              Explore design services →
            </a>
          </div>
        </li>
      </ul>
    </section>
  );
}
