import { Card } from "@/components/ui/card";
import { getSession } from "~/lib/auth-server";
import { changeCase } from "~/utils/string";
import ForgotPassword from "./forget-password";
import ResetPassword from "./reset-password";
import SignInForm from "./sign-in";
import SignUpForm from "./sign-up";
// import VerifyEmail from "./verify-mail";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Metadata } from "next";

const TABS = [
  ["sign-in", <SignInForm key="sign-in" />],
  ["sign-up", <SignUpForm key="sign-up" />],
  ["forget-password", <ForgotPassword key="forget-password" />],
  ["reset-password", <ResetPassword key="reset-password" />],
  // ["verify-email", <VerifyEmail key="verify-email" />]
] as [string, React.ReactNode][];

const hidden_tabs = ["forget-password", "reset-password"];

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your account",
  keywords: [
    "Sign In",
    "Login",
    "Authentication",
    "User Account",
    "NITH Platform",
    "NITH Sign In",
    "NITH Login",
  ],
  alternates: {
    canonical: "/sign-in",
  },
};
interface Props {
  searchParams: Promise<{
    tab: string;
  }>;
}

export default async function SignInPage({ searchParams }: Props) {
  const data = await getSession();
  // if (session) return redirect("/");

  const { tab } = await searchParams;

  const tabs = TABS.filter(([key, _]) => {
    if (
      data?.session?.expiresAt &&
      new Date(data.session.expiresAt) < new Date() &&
      (key === "sign-up" || key === "sign-in")
    )
      return false;

    if (hidden_tabs.includes(key) && !hidden_tabs.includes(tab)) return false;

    return true;
  }).map(([key, Component]) => {
    return {
      title: changeCase(key.replace("-", " "), "title"),
      id: key,
      content: Component,
    };
  });
  const defaultTab = (
    tabs.findIndex((elem) => elem.id === tab) > -1
      ? tabs.findIndex((elem) => elem.id === tab)
      : tabs[0].id
  ) as string;

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <Tabs defaultValue={defaultTab} className="mb-6 pt-6">
          {!hidden_tabs.includes(tab) && (
            <TabsList className="flex justify-around gap-4 flex-wrap mx-4 h-auto">
              {tabs.map((tab) => {
                return (
                  <TabsTrigger
                    value={tab.id}
                    key={tab.id}
                    className="capitalize w-full flex-1 rounded-lg"
                  >
                    {tab.title}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          )}
          <div className="px-4 border-0 pb-6">
            {tabs.map((tab) => {
              return (
                <TabsContent value={tab.id} key={tab.id}>
                  {tab.content}
                </TabsContent>
              );
            })}
          </div>
        </Tabs>
      </Card>
    </div>
  );
}
