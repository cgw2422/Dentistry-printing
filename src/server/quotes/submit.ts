import "server-only";

import { prisma } from "@/server/db";
import type { ArtworkStatus, QuoteRequest } from "@/generated/prisma";
import { findQuoteOption, isDesignOnly } from "@/content/quoteOptions";
import { hashIdentifier, quoteReference } from "@/server/crypto";
import { quoteRequestSchema, toFieldErrors, type FieldErrors } from "./schema";
import { notifyForQuote } from "./notify";

export type SubmitResult =
  | { ok: true; quote: QuoteRequest }
  | { ok: false; errors: FieldErrors };

/**
 * Requests allowed from one address per window. Tunable so a busy practice
 * network is not locked out, and so the test suite can submit freely.
 */
const RATE_LIMIT = {
  max: Number(process.env.QUOTE_RATE_LIMIT_MAX ?? 5),
  windowMinutes: Number(process.env.QUOTE_RATE_LIMIT_WINDOW_MINUTES ?? 30),
};

export type SubmitContext = {
  ip?: string | null;
  userAgent?: string | null;
};

/**
 * Validate, persist, then notify — in that order and never the other way
 * round. The database is the record of a quote request; email is a courtesy
 * on top of it, so a mail failure leaves the request saved and reported as
 * successful to the customer.
 */
export async function submitQuoteRequest(
  raw: unknown,
  context: SubmitContext = {},
): Promise<SubmitResult> {
  const parsed = quoteRequestSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, errors: toFieldErrors(parsed.error) };
  }

  const input = parsed.data;

  // A bot that filled the hidden field gets the same shape of response a
  // person would see, without a row being written.
  if (input.companyWebsiteConfirm) {
    return { ok: false, errors: { form: "We could not accept this submission. Please try again." } };
  }

  const option = findQuoteOption(input.product);
  if (!option) {
    return { ok: false, errors: { product: "Choose the product or service you need." } };
  }

  const ipHash = context.ip ? hashIdentifier(context.ip) : null;

  // A repeated POST — double tap, or a retry after a dropped response —
  // carries the same token and returns the row already written.
  const existing = await prisma.quoteRequest.findUnique({
    where: { submissionToken: input.submissionToken },
  });
  if (existing) return { ok: true, quote: existing };

  if (ipHash && (await isRateLimited(ipHash))) {
    return {
      ok: false,
      errors: {
        form: "We have received several requests from this connection. Please wait a little while, or email us directly.",
      },
    };
  }

  let quote: QuoteRequest;
  try {
    quote = await prisma.quoteRequest.create({
      data: {
        reference: quoteReference(),
        practiceName: input.practiceName,
        contactName: input.contactName,
        email: input.email,
        phone: input.phone,
        website: input.website ?? null,

        productKey: option.key,
        productLabel: option.label,
        quantity: input.quantity ?? null,
        dimensions: input.dimensions ?? null,
        paperOrFinish: input.paperOrFinish ?? null,
        specifications: input.specifications ?? null,
        desiredDeliveryDate: input.desiredDeliveryDate ? new Date(input.desiredDeliveryDate) : null,
        // A design-only enquiry ships nothing, so anything typed is discarded.
        shippingPostalCode: isDesignOnly(option.key) ? null : (input.shippingPostalCode ?? null),

        mailingArea: input.mailingArea ?? null,
        householdEstimate: input.householdEstimate ?? null,
        campaignGoal: input.campaignGoal ?? null,
        needsPostcardDesign: input.needsPostcardDesign ?? null,

        artworkStatus: input.artworkStatus as ArtworkStatus,
        message: input.message ?? null,
        consentAt: new Date(),

        submissionToken: input.submissionToken,
        ipHash,
        userAgent: context.userAgent?.slice(0, 500) ?? null,
      },
    });
  } catch (error) {
    // Two requests with the same token racing each other: the loser reads the
    // winner's row rather than reporting a failure.
    const duplicate = await prisma.quoteRequest.findUnique({
      where: { submissionToken: input.submissionToken },
    });
    if (duplicate) return { ok: true, quote: duplicate };

    console.error("[quotes] failed to save request", {
      reason: error instanceof Error ? error.name : "unknown",
    });
    return {
      ok: false,
      errors: { form: "We could not save your request. Please try again in a moment." },
    };
  }

  // Saved. Anything that happens now is recorded on the row, not raised.
  const notified = await notifyForQuote(quote).catch(() => quote);
  return { ok: true, quote: notified };
}

async function isRateLimited(ipHash: string): Promise<boolean> {
  const since = new Date(Date.now() - RATE_LIMIT.windowMinutes * 60_000);
  const recent = await prisma.quoteRequest.count({
    where: { ipHash, createdAt: { gte: since } },
  });
  return recent >= RATE_LIMIT.max;
}
