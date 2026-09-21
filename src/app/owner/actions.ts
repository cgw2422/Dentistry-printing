"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { AuthError } from "next-auth";

import { signIn, signOut } from "@/auth";
import { prisma } from "@/server/db";
import { requireStaff } from "@/server/auth/guards";
import { retryNotification } from "@/server/quotes/notify";
import type { QuoteStatus } from "@/generated/prisma";

export type LoginState = { error?: string };

/**
 * Owner sign-in.
 *
 * Always returns the same message whether the account is missing, disabled or
 * the password is wrong, so the form cannot be used to discover which email
 * addresses exist.
 */
export async function loginAction(_previous: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/owner/quotes");

  const headerList = await headers();
  const ip = headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? headerList.get("x-real-ip") ?? "unknown";

  try {
    await signIn("credentials", { email, password, ip, redirect: false });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Those details did not match. Please try again." };
    }
    throw error;
  }

  // Only ever send the visitor to a path inside this site.
  redirect(next.startsWith("/owner") ? next : "/owner/quotes");
}

export async function logoutAction(): Promise<void> {
  await signOut({ redirectTo: "/owner/login" });
}

const STATUSES: QuoteStatus[] = [
  "NEW",
  "REVIEWING",
  "AWAITING_INFORMATION",
  "QUOTED",
  "ACCEPTED",
  "DECLINED",
  "CLOSED",
];

/** Every action re-checks the caller; the middleware redirect is not enough. */
export async function updateQuoteStatusAction(formData: FormData): Promise<void> {
  await requireStaff();

  const id = String(formData.get("quoteId") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!id || !STATUSES.includes(status as QuoteStatus)) return;

  await prisma.quoteRequest.update({ where: { id }, data: { status: status as QuoteStatus } });
  revalidatePath(`/owner/quotes/${id}`);
  revalidatePath("/owner/quotes");
}

export async function addQuoteNoteAction(formData: FormData): Promise<void> {
  const user = await requireStaff();

  const id = String(formData.get("quoteId") ?? "");
  const body = String(formData.get("body") ?? "").trim().slice(0, 4000);
  if (!id || !body) return;

  await prisma.quoteNote.create({
    data: { quoteRequestId: id, authorId: user.id, body },
  });
  revalidatePath(`/owner/quotes/${id}`);
}

export async function retryQuoteEmailAction(formData: FormData): Promise<void> {
  await requireStaff();

  const id = String(formData.get("quoteId") ?? "");
  const which = String(formData.get("which") ?? "");
  if (!id || (which !== "owner" && which !== "customer")) return;

  await retryNotification(id, which);
  revalidatePath(`/owner/quotes/${id}`);
}
