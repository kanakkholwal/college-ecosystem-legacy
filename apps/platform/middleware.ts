import { betterFetch } from "@better-fetch/fetch";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { Session } from "~/lib/auth";

// Paths that do not require authentication
const unauthorized_paths = ["/sign-in", "/signup", "/forgot-password"];

const authorized_paths = {
  "/admin": ["admin"],
  "/faculty": ["faculty"],
  "/cr": ["faculty"],
  "/student": ["faculty"],
};

export async function middleware(request: NextRequest) {
  const { data: session } = await betterFetch<Session>(
    "/api/auth/get-session",
    {
      baseURL: request.nextUrl.origin,
      headers: {
        //get the cookie from the request
        cookie: request.headers.get("cookie") || "",
      },
    }
  );
  if (!session) {
    if (request.nextUrl.pathname === "/sign-in") {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }
  if (session) {
    for (const [path, roles] of Object.entries(authorized_paths)) {
      if (
        request.nextUrl.pathname.startsWith(path) &&
        !(
          session.user.other_roles.some((role) => roles.includes(role)) ||
          roles.includes(session.user.role)
        )
      ) {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }
    }
  }

  return NextResponse.next();
}
// the following code has been copied from https://nextjs.org/docs/advanced-features/middleware#matcher
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
