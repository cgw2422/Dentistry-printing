import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & { id: string };
    /** The User.sessionEpoch this token was minted with. */
    epoch?: number;
  }

  interface User {
    sessionEpoch?: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    epoch?: number;
  }
}

export {};
