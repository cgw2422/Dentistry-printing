import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { randomUUID } from "node:crypto";

export type EmailMessage = {
  to: string;
  subject: string;
  text: string;
  html: string;
};

export type SendResult =
  | { status: "SENT"; id?: string }
  | { status: "FAILED"; error: string }
  | { status: "SKIPPED"; error: string };

/**
 * Transactional email.
 *
 * `resend` is what production uses. `capture` writes each message to disk so
 * the automated tests can assert on real rendered content without sending
 * anything; it is selected by EMAIL_TRANSPORT and is never the default.
 * With no provider configured the result is SKIPPED, which is recorded on the
 * quote — the request itself is already saved either way.
 */
export async function sendEmail(message: EmailMessage): Promise<SendResult> {
  const transport = process.env.EMAIL_TRANSPORT ?? "resend";

  if (transport === "capture") return captureToDisk(message);

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.QUOTE_FROM_EMAIL;

  if (!apiKey || !from) {
    return {
      status: "SKIPPED",
      error: "RESEND_API_KEY or QUOTE_FROM_EMAIL is not configured.",
    };
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);
    const result = await resend.emails.send({
      from,
      to: message.to,
      subject: message.subject,
      text: message.text,
      html: message.html,
    });

    if (result.error) {
      return { status: "FAILED", error: truncate(result.error.message) };
    }
    return { status: "SENT", id: result.data?.id };
  } catch (error) {
    return { status: "FAILED", error: truncate(error instanceof Error ? error.message : String(error)) };
  }
}

async function captureToDisk(message: EmailMessage): Promise<SendResult> {
  const dir = process.env.EMAIL_CAPTURE_DIR ?? ".mail-outbox";
  try {
    await mkdir(dir, { recursive: true });
    const id = randomUUID();
    await writeFile(
      join(dir, `${Date.now()}-${id}.json`),
      JSON.stringify({ ...message, capturedAt: new Date().toISOString() }, null, 2),
      "utf8",
    );
    return { status: "SENT", id };
  } catch (error) {
    return { status: "FAILED", error: truncate(error instanceof Error ? error.message : String(error)) };
  }
}

/** Errors are stored in a VarChar(500) column and shown to the owner. */
function truncate(value: string): string {
  return value.length > 480 ? `${value.slice(0, 480)}…` : value;
}
