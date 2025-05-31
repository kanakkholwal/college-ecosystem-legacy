import Footer from "@/components/common/footer";
import Navbar from "@/components/common/navbar";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "~/lib/auth-server";

export const metadata: Metadata = {
  title: "NITH - College Platform",
  description: "NITH - College Platform",
};

export const dynamic = "force-dynamic";

type LayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default async function Layout({ children }: LayoutProps) {
  const session = await getSession();
  const authorized = !!session?.user;

  if (!authorized) {
    return redirect("/sign-in");
  }

  return (
    <div className="flex flex-1 flex-col justify-center min-h-svh bg-background dark:bg-background">
      <Navbar user={session.user} />
      <div className="flex-1 mx-auto max-w-[90rem] w-full h-full min-h-screen @container flex-col items-center justify-start space-y-4 my-10">
        {children}
      </div>
      <Footer />
    </div>
  );
}
