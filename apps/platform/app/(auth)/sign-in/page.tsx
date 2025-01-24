import { AppLogo } from "@/components/logo";
import { Card } from "@/components/ui/card";
import { TabsTransitionPanel } from "@/components/ui/tabs-transition";
import { getSession } from "~/lib/auth-server";
import { changeCase } from "~/utils/string";
import ForgotPassword from "./forget-password";
import ResetPassword from "./reset-password";
import SignInForm from "./sign-in";
import SignUpForm from "./sign-up";
// import VerifyEmail from "./verify-mail";

const TABS = [
  ["sign-in", <SignInForm key="sign-in" />],
  ["sign-up", <SignUpForm key="sign-up" />],
  ["forget-password", <ForgotPassword key="forget-password" />],
  ["reset-password", <ResetPassword key="reset-password" />],
  // ["verify-email", <VerifyEmail key="verify-email" />]
] as [string, React.ReactNode][];

interface Props {
  searchParams: Promise<{
    tab: string;
  }>;
}

export default async function SignInPage({ searchParams }: Props) {
  const data = await getSession();
  // if (session) return redirect("/");

  const { tab } = await searchParams;

  return (
    <div className="min-h-screen w-full mx-auto lg:px-4 relative h-[100vh] flex-col items-center justify-center bg-background-gradient">
      <div className="lg:p-8 @container flex flex-col justify-center items-center m-auto">
        <Card
          variant="glass"
          className="m-auto flex flex-col justify-center space-y-6 max-w-[35rem] mx-auto w-full mt-32 @lg:mt-0"
        >
          <AppLogo className="mt-12" />
          <TabsTransitionPanel
            className="w-full mb-6"
            defaultActiveIndex={
              TABS.findIndex(([key, _]) => key === tab) > -1
                ? TABS.findIndex(([key, _]) => key === tab)
                : 0
            }
            items={TABS.filter(([key, _]) => {
              if (
                data?.session?.expiresAt &&
                new Date(data.session.expiresAt) < new Date() &&
                (key === "sign-up" || key === "sign-in")
              )
                return false;

              if (key === "reset-password" && tab !== "reset-password")
                return false;

              return true;
            }).map(([key, Component]) => {
              return {
                title: changeCase(key.replace("-", " "), "title"),
                id: key,
                content: Component,
              };
            })}
            classNames={{
              tabList:
                "flex justify-around gap-4 flex-wrap mx-4 @lg:mx-10 rounded-lg",
              tabTrigger: "capitalize w-full flex-1 rounded-lg",
              tabContentList: "px-4 @lg:px-10 border-0 pb-6",
            }}
          />
        </Card>
      </div>
    </div>
  );
}
