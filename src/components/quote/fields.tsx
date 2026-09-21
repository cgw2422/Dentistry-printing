import type { ReactNode } from "react";

const CONTROL =
  "w-full rounded-xl border border-line bg-white px-4 py-3 text-[0.9375rem] text-navy outline-none transition-colors placeholder:text-muted focus:border-teal focus:ring-2 focus:ring-teal/30";

export function Field({
  label,
  name,
  error,
  hint,
  required,
  children,
}: {
  label: string;
  name: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: (props: { id: string; className: string; describedBy?: string }) => ReactNode;
}) {
  const hintId = hint ? `${name}-hint` : undefined;
  const errorId = error ? `${name}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-sm font-semibold text-navy">
        {label}
        {required ? (
          <span className="ml-1 text-teal-700" aria-hidden="true">
            *
          </span>
        ) : (
          <span className="ml-1.5 font-medium text-muted">(optional)</span>
        )}
      </label>
      {hint && (
        <p id={hintId} className="text-xs leading-relaxed text-muted">
          {hint}
        </p>
      )}
      {children({
        id: name,
        className: `${CONTROL} ${error ? "border-red-500 ring-1 ring-red-500/30" : ""}`,
        describedBy,
      })}
      {error && (
        <p id={errorId} role="alert" className="text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

export function Fieldset({ legend, children }: { legend: string; children: ReactNode }) {
  return (
    <fieldset className="border-0 p-0">
      <legend className="text-base font-bold text-navy sm:text-lg">{legend}</legend>
      <div className="mt-4 flex flex-col gap-4">{children}</div>
    </fieldset>
  );
}
