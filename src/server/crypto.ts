import { createHmac, randomBytes, randomUUID, scrypt, timingSafeEqual } from "node:crypto";
import type { ScryptOptions } from "node:crypto";
import { promisify } from "node:util";

// promisify picks the 3-argument overload, which drops the cost parameters.
const scryptAsync = promisify(scrypt) as (
  password: string,
  salt: Buffer,
  keylen: number,
  options: ScryptOptions,
) => Promise<Buffer>;

/** Cost parameters. N=2^16 is deliberately slow for an interactive login. */
const SCRYPT = { N: 65536, r: 8, p: 1, keylen: 64 } as const;

function secret(): string {
  const value = process.env.AUTH_SECRET;
  if (!value || value.length < 32) {
    throw new Error("AUTH_SECRET must be set to at least 32 characters. See .env.example.");
  }
  return value;
}

/* ------------------------------------------------------------------ */
/* Passwords                                                           */
/* ------------------------------------------------------------------ */

/** `scrypt$N$r$p$salt$hash`, so the parameters travel with the hash. */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const derived = await scryptAsync(password.normalize("NFKC"), salt, SCRYPT.keylen, {
    N: SCRYPT.N,
    r: SCRYPT.r,
    p: SCRYPT.p,
    maxmem: 256 * 1024 * 1024,
  });

  return ["scrypt", SCRYPT.N, SCRYPT.r, SCRYPT.p, salt.toString("base64"), derived.toString("base64")].join("$");
}

/**
 * Constant-time verify. Returns false rather than throwing on a malformed
 * hash, so a corrupted record cannot be told apart from a wrong password.
 */
export async function verifyPassword(password: string, stored: string | null): Promise<boolean> {
  if (!stored) return false;
  const parts = stored.split("$");
  if (parts.length !== 6 || parts[0] !== "scrypt") return false;

  const [, n, r, p, saltB64, hashB64] = parts;
  try {
    const salt = Buffer.from(saltB64, "base64");
    const expected = Buffer.from(hashB64, "base64");
    const derived = await scryptAsync(password.normalize("NFKC"), salt, expected.length, {
      N: Number(n),
      r: Number(r),
      p: Number(p),
      maxmem: 256 * 1024 * 1024,
    });
    return derived.length === expected.length && timingSafeEqual(derived, expected);
  } catch {
    return false;
  }
}

/* ------------------------------------------------------------------ */
/* Hashing identifiers, signing short-lived values                     */
/* ------------------------------------------------------------------ */

/**
 * Keyed hash of an identifier (IP address, email) for rate-limit records.
 * Keyed rather than plain SHA-256 so the stored values cannot be reversed
 * with a dictionary of addresses.
 */
export function hashIdentifier(value: string): string {
  return createHmac("sha256", secret()).update(value.trim().toLowerCase()).digest("hex");
}

/** `value.signature`, for short-lived cookies that must not be forgeable. */
export function sign(value: string): string {
  const signature = createHmac("sha256", secret()).update(value).digest("base64url");
  return `${value}.${signature}`;
}

export function unsign(signed: string | undefined): string | null {
  if (!signed) return null;
  const index = signed.lastIndexOf(".");
  if (index <= 0) return null;

  const value = signed.slice(0, index);
  const provided = Buffer.from(signed.slice(index + 1));
  const expected = Buffer.from(createHmac("sha256", secret()).update(value).digest("base64url"));

  if (provided.length !== expected.length) return null;
  return timingSafeEqual(provided, expected) ? value : null;
}

/** Short, unambiguous reference for a quote, e.g. DP-7F3K2Q. */
export function quoteReference(): string {
  const alphabet = "ACDEFGHJKLMNPQRSTUVWXYZ2345679"; // no I/O/0/1/B/8
  const bytes = randomBytes(6);
  let out = "";
  for (const byte of bytes) out += alphabet[byte % alphabet.length];
  return `DP-${out}`;
}

export { randomUUID };
