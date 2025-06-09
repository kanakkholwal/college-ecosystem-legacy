import { betterFetch } from "@better-fetch/fetch";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { Session } from "~/lib/auth";
import { checkAuthorization, dashboardRoutes, isRouteAllowed, PRIVATE_ROUTES, SIGN_IN_PATH, UN_PROTECTED_API_ROUTES } from "~/middleware.setting";
import { appConfig } from "~/project.config";

export async function middleware(request: NextRequest) {
  const url = new URL(request.url);
  const pathname = request.nextUrl.pathname;
  const isPrivateRoute = PRIVATE_ROUTES.some((route) => isRouteAllowed(pathname, route.pattern));

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
  // console.log("Private route accessed:", isPrivateRoute, pathname);
  if (isPrivateRoute) {
    // console.log("Private route accessed:", pathname);
    if (session && !UN_PROTECTED_API_ROUTES.some((route) =>
      new RegExp(route.replace(/\*/g, ".*")).test(request.nextUrl.pathname)
    )) {
      // if the user is authenticated and tries to access a private route, allow it to pass through
      const protectedPaths = dashboardRoutes.map((role) => `/${role.toLowerCase()}`);
      const matchedRole = protectedPaths.find((path) =>
        request.nextUrl.pathname.toLowerCase().startsWith(path)
      )?.slice(1) as (typeof dashboardRoutes)[number];
      const authCheck = checkAuthorization(matchedRole, session);

      if (!authCheck.authorized) {
        if (request.method === "GET") {
          return NextResponse.redirect(
            new URL("/unauthorized?target=" + request.url, request.url)
          );
        }
        if (request.method === "POST") {
          console.log("Unauthorized POST request to:", request.nextUrl.pathname);
          return NextResponse.json(
            {
              status: "error",
              message: "You are not authorized to perform this action",
              data: null,
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
                "Content-Type": "application/json",
              },
            }
          );
        }
      }
      if (authCheck.redirect?.destination) {
        console.log("Redirecting to:", authCheck.redirect.destination);
        // if the user is authenticated and tries to access a protected route, redirect them to the appropriate page
        return NextResponse.redirect(
          new URL(authCheck.redirect.destination, request.url)
        );
      }
      // Special redirect: /dashboard -> /<first-role>
      if (request.nextUrl.pathname.startsWith("/dashboard")) {
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
      return NextResponse.next();
    }
    // if the user is not authenticated and tries to access a private route, redirect them to the sign-in page
    url.pathname = SIGN_IN_PATH;
    url.searchParams.set("next", request.url);
    return NextResponse.redirect(url);
  }
  if(session){
    if(pathname === SIGN_IN_PATH) {
      url.pathname = "/";
      url.search = url.searchParams.toString();
      // if the user is already authenticated and tries to access the sign-in page, redirect them to the home page
      return NextResponse.redirect(url);
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
      const targetUrlObj = new URL(targetUrl, appConfig.url);
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
    "/((?!api|_next/static|_next/image|assets|favicon.ico|manifest.webmanifest|.*\\.(?:png|jpg|jpeg|svg|webp|ico|txt|json|xml|js)).*)",
  ],
};
