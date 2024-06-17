import Navbar from "@/components/common/navbar";
import { redirect } from "next/navigation";
import { getSession } from "src/lib/auth";
import { sessionType } from "src/types/session";
import Sidebar from "./common/sidebar";

export default async function CommunityLayout({ children }: { children: React.ReactNode }) {

    const session = await getSession() as sessionType | null;
    if(!session?.user){
        return redirect('/login')
    }
    const isStudent = session?.user?.roles?.includes('student');

    if (!isStudent)
        return redirect(`/${session.user.roles[0]}`)

    return <div className="flex min-h-screen h-full w-full flex-col items-center justify-start @container/layout-0 max-w-[1680px] mx-auto px-3">
        <Navbar user={session.user!}/>
        <div className="flex w-full mt-8 gap-4">
            <Sidebar />
            <main className="flex-1 @container flex-col items-center justify-start space-y-4">
                {children}
            </main>
        </div>
    </div>

}