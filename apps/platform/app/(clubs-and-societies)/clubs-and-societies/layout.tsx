import Footer from "@/components/common/footer";
import Navbar from "@/components/common/navbar";
import { getSession } from "~/lib/auth-server";


type LayoutProps = Readonly<{
    children: React.ReactNode;
}>;

export const dynamic = "force-dynamic";

export default async function Layout({ children }: LayoutProps) {
    const session = await getSession();

    return (
        <div className="flex flex-1 flex-col justify-center min-h-svh w-full z-0">
            <Navbar user={session?.user} />
            <div className="relative flex-1 mx-auto max-w-(--max-app-width) w-full h-full min-h-screen @container flex-col items-center justify-start space-y-4 pb-8">
                {children}
            </div>
            <Footer />
        </div>
    );
}
