
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "src/lib/auth";

export const metadata: Metadata = {
    title: "CR Dashboard",
    description: "NITH Portal Dashboard",

}


export default async function Layout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await getSession();
    console.log(session);

    if (!session) {
        return redirect('/login')

    }

    if (!session.user.roles.includes('cr') && !session.user.roles.includes('faculty') && !session.user.roles.includes('admin')) {
        return redirect('/dashboard')
    }
    return <>
        {children}
    </>

}