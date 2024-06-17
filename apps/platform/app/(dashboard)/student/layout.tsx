import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getSession } from "src/lib/auth";
import { sessionType } from "src/types/session";

export const metadata: Metadata = {
    title: "Student Feed",
    description: "NITH - College Platform",
};

export const dynamic = 'force-dynamic';


type LayoutProps = Readonly<{
    children: React.ReactNode;
}>

export default async function Layout({ children }: LayoutProps) {
    const session = await getSession() as sessionType;
    const isStudent = session.user.roles.includes('student');

    if (!isStudent)
        return redirect(`/${session.user.roles[0]}`)

    return children
}

