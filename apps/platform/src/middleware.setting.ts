import { ROLES } from "~/constants";
import type { Session } from "~/lib/auth";



export const SIGN_IN_PATH = "/sign-in";

export const UN_PROTECTED_API_ROUTES =
    [
        "/api/auth/*",
    ];

export const PUBLIC_ROUTES = [
    "/",
    "/unauthorized",
    "/results",
    "/syllabus",
    "/classroom-availability",
    "/schedules",
    "/announcements",
    "/polls",
    "/community",
];
//export const PUBLIC_ROUTES: { pattern: RegExp }[] = [
//   { pattern: /^\/$/ },                              // home
//   { pattern: /^\/results\/[a-z0-9]+$/i },           // /results/21bcs123
//   { pattern: /^\/syllabus\/[a-z0-9-_]+$/i },         // /syllabus/cse-3
//   { pattern: /^\/classroom-availability\/?$/ },     // allow only main route
//   { pattern: /^\/schedules\/?$/ },
//   { pattern: /^\/announcements\/?$/ },
//   { pattern: /^\/polls\/?$/ },
//   { pattern: /^\/community\/[a-z0-9-]+$/i },        // post view, like /community/some-post
// ];

export const publicRouteHandleRegex = (({ pattern }, pathname: string) =>
    pattern.test(pathname)) as (route: { pattern: RegExp }, pathname: string) => boolean;

export const publicRouteHandleAbsolute = (route: string, pathname: string) => {
    // exact match
    if (pathname === route) return true;

    // allow trailing slash variants
    if (pathname === route.replace(/\/$/, "")) return true;

    // if route ends with /, only match direct children (not nested paths)
    if (route.endsWith("/") && pathname.startsWith(route)) {
        const rest = pathname.slice(route.length);
        return !rest.includes("/"); // no further nesting
    }

    return false;
}


export const dashboardRoutes = [
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
export function checkAuthorization(
    route_path: (typeof dashboardRoutes)[number],
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
    if (!dashboardRoutes.includes(route_path)) {
        // console.log("Invalid moderator role:", route_path);
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