import Footer from "@/components/common/footer";
import Navbar from "@/components/common/navbar";
import { BannerPanel } from "@/components/utils/banner";
import ConditionalRender from "@/components/utils/conditional-render";
import { RocketIcon } from "lucide-react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import type { Session } from "~/lib/auth";
import { getSession } from "~/lib/auth-server";

export const metadata: Metadata = {
  title: "NITH - College Platform",
  description: "NITH - College Platform",
};

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
  getConditionByUser: (user: Session["user"]) =>
    // user?.other_roles.includes(ROLES.STUDENT) &&
    user?.gender === "not_specified"
  // && new Date() < new Date(PROMO.showTill),
};
export default async function Layout({ children }: LayoutProps) {
  const session = await getSession();

  if (!session?.user) {
    return redirect("/sign-in");
  }

  return (
    <div className="flex flex-1 flex-col justify-center min-h-svh bg-background dark:bg-background">
      <Navbar user={session.user} />
      <ConditionalRender condition={true || PROMO.getConditionByUser(session?.user!)}>
        <BannerPanel
          icon={<RocketIcon className="size-4 text-muted-foreground" />}
          title={PROMO.title}
          description={PROMO.description}
          btnProps={{
            children: PROMO.label,
            variant: "default_light",
          }}
        />
      </ConditionalRender>
      <div className="flex-1 mx-auto max-w-(--max-app-width) w-full h-full min-h-screen @container flex-col items-center justify-start space-y-4 pb-8">
        {children}
      </div>
      <Footer />
    </div>
  );
}
