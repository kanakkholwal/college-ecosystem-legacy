import { betterFetch } from "@better-fetch/fetch";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { ROLES } from "~/constants";
import type { Session } from "~/lib/auth";

const SIGN_IN_PATH = "/sign-in";



const UN_PROTECTED_API_ROUTES = ["/api/auth/*"];
const DashboardRoutes = [
  ROLES.ADMIN,
  ROLES.FACULTY,
  ROLES.CR,
  ROLES.FACULTY,
  ROLES.CHIEF_WARDEN,
  ROLES.WARDEN,
  ROLES.ASSISTANT_WARDEN,
  ROLES.MMCA,
  ROLES.HOD,
  ROLES.GUARD,
  ROLES.LIBRARIAN,
  ROLES.STUDENT,
];


/**
 * Check if the user is authorized to access the given route.
 * @param route_path - The path of the route to check authorization for.
 * @param session - The session object containing user information.
 * @returns An object containing authorization status and redirect information.
 */
function checkAuthorization(
  route_path: (typeof DashboardRoutes)[number],
  session: Session | null
) {
  // 1. No session, redirect to sign-in
  if (!session) {
    return {
      redirect: { destination: "/sign-in" },
      authorized: false,
      notFound: false,
    };
  }

  // 2. Invalid role
  if (!DashboardRoutes.includes(route_path)) {
    console.log("Invalid moderator role:", route_path);
    // const destination = session.user.other_roles.includes("student")
    //   ? "/"
    //   : session.user.other_roles[0] || "/";
    const destination =
      session.user.other_roles?.length > 0 ? session.user.other_roles[0] : "/";
    return {
      redirect: { destination },
      authorized: false,
      notFound: false,
    };
  }

  // 4. Authorized check
  if (
    session.user.other_roles
      .map((role) => role.toLowerCase())
      .includes(route_path.toLowerCase()) ||
    session.user.role.toLowerCase() === route_path.toLowerCase()
  ) {
    return {
      notFound: false,
      authorized: true,
      redirect: null,
    };
  }

  return {
    notFound: true,
    authorized: false,
    redirect: null,
  };
}

export async function middleware(request: NextRequest) {
  const url = new URL(request.url);
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
  if (!session) {
    if (request.nextUrl.pathname === SIGN_IN_PATH) {
      return NextResponse.next();
    }
    // if the user is not authenticated and tries to access a page other than the sign-in page, redirect them to the sign-in page
    url.pathname = SIGN_IN_PATH;
    url.searchParams.set("next", request.url);
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
    // manage the dashboard routes
    if (request.method === "GET" && 
      DashboardRoutes.includes(request.nextUrl.pathname.slice(1) as (typeof DashboardRoutes)[number])) {
      const authCheck = checkAuthorization(
        request.nextUrl.pathname.slice(1) as (typeof DashboardRoutes)[number],
        session
      );
      if (authCheck.redirect) {
        return NextResponse.redirect(
          new URL(authCheck.redirect.destination, request.url)
        );
      }
      if (!authCheck.authorized) {
        return NextResponse.redirect(
          new URL("/unauthorized?target=" + request.url, request.url)
        );

      }

    }

  }
  if (request.method === "POST" || request.nextUrl.pathname.startsWith("/api")) {
    if (!session) {
      return NextResponse.redirect(new URL(SIGN_IN_PATH, request.url));
    }
    if (
      UN_PROTECTED_API_ROUTES.some((route) =>
        new RegExp(route.replace(/\*/g, ".*")).test(request.nextUrl.pathname)
      )
    ) {
      return NextResponse.next();
    }
    if (DashboardRoutes.includes(request.nextUrl.pathname.slice(1) as (typeof DashboardRoutes)[number])) {
      const authCheck = checkAuthorization(
        request.nextUrl.pathname.slice(1) as (typeof DashboardRoutes)[number],
        session
      );
      if (authCheck.redirect) {
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
        )
      }
      if (!authCheck.authorized) {
        return NextResponse.json({
          status: "error",
          message: "You are not authorized to perform this action",
        }, {
          status: 403,
          headers: {
            "Un-Authorized-Redirect": "true",
            "Un-Authorized-Redirect-Path": SIGN_IN_PATH,
            "Un-Authorized-Redirect-Next": request.nextUrl.href,
            "Un-Authorized-Redirect-Method": request.method,
            "Un-Authorized-Redirect-max-tries": "5",
            "Un-Authorized-Redirect-tries": "1",
          },
        })

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
