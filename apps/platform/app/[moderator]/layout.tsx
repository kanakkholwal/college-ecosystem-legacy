import Page403 from "@/components/utils/403";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSession } from "src/lib/auth";
import { sessionType } from "src/types/session";
import Navbar from "./components/navbar";
import SideNav from "./components/sidenav";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Dashboard ",
};

const ALLOWED_ROLES = ["admin", "moderator", "cr", "hod", "faculty"] as const;

interface DashboardLayoutProps {
  children: React.ReactNode;
  params: {
    moderator: (typeof ALLOWED_ROLES)[number];
  };
}

export default async function DashboardLayout({
  children,
  params,
}: DashboardLayoutProps) {
  const moderator = params.moderator!;

  const session = (await getSession()) as sessionType | null;

  if (!(ALLOWED_ROLES.includes(params.moderator) && !!session?.user)) {
    return notFound();
  }

  if (!session.user.roles.includes(moderator)) return <Page403 />;

  return (
    <>
      <div className="flex h-full min-h-screen selection:bg-primary/10 selection:text-primary dark:bg-neutral-900 bg-slate-200/80 z-0">
        <SideNav user={session.user} role={moderator} />
        <div className="xl:pl-80 flex flex-col flex-1 w-full relative z-0">
          <Navbar user={session.user} />
          <div
            aria-hidden="true"
            className="absolute inset-0 grid grid-cols-2 -space-x-52 opacity-40 dark:opacity-20 -z-[1]"
          >
            <div className="blur-[106px] h-56 bg-gradient-to-br from-primary to-purple-400 dark:from-blue-700" />
            <div className="blur-[106px] h-32 bg-gradient-to-r from-cyan-400 to-sky-300 dark:to-indigo-600" />
          </div>

          <main className="content p-2 md:p-4 z-2 @container space-y-10">
            {children}
          </main>
          {process.env.NODE_ENV !== "production" && (
            <div className="fixed bottom-0 right-0 p-2 text-xs text-gray-500 dark:text-slate-400">
              v0.0.1({process.env.NODE_ENV})
            </div>
          )}
        </div>
      </div>
    </>
  );
}
