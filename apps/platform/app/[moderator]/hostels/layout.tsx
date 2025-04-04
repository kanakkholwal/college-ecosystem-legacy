import Page403 from "@/components/utils/403";
import { getSession } from "src/lib/auth-server";
import { ROLES } from "~/constants";
// import { CHIEF_WARDEN_MAIL } from "~/constants/hostel_n_outpass";

const ALLOWED_ROLES = [
  ROLES.CHIEF_WARDEN,
  ROLES.ADMIN,
  ROLES.MMCA,
  ROLES.WARDEN,
  ROLES.ASSISTANT_WARDEN,
];

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
    !session?.user.other_roles.some((role) =>
      ALLOWED_ROLES.includes(role as (typeof ALLOWED_ROLES)[number])
    )
    // &&
    //     (session?.user.other_emails?.some((mail) =>
    //         mail === CHIEF_WARDEN_MAIL
    //     ) ||
    //         ALLOWED_ROLES.includes(moderator)) ||
    //     session?.user?.role === ROLES.ADMIN
    // )
  ) {
    return <Page403 />;
  }

  return children;
}
