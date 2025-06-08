import { betterFetch } from "@better-fetch/fetch";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { Session } from "~/lib/auth";
import { checkAuthorization, dashboardRoutes, PUBLIC_ROUTES, publicRouteHandleAbsolute, SIGN_IN_PATH, UN_PROTECTED_API_ROUTES } from "~/middleware.setting";

export async function middleware(request: NextRequest) {
  const url = new URL(request.url);
  const pathname = request.nextUrl.pathname;
  const isPublicRoute = PUBLIC_ROUTES.some((route) => publicRouteHandleAbsolute(route, pathname));
  const requiresAuth = !isPublicRoute;

  // if the request is for the sign-in page, allow it to pass through
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
  if (requiresAuth && !session) {

    // if the user is not authenticated and tries to access a page other than the sign-in page, redirect them to the sign-in page
    url.pathname = SIGN_IN_PATH;
    url.searchParams.set("next", request.url);
    return NextResponse.redirect(url);
  }
  if (session &&
    request.nextUrl.pathname === SIGN_IN_PATH &&
    request.nextUrl.searchParams.get("tab") !== "reset-password" &&
    !request.nextUrl.searchParams.get("token")?.trim()
  ) {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }
  // Special redirect: /dashboard -> /<first-role>
  if (request.nextUrl.pathname.startsWith("/dashboard") && session) {
    return NextResponse.redirect(
      new URL(
        request.nextUrl.pathname.replace(
          "/dashboard",
          session?.user.other_roles[0]
        ),
        request.url
      )
    );
  }
  // Now handle dashboard-like role-based paths
  const protectedPaths = dashboardRoutes.map((role) => `/${role.toLowerCase()}`);
  const matchedRole = protectedPaths.find((path) =>
    request.nextUrl.pathname.toLowerCase().startsWith(path)
  )?.slice(1) as (typeof dashboardRoutes)[number];
  const authCheck = checkAuthorization(matchedRole, session);

  if (
    request.method === "GET" || request.method === "POST" ||
    request.nextUrl.pathname.startsWith("/api")) {

    console.log("Checking authorization for path:", request.nextUrl.pathname);
    if (
      UN_PROTECTED_API_ROUTES.some((route) =>
        new RegExp(route.replace(/\*/g, ".*")).test(request.nextUrl.pathname)
      )
    ) {
      return NextResponse.next();
    }
    // if the user is authenticated and tries to access a protected route, check if they are authorized
    if (!authCheck.authorized) {
      if (request.method === "GET") 
        return NextResponse.redirect(
          new URL("/unauthorized?target=" + request.url, request.url)
        );
      if (request.method === "POST") {
        return NextResponse.json(
          {
            status: "error",
            message: "You are not authorized to perform this action",
          },
          {
            status: 403,
            headers: {
              "Un-Authorized-Redirect": "true",
              "Un-Authorized-Redirect-Path": SIGN_IN_PATH,
              "Un-Authorized-Redirect-Next": request.nextUrl.href,
              "Un-Authorized-Redirect-Method": request.method,
              "Un-Authorized-Redirect-max-tries": "5",
              "Un-Authorized-Redirect-tries": "1",
            },
          }
        );
      }
    }
    if (matchedRole && authCheck.redirect?.destination) {
      return NextResponse.redirect(
        new URL(authCheck.redirect.destination, request.url)
      );
    }
  }


  // nextTargetRoute is used to redirect the user to the page they were trying to access before being redirected to the sign-in page
  const nextTargetRoute = request.nextUrl.searchParams.get("next");
  // if the user is already authenticated and tries to access the sign-in page, redirect them to the home page
  if (nextTargetRoute) {
    const targetUrl = decodeURIComponent(nextTargetRoute);
    // console.log("targetUrl", targetUrl);
    const nextRedirect = request.nextUrl.searchParams.get("redirect");

    if (targetUrl && nextRedirect !== "false" && session) {
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
