import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    // Add a new header x-current-path which passes the path to downstream components
    const headers = new Headers(request.headers);
    const rootUrl = process.env.NEXTAUTH_URL as string
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
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}