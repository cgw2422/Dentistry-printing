import "server-only";

import { prisma } from "@/server/db";
import type { QuoteRequest } from "@/generated/prisma";
import { customerConfirmation, ownerNotification } from "@/server/email/templates";
import { sendEmail } from "@/server/email/transport";

/**
 * Send the two notifications for a saved quote and record what happened.
 *
 * Never throws: the request is already in the database by the time this runs,
 * and a mail failure must not undo that or surface to the customer as a failed
 * submission. Each outcome is stored so the owner can see it and retry.
 */
export async function notifyForQuote(quote: QuoteRequest): Promise<QuoteRequest> {
  const ownerTo = process.env.QUOTE_NOTIFICATION_EMAIL;

  const owner = ownerTo
    ? await sendEmail(ownerNotification(quote))
    : ({ status: "SKIPPED", error: "QUOTE_NOTIFICATION_EMAIL is not configured." } as const);

  const customer = await sendEmail(customerConfirmation(quote));

  return prisma.quoteRequest.update({
    where: { id: quote.id },
    data: {
      ownerEmailStatus: owner.status,
      ownerEmailSentAt: owner.status === "SENT" ? new Date() : null,
      ownerEmailError: owner.status === "SENT" ? null : owner.error,
      ownerEmailAttempts: { increment: 1 },

      customerEmailStatus: customer.status,
      customerEmailSentAt: customer.status === "SENT" ? new Date() : null,
      customerEmailError: customer.status === "SENT" ? null : customer.error,
      customerEmailAttempts: { increment: 1 },
    },
  });
}

/** Retry one side of the notification, used by the owner dashboard. */
export async function retryNotification(
  quoteId: string,
  which: "owner" | "customer",
): Promise<QuoteRequest | null> {
  const quote = await prisma.quoteRequest.findUnique({ where: { id: quoteId } });
  if (!quote) return null;

  if (which === "owner") {
    const to = process.env.QUOTE_NOTIFICATION_EMAIL;
    const result = to
      ? await sendEmail(ownerNotification(quote))
      : ({ status: "SKIPPED", error: "QUOTE_NOTIFICATION_EMAIL is not configured." } as const);

    return prisma.quoteRequest.update({
      where: { id: quoteId },
      data: {
        ownerEmailStatus: result.status,
        ownerEmailSentAt: result.status === "SENT" ? new Date() : null,
        ownerEmailError: result.status === "SENT" ? null : result.error,
        ownerEmailAttempts: { increment: 1 },
      },
    });
  }

  const result = await sendEmail(customerConfirmation(quote));
  return prisma.quoteRequest.update({
    where: { id: quoteId },
    data: {
      customerEmailStatus: result.status,
      customerEmailSentAt: result.status === "SENT" ? new Date() : null,
      customerEmailError: result.status === "SENT" ? null : result.error,
      customerEmailAttempts: { increment: 1 },
    },
  });
}
