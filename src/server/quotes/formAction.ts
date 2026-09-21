"use server";

import { cookies, headers } from "next/headers";
import { sign } from "@/server/crypto";
import { submitQuoteRequest } from "./submit";
import {
  CONFIRMATION_COOKIE,
  CONFIRMATION_TTL_SECONDS,
  type QuoteFormState,
} from "./confirmation";

/**
 * Handles the public quote form.
 *
 * The client never sees a success state that the database did not produce:
 * this returns success only after `submitQuoteRequest` reports a saved row.
 */
export async function submitQuoteAction(
  _previous: QuoteFormState,
  formData: FormData,
): Promise<QuoteFormState> {
  const headerList = await headers();
  const forwarded = headerList.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || headerList.get("x-real-ip") || null;

  const value = (name: string) => {
    const raw = formData.get(name);
    return typeof raw === "string" ? raw : "";
  };

  /** Echoed back on failure. The honeypot and the token are left out. */
  const entered = (): Record<string, string> =>
    Object.fromEntries(
      [
        "practiceName",
        "contactName",
        "email",
        "phone",
        "website",
        "product",
        "quantity",
        "dimensions",
        "paperOrFinish",
        "specifications",
        "desiredDeliveryDate",
        "shippingPostalCode",
        "mailingArea",
        "householdEstimate",
        "campaignGoal",
        "artworkStatus",
        "message",
      ].map((name) => [name, value(name)]),
    );

  const result = await submitQuoteRequest(
    {
      practiceName: value("practiceName"),
      contactName: value("contactName"),
      email: value("email"),
      phone: value("phone"),
      website: value("website"),
      product: value("product"),
      quantity: value("quantity"),
      dimensions: value("dimensions"),
      paperOrFinish: value("paperOrFinish"),
      specifications: value("specifications"),
      desiredDeliveryDate: value("desiredDeliveryDate"),
      shippingPostalCode: value("shippingPostalCode"),
      mailingArea: value("mailingArea"),
      householdEstimate: value("householdEstimate"),
      campaignGoal: value("campaignGoal"),
      needsPostcardDesign: formData.get("needsPostcardDesign") === "on",
      artworkStatus: value("artworkStatus"),
      message: value("message"),
      consent: formData.get("consent") === "on",
      submissionToken: value("submissionToken"),
      companyWebsiteConfirm: value("companyWebsiteConfirm"),
    },
    { ip, userAgent: headerList.get("user-agent") },
  );

  if (!result.ok) {
    return { status: "error", errors: result.errors, values: entered() };
  }

  // The reference travels in a signed cookie rather than the URL, so no one
  // can read another practice's confirmation by guessing an id.
  const cookieStore = await cookies();
  cookieStore.set(CONFIRMATION_COOKIE, sign(result.quote.reference), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: CONFIRMATION_TTL_SECONDS,
  });

  return { status: "success", reference: result.quote.reference };
}
