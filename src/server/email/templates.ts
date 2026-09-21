import type { QuoteRequest } from "@/generated/prisma";
import type { EmailMessage } from "./transport";

const BRAND = "Dentistry Printing";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function row(label: string, value: string | null | undefined): string {
  if (!value) return "";
  return `<tr><td style="padding:6px 16px 6px 0;color:#55657a;vertical-align:top;white-space:nowrap">${escapeHtml(
    label,
  )}</td><td style="padding:6px 0;color:#0f2d4a"><strong>${escapeHtml(value)}</strong></td></tr>`;
}

function line(label: string, value: string | null | undefined): string {
  return value ? `${label}: ${value}\n` : "";
}

function shell(heading: string, intro: string, body: string): string {
  return `<div style="font-family:ui-sans-serif,system-ui,'Segoe UI',Helvetica,Arial,sans-serif;background:#f4f7fa;padding:24px">
  <div style="max-width:640px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e5e7eb">
    <div style="background:#0f2d4a;padding:20px 24px">
      <span style="color:#fff;font-size:18px;font-weight:700">Dentistry</span>
      <span style="color:#00a3b4;font-size:18px;font-weight:700"> Printing</span>
    </div>
    <div style="padding:24px">
      <h1 style="margin:0 0 12px;font-size:20px;color:#0f2d4a">${escapeHtml(heading)}</h1>
      <p style="margin:0 0 20px;color:#55657a;line-height:1.6">${escapeHtml(intro)}</p>
      ${body}
    </div>
  </div>
</div>`;
}

const DATE = new Intl.DateTimeFormat("en-US", { dateStyle: "long", timeZone: "UTC" });

/** Everything the owner needs to price the job and call the practice back. */
export function ownerNotification(quote: QuoteRequest): EmailMessage {
  const details = [
    row("Reference", quote.reference),
    row("Practice", quote.practiceName),
    row("Contact", quote.contactName),
    row("Email", quote.email),
    row("Phone", quote.phone),
    row("Website", quote.website),
    row("Product", quote.productLabel),
    row("Quantity", quote.quantity),
    row("Size", quote.dimensions),
    row("Paper / finish", quote.paperOrFinish),
    row("Specifications", quote.specifications),
    row("Artwork", artworkLabel(quote.artworkStatus)),
    row("Requested delivery", quote.desiredDeliveryDate ? DATE.format(quote.desiredDeliveryDate) : null),
    row("Shipping ZIP", quote.shippingPostalCode),
    row("Mailing area", quote.mailingArea),
    row("Households", quote.householdEstimate),
    row("Campaign goal", quote.campaignGoal),
    row("Needs postcard design", quote.needsPostcardDesign == null ? null : quote.needsPostcardDesign ? "Yes" : "No"),
    row("Notes", quote.message),
    row("Submitted", DATE.format(quote.createdAt)),
  ].join("");

  const text =
    `New quote request ${quote.reference}\n\n` +
    line("Practice", quote.practiceName) +
    line("Contact", quote.contactName) +
    line("Email", quote.email) +
    line("Phone", quote.phone) +
    line("Website", quote.website) +
    line("Product", quote.productLabel) +
    line("Quantity", quote.quantity) +
    line("Size", quote.dimensions) +
    line("Paper / finish", quote.paperOrFinish) +
    line("Specifications", quote.specifications) +
    line("Artwork", artworkLabel(quote.artworkStatus)) +
    line("Requested delivery", quote.desiredDeliveryDate ? DATE.format(quote.desiredDeliveryDate) : null) +
    line("Shipping ZIP", quote.shippingPostalCode) +
    line("Mailing area", quote.mailingArea) +
    line("Households", quote.householdEstimate) +
    line("Campaign goal", quote.campaignGoal) +
    line("Notes", quote.message) +
    line("Submitted", DATE.format(quote.createdAt));

  return {
    to: process.env.QUOTE_NOTIFICATION_EMAIL ?? "",
    subject: `New quote request ${quote.reference} — ${quote.practiceName}`,
    text,
    html: shell(
      `New quote request ${quote.reference}`,
      `${quote.practiceName} asked about ${quote.productLabel}.`,
      `<table style="border-collapse:collapse;font-size:14px;width:100%">${details}</table>`,
    ),
  };
}

/**
 * Customer acknowledgement. Says what we received and that we will follow up —
 * no response time, no price, nothing about suppliers, no internal notes.
 */
export function customerConfirmation(quote: QuoteRequest): EmailMessage {
  const summary = [
    row("Reference", quote.reference),
    row("Product or service", quote.productLabel),
    row("Quantity", quote.quantity),
    row("Practice", quote.practiceName),
  ].join("");

  const text =
    `Thank you for contacting ${BRAND}.\n\n` +
    `We have received your quote request.\n\n` +
    line("Reference", quote.reference) +
    line("Product or service", quote.productLabel) +
    line("Quantity", quote.quantity) +
    line("Practice", quote.practiceName) +
    `\nOur team will review the details you sent and follow up with pricing and available options.\n\n` +
    `If you need to add anything, reply to this email and quote your reference.\n\n— ${BRAND}\n`;

  return {
    to: quote.email,
    subject: `${BRAND} — We Received Your Quote Request`,
    text,
    html: shell(
      "We received your quote request",
      `Thank you for contacting ${BRAND}. Our team will review the details you sent and follow up with pricing and available options.`,
      `<table style="border-collapse:collapse;font-size:14px;width:100%">${summary}</table>
       <p style="margin:20px 0 0;color:#55657a;line-height:1.6;font-size:14px">If you need to add anything, reply to this email and quote your reference.</p>`,
    ),
  };
}

function artworkLabel(status: QuoteRequest["artworkStatus"]): string {
  switch (status) {
    case "HAS_PRINT_READY_ARTWORK":
      return "Has print-ready artwork";
    case "HAS_BRANDING_NEEDS_DESIGN_HELP":
      return "Has branding, needs design help";
    case "NEEDS_DESIGN":
      return "Needs a design created";
    case "NOT_SURE":
      return "Not sure yet";
  }
}
