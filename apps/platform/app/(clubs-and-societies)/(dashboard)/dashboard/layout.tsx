import Navbar from "@/components/common/app-navbar";
import { ForbiddenPage } from "@/components/common/not-authorized";
import { AppSidebar } from "@/components/common/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getClubBySubDomain } from "~/actions/clubs";
import { ROLES } from "~/constants";
import type { Session } from "~/lib/auth";
import { getSession } from "~/lib/auth-server";



interface DashboardLayoutProps {
    children: React.ReactNode;
    params: Promise<{
        slug: string;
    }>;
}

export const metadata: Metadata = {
    title: "Club Dashboard",
    description: "Dashboard for managing clubs and societies",
}

export default async function DashboardLayout({
    children,
    params,
}: DashboardLayoutProps) {
    const { slug } = await params;
    const club = await getClubBySubDomain(slug);
    if(!club) {
        return notFound();
    }
    const session = (await getSession()) as Session;
    if (
        !club.members.includes(session.user.id) && !club.president.email.includes(session.user.email)
        && session.user.role !== ROLES.ADMIN
    ) {
        return <ForbiddenPage />;
    }

    return (
        <SidebarProvider>
            <AppSidebar user={session.user} moderator="club" prefixPath={`clubs/${slug}`} />
            <SidebarInset className="flex flex-col flex-1 w-full relative z-0">
                <Navbar user={session.user} />
                <main className="content  p-4 px-2 md:p-6 z-2 @container space-y-10 min-h-screen h-full">
                    {children}
                </main>

                {process.env.NODE_ENV !== "production" && (
                    <div className="fixed bottom-0 right-auto left-auto mx-auto p-2 text-xs text-muted-foreground">
                        <span className="font-semibold">Environment:</span>{" "}
                        {process.env.NODE_ENV}
                    </div>
                )}
            </SidebarInset>
        </SidebarProvider>
    );
}
