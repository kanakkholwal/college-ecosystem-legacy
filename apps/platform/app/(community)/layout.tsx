import Footer from "@/components/common/footer";
import Navbar from "@/components/common/navbar";
import { getSession } from "~/lib/auth-server";

export const dynamic = "force-dynamic";

export default async function CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession()


  return (
    <div className="min-h-svh h-full w-full @container/community">
      <Navbar user={session?.user} />
      <main className="flex-1 @container flex-col items-center justify-start space-y-4 mx-auto pt-5 pb-16 min-h-[78vh] max-w-(--max-app-width)">
        {children}
      </main>
      <Footer />
    </div>
  );
}
