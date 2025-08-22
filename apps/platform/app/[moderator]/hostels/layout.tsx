import Page403 from "@/components/utils/403";
import { notFound } from "next/navigation";
import { getSession } from "~/auth/server";
import { ALLOWED_ROLES, ROLES_ENUMS } from "~/constants";

const ONLY_ALLOWED_ROLES = [ROLES_ENUMS.CHIEF_WARDEN, ROLES_ENUMS.ADMIN];

interface DashboardLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    moderator: (typeof ALLOWED_ROLES)[number];
  }>;
}

export default async function DashboardLayout({
  children,
  params,
}: DashboardLayoutProps) {
  const session = await getSession();
  const { moderator } = await params;
  if (
    !ALLOWED_ROLES.includes(moderator as (typeof ALLOWED_ROLES)[number]) ||
    !ONLY_ALLOWED_ROLES.includes(moderator as (typeof ONLY_ALLOWED_ROLES)[number])
  ) {
    return notFound();
  }

  if (
    !(
      (session?.user.other_roles.some((role) =>
        ALLOWED_ROLES.includes(role as (typeof ALLOWED_ROLES)[number])
      ) &&
        ALLOWED_ROLES.includes(moderator)) ||
      session?.user?.role === ROLES_ENUMS.ADMIN
    )
  ) {
    return <Page403 />;
  }

  return children;
}
