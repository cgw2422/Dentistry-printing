import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";

import { prisma } from "@/server/db";
import { hashIdentifier, verifyPassword } from "@/server/crypto";

/**
 * Auth.js configuration.
 *
 * ── Why JWT sessions, not database sessions ──────────────────────────────
 * Auth.js refuses to start with a database session strategy when credentials
 * is the only provider — it throws `UnsupportedStrategy` from
 * @auth/core/lib/utils/assert. Password sign-in therefore has to use JWT
 * sessions. The adapter is still wired up so the User/Account/Session tables
 * are Auth.js-shaped and an OAuth or magic-link provider can be added later.
 *
 * A JWT cannot be deleted server-side, so two things compensate:
 *
 *  1. `User.sessionEpoch` is embedded in the token and re-checked against the
 *     database on every authorization call. Bumping it signs the user out of
 *     every device at once, and a disabled account stops working immediately.
 *  2. Roles are never read from the token when deciding access. They are read
 *     from the database (see `src/server/auth/guards.ts`), so a demotion takes
 *     effect on the next request rather than when the token expires.
 */

const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;

/**
 * Failed login attempts allowed per identifier per window before lockout.
 * Counting per address as well as per account blunts both credential stuffing
 * against one account and a spray across many. The defaults are the production
 * values; the overrides exist so a test run can widen the shared-address bucket
 * without weakening the per-account limit it is actually asserting.
 */
const LOGIN_LIMIT = {
  perEmail: Number(process.env.LOGIN_RATE_LIMIT_PER_EMAIL ?? 5),
  perIp: Number(process.env.LOGIN_RATE_LIMIT_PER_IP ?? 20),
  windowMinutes: Number(process.env.LOGIN_RATE_LIMIT_WINDOW_MINUTES ?? 15),
};

async function tooManyAttempts(emailHash: string, ipHash: string): Promise<boolean> {
  const since = new Date(Date.now() - LOGIN_LIMIT.windowMinutes * 60_000);
  const [emailFailures, ipFailures] = await Promise.all([
    prisma.loginAttempt.count({ where: { emailHash, success: false, createdAt: { gte: since } } }),
    prisma.loginAttempt.count({ where: { ipHash, success: false, createdAt: { gte: since } } }),
  ]);
  return emailFailures >= LOGIN_LIMIT.perEmail || ipFailures >= LOGIN_LIMIT.perIp;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt", maxAge: SESSION_MAX_AGE_SECONDS },
  trustHost: true,
  pages: { signIn: "/owner/login" },

  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        ip: { type: "text" },
      },
      async authorize(credentials) {
        const email = typeof credentials?.email === "string" ? credentials.email.trim().toLowerCase() : "";
        const password = typeof credentials?.password === "string" ? credentials.password : "";
        const ip = typeof credentials?.ip === "string" ? credentials.ip : "unknown";
        if (!email || !password) return null;

        const emailHash = hashIdentifier(email);
        const ipHash = hashIdentifier(ip);

        if (await tooManyAttempts(emailHash, ipHash)) return null;

        const user = await prisma.user.findUnique({ where: { email } });

        // Verify even when there is no such user, so a missing account and a
        // wrong password take the same time and give the same answer.
        const ok = await verifyPassword(password, user?.passwordHash ?? null);
        const allowed = ok && user !== null && user.status === "ACTIVE";

        await prisma.loginAttempt.create({
          data: { emailHash, ipHash, success: allowed },
        });

        if (!allowed || !user) return null;

        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });

        return { id: user.id, email: user.email, name: user.name, sessionEpoch: user.sessionEpoch };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user && "sessionEpoch" in user) {
        token.sub = user.id;
        token.epoch = user.sessionEpoch as number;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.epoch = typeof token.epoch === "number" ? token.epoch : 0;
      }
      return session;
    },
  },
});
