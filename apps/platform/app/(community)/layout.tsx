import Footer from "@/components/common/footer";
import Navbar from "@/components/common/navbar";
import { redirect } from "next/navigation";
import { getSession } from "~/lib/auth-server";

export default async function CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session?.user) {
    return redirect("/sign-in");
  }
  const isStudent = session?.user?.other_roles?.includes("student");

  if (!isStudent) return redirect(`/${session.user.other_roles[0]}`);

  return (
    <div className="min-h-svh h-full w-full @container/community">
      <Navbar user={session.user} />
      <main className="flex-1 @container flex-col items-center justify-start space-y-4 mx-auto pt-10 pb-16">
        {children}
      </main>
      <Footer />
    </div>
  );
}
