import type { FieldErrors } from "./schema";

/**
 * Shared between the Server Action and the confirmation page. Kept out of the
 * "use server" module because those may only export async functions.
 */
export const CONFIRMATION_COOKIE = "dp_quote_ref";
export const CONFIRMATION_TTL_SECONDS = 60 * 30;

/** Values echoed back so a failed submission does not empty the form. */
export type QuoteFormValues = Record<string, string>;

export type QuoteFormState =
  | { status: "idle" }
  | { status: "error"; errors: FieldErrors; values: QuoteFormValues }
  | { status: "success"; reference: string };
