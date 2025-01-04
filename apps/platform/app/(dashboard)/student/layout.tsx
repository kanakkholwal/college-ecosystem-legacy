import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getSession } from "~/lib/auth-server";


export const metadata: Metadata = {
  title: `Student Dashboard | ${process.env.NEXT_PUBLIC_WEBSITE_NAME}`,
  description: "Student Dashboard to view your profile and other details",
};

export const dynamic = "force-dynamic";

type LayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default async function Layout({ children }: LayoutProps) {
  const session = await getSession();
  const isStudent = session?.user.other_roles.includes("student");

  if (!isStudent) return redirect(`/${session?.user?.other_roles[0]}/`);

  return children;
}
