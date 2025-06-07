import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { appConfig } from "./project.config";



export async function middleware(request: NextRequest) {
  

  if (request.nextUrl.pathname.startsWith("/api")) {
    const headers = request.headers.get("X-Authorization") || "";
    if (headers !== process.env.SERVER_IDENTITY) {
      return NextResponse.json(
        {
          error: "Missing or invalid SERVER_IDENTITY",
          data: null,
        },
        { status: 403 }
      );
    }
    return NextResponse.next();
  }
  
  // If the request is not for an API route, redirect to the appConfig URL
  return NextResponse.redirect(
    appConfig.url + "?utm_source=mail-server-middleware"
  )
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
