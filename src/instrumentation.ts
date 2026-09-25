/**
 * Startup configuration check.
 *
 * Next runs `register()` once when the server boots. Without this, a deploy
 * that is missing its environment variables still serves a site that looks
 * completely fine: every page renders, the quote form is right there, and the
 * submission throws a raw server-error screen. The visitor leaves, and nothing
 * tells the owner it happened.
 *
 * Failing the boot instead turns an invisible problem into an obvious one. A
 * deploy that crashes on start gets noticed and fixed; a live site that
 * silently cannot capture a lead does not.
 *
 * Only what the site genuinely cannot run without is listed. Email is not
 * required: unconfigured, sending is recorded as SKIPPED and the quote request
 * is still saved.
 */
const REQUIRED: { name: string; why: string; check?: (value: string) => string | null }[] = [
  {
    name: "DATABASE_URL",
    why: "quote requests are stored in PostgreSQL; without it no lead can be saved",
  },
  {
    name: "AUTH_SECRET",
    why: "signs sessions and the confirmation cookie, and keys rate-limit hashing",
    check: (value) =>
      value.length < 32 ? "must be at least 32 characters (try: openssl rand -base64 33)" : null,
  },
];

export async function register() {
  // Only the Node server runtime has the environment; the edge runtime and the
  // browser bundle never see these.
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  const problems: string[] = [];

  for (const { name, why, check } of REQUIRED) {
    const value = process.env[name];
    if (!value) {
      problems.push(`  ${name} is not set — ${why}.`);
      continue;
    }
    const invalid = check?.(value);
    if (invalid) problems.push(`  ${name} ${invalid}.`);
  }

  if (problems.length === 0) return;

  throw new Error(
    [
      "",
      "Dentistry Printing cannot start: required configuration is missing.",
      "",
      ...problems,
      "",
      "See .env.example for every variable and what it is for. On Railway these",
      "are set on the app service under Variables.",
      "",
    ].join("\n"),
  );
}
