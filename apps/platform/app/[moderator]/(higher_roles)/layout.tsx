import Page403 from "@/components/utils/403";
import { ROLES_ENUMS } from "~/constants";

const NOT_ALLOWED_ROLES = [ROLES_ENUMS.STUDENT, ROLES_ENUMS.GUARD];

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
