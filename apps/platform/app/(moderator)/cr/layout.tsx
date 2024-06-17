import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getSession } from "src/lib/auth";
import { sessionType } from "src/types/session";

export const metadata: Metadata = {
    title: "CR Dashboard",
    description: "NITH - College Platform",
};

export const dynamic = 'force-dynamic';


type LayoutProps = Readonly<{
    children: React.ReactNode;
}>

export default async function Layout({ children }: LayoutProps) {
    const session = await getSession() as sessionType;
    const isCr = session.user.roles.includes('cr');

    if (!isCr)
        return redirect(`/${session.user.roles[0]}`)

    return children
}

