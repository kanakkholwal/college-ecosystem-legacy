import { betterFetch } from "@better-fetch/fetch";
import type { Session } from "better-auth/types";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const unauthorized_paths = [
  "/sign-in",
  "/signup",
  "/forgot-password",
  "/reset-password",
];

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
  if (!session && !unauthorized_paths.includes(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }
  // Add a new header x-current-path which passes the path to downstream components
  const headers = new Headers(request.headers);
  const rootUrl = process.env.NEXTAUTH_URL as string;
  headers.set("x-current-path", rootUrl + request.nextUrl.pathname);
  return NextResponse.next({ headers });
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
