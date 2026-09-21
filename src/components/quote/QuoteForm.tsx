"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "@/components/ui/icons";
import {
  ARTWORK_CHOICES,
  isDesignOnly,
  isDirectMail,
  quoteOptions,
  type QuoteOptionGroup,
} from "@/content/quoteOptions";
import { submitQuoteAction } from "@/server/quotes/formAction";
import type { QuoteFormState, QuoteFormValues } from "@/server/quotes/confirmation";
import { Field, Fieldset } from "./fields";

const GROUPS: QuoteOptionGroup[] = ["Printing products", "Services"];

/**
 * The public quote form.
 *
 * Submission goes through a Server Action, so validation, rate limiting and
 * persistence all happen on the server; anything here is for fast feedback
 * only. A failed submission comes back with the values that were entered, the
 * fields remount to show them again, and the button is disabled while a
 * request is in flight.
 */
export function QuoteForm({
  initialProduct,
  submissionToken,
}: {
  initialProduct: string;
  /**
   * Minted on the server for this page render. A retried POST carries the same
   * token, so the server returns the row it already wrote rather than a second
   * one, and no two visitors can share a token.
   */
  submissionToken: string;
}) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState<QuoteFormState, FormData>(submitQuoteAction, {
    status: "idle",
  });

  useEffect(() => {
    if (state.status === "success") router.push("/request-a-quote/confirmation");
  }, [state, router]);

  const errors = state.status === "error" ? state.errors : {};
  const submitted: QuoteFormValues = state.status === "error" ? state.values : {};

  // Changing this key remounts the fields, which is what lets their defaults
  // pick up what the customer had typed instead of resetting to empty.
  const valuesKey = state.status === "error" ? JSON.stringify(state.values) : "initial";

  return (
    <form action={formAction} noValidate className="flex flex-col gap-7">
      <input type="hidden" name="submissionToken" value={submissionToken} />

      {/* Hidden from people, tempting to bots. */}
      <div aria-hidden="true" className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
        <label htmlFor="companyWebsiteConfirm">Leave this field empty</label>
        <input id="companyWebsiteConfirm" name="companyWebsiteConfirm" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {errors.form && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700 ring-1 ring-inset ring-red-200">
          {errors.form}
        </p>
      )}

      <QuoteFields
        key={valuesKey}
        initialProduct={submitted.product || initialProduct}
        submitted={submitted}
        errors={errors}
      />

      <div className="flex flex-col gap-4 border-t border-line pt-6">
        <label className="flex items-start gap-3 text-[0.9375rem] leading-relaxed text-navy">
          <input
            type="checkbox"
            name="consent"
            required
            className="mt-1 h-5 w-5 shrink-0 rounded border-line text-teal focus:ring-2 focus:ring-teal/40"
          />
          <span>
            I agree to be contacted by Dentistry Printing about this quote request.{" "}
            <Link href="/privacy-policy" className="font-semibold text-teal-700 underline-offset-4 hover:underline">
              Privacy Policy
            </Link>
          </span>
        </label>
        {errors.consent && (
          <p role="alert" className="text-xs font-medium text-red-600">
            {errors.consent}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-full bg-teal px-7 text-base font-semibold text-white transition-colors hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-teal/60"
        >
          {pending ? "Sending your request…" : "Send Quote Request"}
          {!pending && <ArrowRight className="h-4 w-4" />}
        </button>
        <p className="text-xs leading-relaxed text-muted">
          We will review your details and follow up with pricing and available options. Submitting
          this form does not place an order.
        </p>
      </div>
    </form>
  );
}

/**
 * The fields themselves. Separated so the whole block can be remounted by key
 * after a failed submission — which also re-seeds the selected product without
 * an effect syncing state.
 */
function QuoteFields({
  initialProduct,
  submitted,
  errors,
}: {
  initialProduct: string;
  submitted: QuoteFormValues;
  errors: Record<string, string>;
}) {
  const [product, setProduct] = useState(initialProduct);
  const directMail = isDirectMail(product);
  const designOnly = isDesignOnly(product);

  return (
    <div className="flex flex-col gap-7">
      <Fieldset legend="Your practice">
        <Field label="Practice Name" name="practiceName" required error={errors.practiceName}>
          {(p) => <input {...p} name="practiceName" defaultValue={submitted.practiceName ?? ""} autoComplete="organization" aria-describedby={p.describedBy} />}
        </Field>
        <Field label="Contact Name" name="contactName" required error={errors.contactName}>
          {(p) => <input {...p} name="contactName" defaultValue={submitted.contactName ?? ""} autoComplete="name" aria-describedby={p.describedBy} />}
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Email Address" name="email" required error={errors.email}>
            {(p) => <input {...p} name="email" defaultValue={submitted.email ?? ""} type="email" autoComplete="email" aria-describedby={p.describedBy} />}
          </Field>
          <Field label="Phone Number" name="phone" required error={errors.phone}>
            {(p) => <input {...p} name="phone" defaultValue={submitted.phone ?? ""} type="tel" autoComplete="tel" aria-describedby={p.describedBy} />}
          </Field>
        </div>
        <Field label="Practice Website" name="website" error={errors.website}>
          {(p) => <input {...p} name="website" defaultValue={submitted.website ?? ""} inputMode="url" placeholder="https://" aria-describedby={p.describedBy} />}
        </Field>
      </Fieldset>

      <Fieldset legend="Your project">
        <Field label="Product or Service" name="product" required error={errors.product}>
          {(p) => (
            <select
              {...p}
              name="product"
              value={product}
              onChange={(event) => setProduct(event.target.value)}
              aria-describedby={p.describedBy}
            >
              <option value="">Choose a product or service</option>
              {GROUPS.map((group) => (
                <optgroup key={group} label={group}>
                  {quoteOptions
                    .filter((option) => option.group === group)
                    .map((option) => (
                      <option key={option.key} value={option.key}>
                        {option.label}
                      </option>
                    ))}
                </optgroup>
              ))}
            </select>
          )}
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Desired Quantity" name="quantity" hint='For example "500", "1,000" or "Not sure".' error={errors.quantity}>
            {(p) => <input {...p} name="quantity" defaultValue={submitted.quantity ?? ""} aria-describedby={p.describedBy} />}
          </Field>
          <Field label="Size or Dimensions" name="dimensions" error={errors.dimensions}>
            {(p) => <input {...p} name="dimensions" defaultValue={submitted.dimensions ?? ""} aria-describedby={p.describedBy} />}
          </Field>
        </div>

        <Field label="Paper Type or Finish" name="paperOrFinish" error={errors.paperOrFinish}>
          {(p) => <input {...p} name="paperOrFinish" defaultValue={submitted.paperOrFinish ?? ""} aria-describedby={p.describedBy} />}
        </Field>

        <Field label="Additional Specifications" name="specifications" error={errors.specifications}>
          {(p) => <textarea {...p} name="specifications" defaultValue={submitted.specifications ?? ""} rows={3} aria-describedby={p.describedBy} />}
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Desired Delivery Date"
            name="desiredDeliveryDate"
            hint="The date you are hoping for. We will confirm what is possible — this is a request, not a confirmed delivery date."
            error={errors.desiredDeliveryDate}
          >
            {(p) => <input {...p} name="desiredDeliveryDate" defaultValue={submitted.desiredDeliveryDate ?? ""} type="date" aria-describedby={p.describedBy} />}
          </Field>
          {!designOnly && (
            <Field
              label="Shipping ZIP Code"
              name="shippingPostalCode"
              required
              hint="Where the printed order would ship."
              error={errors.shippingPostalCode}
            >
              {(p) => <input {...p} name="shippingPostalCode" defaultValue={submitted.shippingPostalCode ?? ""} inputMode="numeric" autoComplete="postal-code" aria-describedby={p.describedBy} />}
            </Field>
          )}
        </div>
      </Fieldset>

      {directMail && (
        <Fieldset legend="Your mailing">
          <Field
            label="Desired mailing location or service area"
            name="mailingArea"
            hint="Cities, ZIP codes or neighborhoods you would like to reach. You do not need postal route numbers."
            error={errors.mailingArea}
          >
            {(p) => <textarea {...p} name="mailingArea" defaultValue={submitted.mailingArea ?? ""} rows={2} aria-describedby={p.describedBy} />}
          </Field>
          <Field label="Approximate number of households" name="householdEstimate" error={errors.householdEstimate}>
            {(p) => <input {...p} name="householdEstimate" defaultValue={submitted.householdEstimate ?? ""} aria-describedby={p.describedBy} />}
          </Field>
          <Field label="Campaign goal or offer" name="campaignGoal" error={errors.campaignGoal}>
            {(p) => <textarea {...p} name="campaignGoal" defaultValue={submitted.campaignGoal ?? ""} rows={2} aria-describedby={p.describedBy} />}
          </Field>
          <label className="flex items-start gap-3 text-[0.9375rem] text-navy">
            <input
              type="checkbox"
              name="needsPostcardDesign"
              className="mt-1 h-5 w-5 shrink-0 rounded border-line text-teal focus:ring-2 focus:ring-teal/40"
            />
            I would like help designing the postcard.
          </label>
        </Fieldset>
      )}

      <Fieldset legend="Your artwork">
        <fieldset className="border-0 p-0">
          <legend className="text-sm font-semibold text-navy">Do you already have artwork?</legend>
          <div className="mt-3 flex flex-col gap-2.5">
            {ARTWORK_CHOICES.map((choice) => (
              <label key={choice.value} className="flex items-start gap-3 text-[0.9375rem] text-navy">
                <input
                  type="radio"
                  name="artworkStatus"
                  value={choice.value}
                  defaultChecked={(submitted.artworkStatus || "NOT_SURE") === choice.value}
                  className="mt-1 h-5 w-5 shrink-0 border-line text-teal focus:ring-2 focus:ring-teal/40"
                />
                {choice.label}
              </label>
            ))}
          </div>
          {errors.artworkStatus && (
            <p role="alert" className="mt-2 text-xs font-medium text-red-600">
              {errors.artworkStatus}
            </p>
          )}
          <p className="mt-3 text-xs leading-relaxed text-muted">
            Design services are quoted alongside your printing.
          </p>
        </fieldset>
      </Fieldset>

      <Fieldset legend="Anything else">
        <Field
          label="Tell us more about your project"
          name="message"
          hint="Printing needs, mailing area, branding preferences, special instructions — whatever is useful."
          error={errors.message}
        >
          {(p) => <textarea {...p} name="message" defaultValue={submitted.message ?? ""} rows={5} aria-describedby={p.describedBy} />}
        </Field>
      </Fieldset>
    </div>
  );
}
