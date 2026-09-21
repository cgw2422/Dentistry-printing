import { z } from "zod";
import { ARTWORK_CHOICES, findQuoteOption, isDesignOnly } from "@/content/quoteOptions";

/**
 * Server-authoritative validation for a quote request.
 *
 * The browser runs the same rules for fast feedback, but this is the copy that
 * decides: every length limit here matches a column limit in the schema, so a
 * request that passes cannot overflow the database.
 */

const trimmed = (max: number) => z.string().trim().max(max);
const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((value) => (value.length === 0 ? null : value))
    .nullable()
    .optional();

const artworkValues = ARTWORK_CHOICES.map((choice) => choice.value) as [string, ...string[]];

export const quoteRequestSchema = z
  .object({
    practiceName: trimmed(200).min(1, "Enter your practice name."),
    contactName: trimmed(200).min(1, "Enter your name."),
    email: trimmed(320)
      .min(1, "Enter your email address.")
      .toLowerCase()
      .pipe(z.email("Enter a valid email address.")),
    phone: trimmed(40)
      .min(7, "Enter a phone number we can reach you on.")
      .regex(/^[0-9 ()+.\-x]+$/i, "Enter a valid phone number."),
    website: optionalText(2048),

    product: trimmed(80).min(1, "Choose the product or service you need."),
    quantity: optionalText(120),
    dimensions: optionalText(200),
    paperOrFinish: optionalText(200),
    specifications: optionalText(4000),
    desiredDeliveryDate: optionalText(10),
    shippingPostalCode: optionalText(20),

    mailingArea: optionalText(500),
    householdEstimate: optionalText(120),
    campaignGoal: optionalText(1000),
    needsPostcardDesign: z.boolean().optional(),

    artworkStatus: z.enum(artworkValues, "Tell us where your artwork stands."),
    message: optionalText(5000),

    consent: z.literal(true, "Please agree to be contacted about this request."),

    /** Minted by the form; makes a retried submission idempotent. */
    submissionToken: trimmed(64).min(8),

    /**
     * Hidden field. Real people leave it empty; many bots do not.
     * Accepted by the schema and rejected in `submitQuoteRequest`, so a filled
     * one produces a visible message rather than a silent failure on a field
     * nobody can see.
     */
    companyWebsiteConfirm: z.string().max(2048).optional(),
  })
  .superRefine((value, ctx) => {
    const option = findQuoteOption(value.product);
    if (!option) {
      ctx.addIssue({
        code: "custom",
        path: ["product"],
        message: "Choose the product or service you need.",
      });
      return;
    }

    // Anything physical has to ship somewhere; design-only enquiries do not.
    if (!isDesignOnly(option.key) && !value.shippingPostalCode) {
      ctx.addIssue({
        code: "custom",
        path: ["shippingPostalCode"],
        message: "Enter the ZIP code we would ship to.",
      });
    }

    if (value.desiredDeliveryDate && !/^\d{4}-\d{2}-\d{2}$/.test(value.desiredDeliveryDate)) {
      ctx.addIssue({
        code: "custom",
        path: ["desiredDeliveryDate"],
        message: "Enter a date in YYYY-MM-DD format.",
      });
    }
  });

export type QuoteRequestInput = z.input<typeof quoteRequestSchema>;
export type QuoteRequestParsed = z.output<typeof quoteRequestSchema>;

/** Field name → first error message, for rendering beside the inputs. */
export type FieldErrors = Record<string, string>;

export function toFieldErrors(error: z.ZodError): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "form";
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
