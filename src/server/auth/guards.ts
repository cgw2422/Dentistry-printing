import "server-only";

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/server/db";
import type { OrganizationRole, PlatformRole, User } from "@/generated/prisma";

/**
 * Authorization. Every protected page, Server Action and query goes through
 * these — middleware only redirects, it never decides.
 *
 * Roles and account status are read from the database on each call, not taken
 * from the session token, so a demotion or a disabled account takes effect on
 * the next request. The token's `epoch` is compared with the user's current
 * `sessionEpoch`, which is how a JWT session gets revoked server-side.
 */

export class NotAuthorizedError extends Error {
  constructor(message = "Not authorized") {
    super(message);
    this.name = "NotAuthorizedError";
  }
}

/** The signed-in, still-valid user — or null. Never throws. */
export async function getCurrentUser(): Promise<User | null> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return null;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.status !== "ACTIVE") return null;

  // A token minted before the epoch was bumped is no longer a valid session.
  if (typeof session?.epoch === "number" && session.epoch !== user.sessionEpoch) return null;

  return user;
}

/**
 * Require one of the given platform roles. Throws rather than returning a
 * falsy value, so a caller that forgets to check cannot leak data.
 */
export async function requirePlatformRole(allowed: PlatformRole[]): Promise<User> {
  const user = await getCurrentUser();
  if (!user) throw new NotAuthorizedError("Not signed in");
  if (!allowed.includes(user.platformRole)) throw new NotAuthorizedError("Insufficient platform role");
  return user;
}

/** Staff-and-above. Quote data is platform data, not practice data. */
export async function requireStaff(): Promise<User> {
  return requirePlatformRole(["PLATFORM_ADMIN", "PLATFORM_STAFF"]);
}

/** Page-level variant: sends the visitor to the login screen instead. */
export async function requireStaffPage(returnTo?: string): Promise<User> {
  const user = await getCurrentUser();
  if (!user || (user.platformRole !== "PLATFORM_ADMIN" && user.platformRole !== "PLATFORM_STAFF")) {
    const next = returnTo ? `?next=${encodeURIComponent(returnTo)}` : "";
    redirect(`/owner/login${next}`);
  }
  return user;
}

/**
 * Organization access, for the practice-facing features that come later.
 *
 * Membership is what grants it — a platform admin is allowed through because
 * they operate the platform, but a practice owner never gains platform
 * privileges from this: the two role systems are checked separately and
 * neither is derived from the other.
 */
export async function assertOrganizationAccess(
  user: User,
  organizationId: string,
  allowedRoles?: OrganizationRole[],
): Promise<void> {
  if (user.platformRole === "PLATFORM_ADMIN" || user.platformRole === "PLATFORM_STAFF") return;

  const membership = await prisma.organizationMembership.findUnique({
    where: { userId_organizationId: { userId: user.id, organizationId } },
  });
  if (!membership) throw new NotAuthorizedError("Not a member of this organization");
  if (allowedRoles && !allowedRoles.includes(membership.role)) {
    throw new NotAuthorizedError("Insufficient organization role");
  }
}

/** The organizations a user may read. Empty for a user with no memberships. */
export async function accessibleOrganizationIds(user: User): Promise<string[]> {
  const memberships = await prisma.organizationMembership.findMany({
    where: { userId: user.id },
    select: { organizationId: true },
  });
  return memberships.map((m) => m.organizationId);
}
