import type { EmailDeliveryStatus, QuoteStatus } from "@/generated/prisma";

const STATUS_STYLES: Record<QuoteStatus, string> = {
  NEW: "bg-teal-50 text-teal-700 ring-teal/30",
  REVIEWING: "bg-sky-50 text-navy ring-sky/50",
  AWAITING_INFORMATION: "bg-amber-50 text-amber-800 ring-amber-300",
  QUOTED: "bg-sky-100 text-navy ring-sky",
  ACCEPTED: "bg-emerald-50 text-emerald-800 ring-emerald-300",
  DECLINED: "bg-mist text-muted ring-line",
  CLOSED: "bg-mist text-muted ring-line",
};

export const STATUS_LABELS: Record<QuoteStatus, string> = {
  NEW: "New",
  REVIEWING: "Reviewing",
  AWAITING_INFORMATION: "Awaiting information",
  QUOTED: "Quoted",
  ACCEPTED: "Accepted",
  DECLINED: "Declined",
  CLOSED: "Closed",
};

export function StatusBadge({ status }: { status: QuoteStatus }) {
  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${STATUS_STYLES[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

const EMAIL_STYLES: Record<EmailDeliveryStatus, string> = {
  SENT: "bg-emerald-50 text-emerald-800 ring-emerald-300",
  FAILED: "bg-red-50 text-red-700 ring-red-300",
  PENDING: "bg-mist text-muted ring-line",
  SKIPPED: "bg-amber-50 text-amber-800 ring-amber-300",
};

export function EmailBadge({ label, status }: { label: string; status: EmailDeliveryStatus }) {
  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-2 py-0.5 text-[0.6875rem] font-semibold ring-1 ring-inset ${EMAIL_STYLES[status]}`}
    >
      {label}: {status.toLowerCase()}
    </span>
  );
}
