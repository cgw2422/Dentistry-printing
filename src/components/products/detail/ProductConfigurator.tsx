import { Button } from "@/components/ui/Button";
import { CheckCircleIcon, PencilIcon, TruckIcon, UploadIcon } from "@/components/ui/icons";
import type { OptionGroup } from "@/content/productDetails";

/**
 * One configuration control.
 *
 * A group whose values the supplier has not confirmed renders as a real but
 * disabled select showing only its placeholder, described by the notice
 * below. That keeps the field in the layout without offering a choice that
 * cannot be honoured.
 */
function OptionSelect({ group, describedBy }: { group: OptionGroup; describedBy?: string }) {
  const pending = group.status === "pending" || group.values.length === 0;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={`option-${group.id}`} className="text-sm font-semibold text-navy">
        {group.label}
        {group.optional && <span className="ml-1.5 font-medium text-muted">(optional)</span>}
      </label>
      <select
        id={`option-${group.id}`}
        name={group.id}
        disabled={pending}
        defaultValue=""
        aria-describedby={pending ? describedBy : undefined}
        className="h-12 w-full rounded-xl border border-line bg-white px-4 text-[0.9375rem] text-navy outline-none focus:border-teal focus:ring-2 focus:ring-teal/30 disabled:cursor-not-allowed disabled:bg-mist disabled:text-muted"
      >
        <option value="" disabled>
          {group.placeholder}
        </option>
        {group.values.map((value) => (
          <option key={value.id} value={value.id} disabled={value.available === false}>
            {value.note ? `${value.label} — ${value.note}` : value.label}
          </option>
        ))}
      </select>
    </div>
  );
}

const ASSURANCES = [
  { icon: PencilIcon, label: "Design support available" },
  { icon: CheckCircleIcon, label: "Proof before printing" },
  { icon: TruckIcon, label: "Nationwide fulfillment" },
];

/**
 * The right-hand card: options, pricing status and the primary action.
 *
 * The action is Request a Quote, not Add to Cart. There is no cart, no
 * configured pricing and no checkout, so a cart button would be a promise the
 * site cannot keep.
 */
export function ProductConfigurator({
  optionGroups,
  productName,
  productSlug,
}: {
  optionGroups: OptionGroup[];
  productName: string;
  /** Preselects this product on the quote form. */
  productSlug: string;
}) {
  const pendingId = "specifications-pending";
  const hasPending = optionGroups.some(
    (group) => group.status === "pending" || group.values.length === 0,
  );

  return (
    <div className="rounded-2xl bg-white p-5 shadow-card ring-1 ring-line sm:p-6 lg:p-7">
      {optionGroups.length > 0 && (
        <fieldset className="border-0 p-0">
          <legend className="text-xl font-bold text-navy sm:text-2xl">Select Options</legend>
          <div className="mt-5 flex flex-col gap-4">
            {optionGroups.map((group) => (
              <OptionSelect key={group.id} group={group} describedBy={pendingId} />
            ))}
          </div>
          {hasPending && (
            <p
              id={pendingId}
              className="mt-4 rounded-xl bg-sky-50 px-4 py-3 text-sm leading-relaxed text-navy ring-1 ring-inset ring-teal/20"
            >
              Sizes, paper types and quantities for {productName} are being finalised. Request a
              quote and we will confirm the options available for your practice.
            </p>
          )}
        </fieldset>
      )}

      {/* Pricing has its own place in the layout, ready for configured prices. */}
      <div
        className={`flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-t border-line pt-5 ${
          optionGroups.length > 0 ? "mt-6" : ""
        }`}
      >
        <span className="text-sm font-semibold uppercase tracking-[0.12em] text-muted">Price</span>
        <span className="text-lg font-bold text-navy">Pricing available upon request.</span>
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

/** The two routes artwork can take, described rather than implemented. */
export function ArtworkOptions() {
  return (
    <section className="mt-6 rounded-2xl bg-mist p-5 ring-1 ring-line sm:p-6">
      <h2 className="text-base font-bold text-navy sm:text-lg">Your artwork</h2>
      <ul className="mt-4 flex flex-col gap-4">
        <li className="flex gap-3">
          <UploadIcon className="mt-0.5 h-5 w-5 shrink-0 text-teal" />
          <div>
            <h3 className="text-[0.9375rem] font-semibold text-navy">Upload Your Artwork</h3>
            <p className="mt-1 text-sm leading-relaxed text-muted">
              Already have print-ready files or a logo? Uploading them to your practice account is
              part of the ordering system we are building. Until then, send them with your quote
              request and we will prepare them for print.
            </p>
          </div>
        </li>
        <li className="flex gap-3">
          <PencilIcon className="mt-0.5 h-5 w-5 shrink-0 text-teal" />
          <div>
            <h3 className="text-[0.9375rem] font-semibold text-navy">Request Design Assistance</h3>
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
