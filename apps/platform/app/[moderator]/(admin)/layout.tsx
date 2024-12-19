import Page403 from "@/components/utils/403";
import type { Metadata } from "next";
import { getSession } from "src/lib/auth";
import type { sessionType } from "src/types/session";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Admin Dashboard ",
};

const ALLOWED_ROLES = ["admin", "moderator"];

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
  const session = (await getSession()) as sessionType;
  const { moderator } = await params;

  if (
    !ALLOWED_ROLES.some((role) => session.user.roles.includes(role)) &&
    !session.user.roles.includes(moderator)
  ) {
    return <Page403 />;
  }

  return <>{children}</>;
}
