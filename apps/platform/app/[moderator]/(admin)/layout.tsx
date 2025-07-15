import Page403 from "@/components/utils/403";
import { getSession } from "~/auth/server";

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
  const session = await getSession();
  const { moderator } = await params;

  if (
    session &&
    moderator === "admin" &&
    session.user.role !== "admin" &&
    session.user.role !== "moderator"
  ) {
    console.log("403 from layout: admin");
    return <Page403 />;
  }

  return children;
}
