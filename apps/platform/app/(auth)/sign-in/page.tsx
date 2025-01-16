import { AppLogo } from "@/components/logo";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {TabsTransitionPanel} from "@/components/ui/tabs-transition";
import { getSession } from "~/lib/auth-server";
import ForgotPassword from "./forget-password";
import ResetPassword from "./reset-password";
import SignInForm from "./sign-in";
import SignUpForm from "./sign-up";
import { changeCase } from "~/utils/string";
// import VerifyEmail from "./verify-email";

const TABS = [
  ["sign-in",<SignInForm key="sign-in"/>],
  ["sign-up",<SignUpForm  key="sign-up"/>],
  ["forget-password",<ForgotPassword  key="forget-password"/>],
  ["reset-password",<ResetPassword key="reset-password" />],
  // ["verify-email",VerifyEmail]
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
            className="w-full"
            items={
              TABS.filter(([key, _]) => {
                if (
                  data?.session?.expiresAt &&
                  new Date(data.session.expiresAt) < new Date() &&
                  (key === "sign-up" || key === "sign-in")
                )
                  return false;
                return true;
              }).map(([key, Component]) => {
                return {
                  title: changeCase(key.replace("-", " "),"title"),
                  id: key,
                  content: Component,
                }
              })
            }
            classNames={{
              tabList: "flex justify-around space-x-4 flex-wrap",
              tabTrigger: "capitalize w-full flex-1",
              tabContentList: "px-4 @lg:px-10"
            }}
          />
          
        </Card>
      </div>
    </div>
  );
}
