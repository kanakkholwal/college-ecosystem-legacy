import { CelebrationDialog } from "@/components/animation/confetti";
import Footer from "@/components/common/footer";
import GithubBanner from "@/components/common/github-banner";
import Navbar from "@/components/common/navbar";
import { Icon } from "@/components/icons";
import { BannerPanel } from "@/components/utils/banner";
import ConditionalRender from "@/components/utils/conditional-render";
import { RocketIcon } from "lucide-react";
import type { Session } from "~/auth";
import { getSession } from "~/auth/server";
// import { ROLES_ENUMS } from "~/constants";
// import { appConfig } from "~/project.config";

export const dynamic = "force-dynamic";

type LayoutProps = Readonly<{
  children: React.ReactNode;
}>;
const PROMO = {
  title: "Share your Personal Guide, Experiences",
  description:
    "Personal career experiences, articles, and case studies. You can also promote your articles on the site if they are valuable reads",
  label: <>
  Share Now
  <Icon name="arrow-up-right" />
  </>,
  showTill: "2025-12-31T19:00:00",
  getRedirectUrl: () =>
    "https://forms.gle/NWAfkZngLozRjRJZ6",
  getConditionByUser: (user: Session["user"]) =>
    // user?.other_roles.includes(ROLES_ENUMS.STUDENT) &&
    // user?.gender === "not_specified",
    new Date() < new Date(PROMO.showTill),
};
export default async function Layout({ children }: LayoutProps) {
  const session = await getSession();

  return (
    <div className="flex flex-1 flex-col justify-center min-h-svh w-full z-0">
      <Navbar user={session?.user} />
      <ConditionalRender condition={PROMO.getConditionByUser(session?.user!)}>
        <BannerPanel
          icon={<RocketIcon className="size-4 text-primary" />}
          title={PROMO.title}
          description={PROMO.description}
          redirectUrl={PROMO.getRedirectUrl()}
          btnProps={{
            children: PROMO.label,
            variant: "default",
            shadow:"default",
            transition:"damped",
            effect:"none",
          }}
        />
      </ConditionalRender>
      <CelebrationDialog />
      <div className="relative flex-1 mx-auto max-w-(--max-app-width) w-full h-full min-h-screen @container flex-col items-center justify-start space-y-4 pb-8">
        {/* <div
        aria-hidden="true"
        className="absolute inset-0 grid grid-cols-2 -space-x-52 opacity-40 dark:opacity-20 "
      >
        <div className="blur-[106px] h-56 bg-gradient-to-br from-primary to-secondary" />
        <div className="blur-[106px] h-32 bg-gradient-to-r from-secondary to-primary" />
      </div> */}
        {children}
        <GithubBanner />
      </div>
       <div className="absolute inset-0 -z-10">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-[28rem] h-[28rem] bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-700" />
      </div>
      <Footer />
    </div>
  );
}
