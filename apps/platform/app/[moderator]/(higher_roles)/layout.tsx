import Page403 from "@/components/utils/403";
// import { getSession } from "src/lib/auth-server";
import { ROLES } from "~/constants";

const NOT_ALLOWED_ROLES = [ROLES.STUDENT, ROLES.GUARD];

interface DashboardLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    moderator: string;
  }>;
}

export default async function DashboardLayout({
  children,
  params,
}: DashboardLayoutProps) {
  // const session = await getSession();
  const { moderator } = await params;

  if (
    NOT_ALLOWED_ROLES.includes(moderator as (typeof NOT_ALLOWED_ROLES)[number])
  ) {
    return <Page403 />;
  }

  return children;
}
