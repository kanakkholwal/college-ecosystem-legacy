import Footer from "@/components/common/footer";
import Navbar from "@/components/common/navbar";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "src/lib/auth";

export const metadata: Metadata = {
  title: "NITH - College Platform",
  description: "NITH - College Platform",
};

export const dynamic = "force-dynamic";

type LayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default async function Layout({ children }: LayoutProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const authorized = !!session?.user;

  if (!authorized) {
    return redirect("/sign-in");
  }

  return (
    <div className="flex min-h-screen h-full w-full flex-col items-center justify-start @container/layout-0 max-w-7xl min-w-screen mx-auto px-3 lg:py-10">
      <Navbar user={session.user} />
      <div className="flex-1 w-full h-full min-h-screen @container flex-col items-center justify-start space-y-4 my-10">
        {children}
      </div>
      <Footer />
    </div>
  );
}
