import { NextResponse, type NextRequest } from "next/server";

/**
 * Cheap first gate for /owner/*: bounce anyone with no session cookie straight
 * to the login page.
 *
 * This is a convenience, not the authorization boundary. It cannot see roles
 * or account status, so every owner page and Server Action re-checks with
 * `requireStaff` / `requireStaffPage` against the database.
 */
const SESSION_COOKIES = [
  "authjs.session-token",
  "__Secure-authjs.session-token",
  "next-auth.session-token",
  "__Secure-next-auth.session-token",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/owner/login") return NextResponse.next();

  const hasSession = SESSION_COOKIES.some((name) => request.cookies.has(name));
  if (hasSession) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = "/owner/login";
  url.search = `?next=${encodeURIComponent(pathname)}`;
  return NextResponse.redirect(url);
}

export const config = { matcher: ["/owner/:path*"] };
