"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/brand/Logo";
import { loginAction, type LoginState } from "../actions";

function LoginForm() {
  const params = useSearchParams();
  const next = params.get("next") ?? "/owner/quotes";
  const [state, formAction, pending] = useActionState<LoginState, FormData>(loginAction, {});

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="next" value={next} />

      {state.error && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700 ring-1 ring-inset ring-red-200">
          {state.error}
        </p>
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-semibold text-navy">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="username"
          className="w-full rounded-xl border border-line bg-white px-4 py-3 text-[0.9375rem] text-navy outline-none focus:border-teal focus:ring-2 focus:ring-teal/30"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-semibold text-navy">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="w-full rounded-xl border border-line bg-white px-4 py-3 text-[0.9375rem] text-navy outline-none focus:border-teal focus:ring-2 focus:ring-teal/30"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="mt-2 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-teal px-6 text-[0.9375rem] font-semibold text-white transition-colors hover:bg-teal-700 disabled:bg-teal/60"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

export default function OwnerLoginPage() {
  return (
    <section className="bg-mist py-14 sm:py-20">
      <Container>
        <div className="mx-auto w-full max-w-md rounded-2xl bg-white p-7 shadow-card ring-1 ring-line sm:p-8">
          <Logo href={null} />
          <h1 className="mt-6 text-xl font-bold text-navy">Staff sign in</h1>
          <p className="mt-1.5 text-sm leading-relaxed text-muted">
            This area is for Dentistry Printing staff. Customers do not need an account to request
            a quote.
          </p>
          <div className="mt-6">
            <Suspense fallback={null}>
              <LoginForm />
            </Suspense>
          </div>
        </div>
      </Container>
    </section>
  );
}
