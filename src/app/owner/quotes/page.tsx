import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { prisma } from "@/server/db";
import { requireStaffPage } from "@/server/auth/guards";
import { logoutAction } from "../actions";
import { StatusBadge, EmailBadge } from "./badges";

export const dynamic = "force-dynamic";

const DATE = new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" });

export default async function OwnerQuotesPage() {
  // Authorization happens here, against the database — not in middleware.
  const user = await requireStaffPage("/owner/quotes");

  const [quotes, counts] = await Promise.all([
    prisma.quoteRequest.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
      select: {
        id: true,
        reference: true,
        practiceName: true,
        contactName: true,
        productLabel: true,
        status: true,
        createdAt: true,
        ownerEmailStatus: true,
        customerEmailStatus: true,
      },
    }),
    prisma.quoteRequest.groupBy({ by: ["status"], _count: true }),
  ]);

  const newCount = counts.find((c) => c.status === "NEW")?._count ?? 0;

  return (
    <main className="py-8 sm:py-10">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-navy sm:text-3xl">Quote requests</h1>
            <p className="mt-1.5 text-sm text-muted">
              {quotes.length} most recent · {newCount} awaiting review · signed in as {user.email}
            </p>
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              className="inline-flex min-h-11 items-center rounded-full bg-white px-5 text-sm font-semibold text-navy ring-1 ring-inset ring-line hover:bg-mist"
            >
              Sign out
            </button>
          </form>
        </div>

        {quotes.length === 0 ? (
          <p className="mt-8 rounded-2xl bg-white px-6 py-10 text-center text-sm text-muted ring-1 ring-line">
            No quote requests yet. They will appear here as soon as one is submitted.
          </p>
        ) : (
          <div className="mt-6 overflow-x-auto rounded-2xl bg-white ring-1 ring-line">
            <table className="w-full min-w-[54rem] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-line text-xs uppercase tracking-[0.1em] text-muted">
                  <th scope="col" className="px-5 py-3 font-semibold">Reference</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Practice</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Product</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Status</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Email</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Received</th>
                </tr>
              </thead>
              <tbody>
                {quotes.map((quote) => (
                  <tr key={quote.id} className="border-b border-line last:border-b-0 hover:bg-mist/60">
                    <td className="px-5 py-3">
                      <Link
                        href={`/owner/quotes/${quote.id}`}
                        className="font-bold text-teal-700 underline-offset-4 hover:underline"
                      >
                        {quote.reference}
                      </Link>
                    </td>
                    <td className="px-5 py-3">
                      <span className="font-semibold text-navy">{quote.practiceName}</span>
                      <span className="block text-xs text-muted">{quote.contactName}</span>
                    </td>
                    <td className="px-5 py-3 text-muted">{quote.productLabel}</td>
                    <td className="px-5 py-3"><StatusBadge status={quote.status} /></td>
                    <td className="px-5 py-3">
                      <div className="flex flex-wrap gap-1.5">
                        <EmailBadge label="You" status={quote.ownerEmailStatus} />
                        <EmailBadge label="Customer" status={quote.customerEmailStatus} />
                      </div>
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap text-muted">{DATE.format(quote.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Container>
    </main>
  );
}
