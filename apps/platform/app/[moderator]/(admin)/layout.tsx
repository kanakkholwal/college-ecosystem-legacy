import Page403 from "@/components/utils/403";
import { notFound } from "next/navigation";
import { getSession } from "~/auth/server";
import { ALLOWED_ROLES } from "~/constants";

interface DashboardLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    moderator: typeof ALLOWED_ROLES[number];
  }>;
}

export default async function DashboardLayout({
  children,
  params,
}: DashboardLayoutProps) {
  const { moderator } = await params;
  if (moderator === "admin") {
    return notFound();
  }
  const session = await getSession();
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
