import Page403 from "@/components/utils/403";
import type { Metadata } from "next";
import { getSession } from "src/lib/auth-server";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Admin Dashboard ",
};


interface DashboardLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    moderator: "admin" | "moderator";
  }>;
}

export default async function DashboardLayout({
  children,
  params,
}: DashboardLayoutProps) {
  const session = await getSession()
  const { moderator } = await params;

  if (session && 
    session.user.role === "admin" 
  ) {
    return <Page403 />;
  }

  return <>{children}</>;
}
