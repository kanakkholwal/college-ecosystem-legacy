import Footer from "@/components/common/footer";
import Navbar from "@/components/common/navbar";
import { BannerPanel } from "@/components/utils/banner";
import ConditionalRender from "@/components/utils/conditional-render";
import { RocketIcon } from "lucide-react";
import type { Session } from "~/lib/auth";
import { getSession } from "~/lib/auth-server";
import { appConfig } from "~/project.config";

export const dynamic = "force-dynamic";

type LayoutProps = Readonly<{
  children: React.ReactNode;
}>;
const PROMO = {
  title: "Complete Your Profile",
  description:
    "Please complete your profile. It'll take a moment to fill in your details to enhance your experience.",
  label: "Update Now!",
  showTill: "2022-01-19T19:00:00",
  getRedirectUrl: (role: string) =>
    appConfig.url + "/" + role + "/settings/account",
  getConditionByUser: (user: Session["user"]) =>
    // user?.other_roles.includes(ROLES.STUDENT) &&
    user?.gender === "not_specified",
  // && new Date() < new Date(PROMO.showTill),
};
export default async function Layout({ children }: LayoutProps) {
  const session = await getSession();

  return (
    <div className="flex flex-1 flex-col justify-center min-h-svh bg-background dark:bg-background">
      <Navbar user={session?.user} />
      <ConditionalRender condition={PROMO.getConditionByUser(session?.user!)}>
        <BannerPanel
          icon={<RocketIcon className="size-4 text-muted-foreground" />}
          title={PROMO.title}
          description={PROMO.description}
          redirectUrl={session?.user && PROMO.getRedirectUrl(session?.user?.other_roles[0])}
          btnProps={{
            children: PROMO.label,
            variant: "default_light",
          }}
        />
      </ConditionalRender>
      <div className="relative flex-1 mx-auto max-w-(--max-app-width) w-full h-full min-h-screen @container flex-col items-center justify-start space-y-4 pb-8">
        {/* <div
        aria-hidden="true"
        className="absolute inset-0 grid grid-cols-2 -space-x-52 opacity-40 dark:opacity-20 "
      >
        <div className="blur-[106px] h-56 bg-gradient-to-br from-primary to-secondary" />
        <div className="blur-[106px] h-32 bg-gradient-to-r from-secondary to-primary" />
      </div> */}
        {children}
      </div>
      <Footer />
    </div>
  );
}
