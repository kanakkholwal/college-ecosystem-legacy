import { betterFetch } from "@better-fetch/fetch";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { Session } from "~/lib/auth";

const SIGN_IN_PATH = "/sign-in";

const authorized_pathsMap = new Map([
  ["/admin", ["admin"]],
  ["/faculty", ["faculty"]],
  ["/cr", ["faculty"]],
  ["/student", ["faculty"]],
  ["/guard", ["guard"]],
]);

const UN_PROTECTED_API_ROUTES = ["/api/auth/*"];

function isAuthorized(roles: string[], allowedRoles: string[]) {
  return roles.some((role) => allowedRoles.includes(role));
}

export async function middleware(request: NextRequest) {
  const url = new URL(request.url);
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
    if (request.nextUrl.pathname === SIGN_IN_PATH) {
      return NextResponse.next();
    }
    // if the user is not authenticated and tries to access a page other than the sign-in page, redirect them to the sign-in page
    url.searchParams.set("next", request.url);
    url.pathname = SIGN_IN_PATH;
    return NextResponse.redirect(url);
  }
  if (session) {
    // if the user is already authenticated and tries to access the sign-in page, redirect them to the home page
    if (
      request.nextUrl.pathname === SIGN_IN_PATH &&
      request.nextUrl.searchParams.get("tab") !== "reset-password" &&
      !request.nextUrl.searchParams.get("token")?.trim()
    ) {
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
    // if the user is already authenticated
    const allows_roles = authorized_pathsMap.get(request.nextUrl.pathname);
    if (authorized_pathsMap.has(request.nextUrl.pathname) && allows_roles) {
      if (
        !isAuthorized(
          [...session.user.other_roles, session.user.role],
          allows_roles
        )
      ) {
        url.pathname = "/unauthorized";
        return NextResponse.redirect(url);
      }
    }
  }
  if (request.method === "POST") {
    if (!session) {
      return NextResponse.redirect(new URL(SIGN_IN_PATH, request.url));
    }
    const allows_roles = authorized_pathsMap.get(request.nextUrl.pathname);
    if (authorized_pathsMap.has(request.nextUrl.pathname) && allows_roles) {
      if (
        !isAuthorized(
          [...session.user.other_roles, session.user.role],
          allows_roles
        )
      ) {
        return NextResponse.json(
          {
            status: "error",
            message: "You are not authorized to perform this action",
          },
          {
            status: 403,
          }
        );
      }
    }
  }
  if (request.nextUrl.pathname.startsWith("/api")) {
    if (
      UN_PROTECTED_API_ROUTES.some((route) =>
        new RegExp(route.replace(/\*/g, ".*")).test(request.nextUrl.pathname)
      )
    ) {
      return NextResponse.next();
    }
    if (!session) {
      return NextResponse.json(
        {
          status: "error",
          message: "You are not authorized to perform this action",
        },
        {
          status: 403,
        }
      );
    }
    const allows_roles = authorized_pathsMap.get(request.nextUrl.pathname);
    if (authorized_pathsMap.has(request.nextUrl.pathname) && allows_roles) {
      if (
        !isAuthorized(
          [...session.user.other_roles, session.user.role],
          allows_roles
        )
      ) {
        return NextResponse.json(
          {
            status: "error",
            message: "You are not authorized to perform this action",
          },
          {
            status: 403,
          }
        );
      }
    }
  }
  const nextTargetRoute = request.nextUrl.searchParams.get("next");
  // if the user is already authenticated and tries to access the sign-in page, redirect them to the home page
  if (nextTargetRoute) {
    const targetUrl = decodeURIComponent(nextTargetRoute);
    // console.log("targetUrl", targetUrl);
    const nextRedirect = request.nextUrl.searchParams.get("redirect");

    if (targetUrl && nextRedirect !== "false") {
      const targetUrlObj = new URL(targetUrl);
      return NextResponse.redirect(targetUrlObj);
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
     * - manifest.manifest (manifest file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|manifest.webmanifest|.next/static).*)",
  ],
};
