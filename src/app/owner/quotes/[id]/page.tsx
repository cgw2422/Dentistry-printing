import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { prisma } from "@/server/db";
import { requireStaffPage } from "@/server/auth/guards";
import {
  addQuoteNoteAction,
  retryQuoteEmailAction,
  updateQuoteStatusAction,
} from "../../actions";
import { EmailBadge, STATUS_LABELS, StatusBadge } from "../badges";
import type { QuoteStatus } from "@/generated/prisma";

export const dynamic = "force-dynamic";

const DATE = new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" });
const DAY = new Intl.DateTimeFormat("en-US", { dateStyle: "long", timeZone: "UTC" });

const STATUSES: QuoteStatus[] = [
  "NEW",
  "REVIEWING",
  "AWAITING_INFORMATION",
  "QUOTED",
  "ACCEPTED",
  "DECLINED",
  "CLOSED",
];

const ARTWORK_LABELS: Record<string, string> = {
  HAS_PRINT_READY_ARTWORK: "Has print-ready artwork",
  HAS_BRANDING_NEEDS_DESIGN_HELP: "Has branding, needs design help",
  NEEDS_DESIGN: "Needs a design created",
  NOT_SURE: "Not sure yet",
};

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div className="flex flex-col gap-0.5 border-b border-line py-2.5 last:border-b-0 sm:flex-row sm:gap-6">
      <dt className="w-52 shrink-0 text-sm text-muted">{label}</dt>
      <dd className="text-[0.9375rem] text-navy">{value}</dd>
    </div>
  );
}

export default async function OwnerQuoteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await requireStaffPage(`/owner/quotes/${id}`);

  const quote = await prisma.quoteRequest.findUnique({
    where: { id },
    include: {
      internalNotes: { orderBy: { createdAt: "desc" }, include: { author: { select: { email: true } } } },
    },
  });
  if (!quote) notFound();

  return (
    <main className="py-8 sm:py-10">
      <Container>
        <Link href="/owner/quotes" className="text-sm font-semibold text-teal-700 underline-offset-4 hover:underline">
          ← All quote requests
        </Link>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold text-navy sm:text-3xl">{quote.reference}</h1>
          <StatusBadge status={quote.status} />
        </div>
        <p className="mt-1.5 text-sm text-muted">Received {DATE.format(quote.createdAt)}</p>

        <div className="mt-7 grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:items-start">
          <section className="rounded-2xl bg-white p-6 ring-1 ring-line">
            <h2 className="text-lg font-bold text-navy">Request</h2>
            <dl className="mt-3">
              <Row label="Practice" value={quote.practiceName} />
              <Row label="Contact" value={quote.contactName} />
              <Row
                label="Email"
                value={<a className="text-teal-700 underline-offset-4 hover:underline" href={`mailto:${quote.email}`}>{quote.email}</a>}
              />
              <Row
                label="Phone"
                value={<a className="text-teal-700 underline-offset-4 hover:underline" href={`tel:${quote.phone}`}>{quote.phone}</a>}
              />
              <Row label="Website" value={quote.website} />
              <Row label="Product or service" value={quote.productLabel} />
              <Row label="Quantity" value={quote.quantity} />
              <Row label="Size" value={quote.dimensions} />
              <Row label="Paper / finish" value={quote.paperOrFinish} />
              <Row label="Specifications" value={quote.specifications} />
              <Row label="Artwork" value={ARTWORK_LABELS[quote.artworkStatus]} />
              <Row
                label="Requested delivery"
                value={quote.desiredDeliveryDate ? DAY.format(quote.desiredDeliveryDate) : null}
              />
              <Row label="Shipping ZIP" value={quote.shippingPostalCode} />
              <Row label="Mailing area" value={quote.mailingArea} />
              <Row label="Households" value={quote.householdEstimate} />
              <Row label="Campaign goal" value={quote.campaignGoal} />
              <Row
                label="Wants postcard design"
                value={quote.needsPostcardDesign == null ? null : quote.needsPostcardDesign ? "Yes" : "No"}
              />
              <Row label="Notes from customer" value={quote.message} />
              <Row label="Consent given" value={DATE.format(quote.consentAt)} />
            </dl>
          </section>

          <div className="flex flex-col gap-6">
            <section className="rounded-2xl bg-white p-6 ring-1 ring-line">
              <h2 className="text-lg font-bold text-navy">Status</h2>
              <form action={updateQuoteStatusAction} className="mt-3 flex flex-col gap-3">
                <input type="hidden" name="quoteId" value={quote.id} />
                <label htmlFor="status" className="sr-only">Quote status</label>
                <select
                  id="status"
                  name="status"
                  defaultValue={quote.status}
                  className="w-full rounded-xl border border-line bg-white px-4 py-3 text-[0.9375rem] text-navy outline-none focus:border-teal focus:ring-2 focus:ring-teal/30"
                >
                  {STATUSES.map((status) => (
                    <option key={status} value={status}>{STATUS_LABELS[status]}</option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="inline-flex min-h-11 items-center justify-center rounded-full bg-teal px-5 text-sm font-semibold text-white hover:bg-teal-700"
                >
                  Update status
                </button>
              </form>
            </section>

            <section className="rounded-2xl bg-white p-6 ring-1 ring-line">
              <h2 className="text-lg font-bold text-navy">Email notifications</h2>
              <div className="mt-3 flex flex-col gap-3">
                {(["owner", "customer"] as const).map((which) => {
                  const status = which === "owner" ? quote.ownerEmailStatus : quote.customerEmailStatus;
                  const error = which === "owner" ? quote.ownerEmailError : quote.customerEmailError;
                  const attempts = which === "owner" ? quote.ownerEmailAttempts : quote.customerEmailAttempts;
                  return (
                    <div key={which} className="rounded-xl bg-mist px-4 py-3 ring-1 ring-inset ring-line">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <EmailBadge label={which === "owner" ? "To you" : "To customer"} status={status} />
                        <span className="text-xs text-muted">{attempts} attempt{attempts === 1 ? "" : "s"}</span>
                      </div>
                      {error && <p className="mt-2 text-xs leading-relaxed text-red-700">{error}</p>}
                      {status !== "SENT" && (
                        <form action={retryQuoteEmailAction} className="mt-2.5">
                          <input type="hidden" name="quoteId" value={quote.id} />
                          <input type="hidden" name="which" value={which} />
                          <button
                            type="submit"
                            className="inline-flex min-h-11 items-center rounded-full bg-white px-4 text-xs font-semibold text-navy ring-1 ring-inset ring-line hover:bg-sky-50"
                          >
                            Retry this email
                          </button>
                        </form>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="rounded-2xl bg-white p-6 ring-1 ring-line">
              <h2 className="text-lg font-bold text-navy">Internal notes</h2>
              <p className="mt-1 text-xs text-muted">Private to staff. Never sent to the customer.</p>
              <form action={addQuoteNoteAction} className="mt-3 flex flex-col gap-3">
                <input type="hidden" name="quoteId" value={quote.id} />
                <label htmlFor="body" className="sr-only">Note</label>
                <textarea
                  id="body"
                  name="body"
                  rows={3}
                  required
                  className="w-full rounded-xl border border-line bg-white px-4 py-3 text-[0.9375rem] text-navy outline-none focus:border-teal focus:ring-2 focus:ring-teal/30"
                />
                <button
                  type="submit"
                  className="inline-flex min-h-11 items-center justify-center rounded-full bg-navy px-5 text-sm font-semibold text-white hover:bg-navy-700"
                >
                  Add note
                </button>
              </form>

              {quote.internalNotes.length > 0 && (
                <ul className="mt-5 flex flex-col gap-3">
                  {quote.internalNotes.map((note) => (
                    <li key={note.id} className="rounded-xl bg-mist px-4 py-3 ring-1 ring-inset ring-line">
                      <p className="text-sm leading-relaxed text-navy">{note.body}</p>
                      <p className="mt-1.5 text-xs text-muted">
                        {note.author?.email ?? "Unknown"} · {DATE.format(note.createdAt)}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        </div>
      </Container>
    </main>
  );
}
