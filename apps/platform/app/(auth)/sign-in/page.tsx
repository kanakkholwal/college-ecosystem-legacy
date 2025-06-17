import { getSession } from "~/lib/auth-server";
import { changeCase } from "~/utils/string";
import ForgotPassword from "./forget-password";
import ResetPassword from "./reset-password";
import SignInForm from "./sign-in";
import SignUpForm from "./sign-up";
// import VerifyEmail from "./verify-mail";
import { MagicCard } from "@/components/animation/magic-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Metadata } from "next";

const TABS = [
  ["sign-in", <SignInForm key="sign-in" />],
  ["sign-up", <SignUpForm key="sign-up" />],
  ["forget-password", <ForgotPassword key="forget-password" />],
  ["reset-password", <ResetPassword key="reset-password" />],
  // ["verify-email", <VerifyEmail key="verify-email" />]
] as [string, React.ReactNode][];

const HIDDEN_TABS = ["forget-password", "reset-password"];

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
    tab?: string;
  }>;
}

export default async function SignInPage({ searchParams }: Props) {
  const data = await getSession();
  // if (session) return redirect("/");

  const { tab } = await searchParams;

  const tabs = TABS.filter(([key]) => {
    // Filter out sign-up/sign-in if session is expired
    if (
      data?.session?.expiresAt &&
      new Date(data.session.expiresAt) < new Date() &&
      (key === "sign-up" || key === "sign-in")
    ) {
      return false;
    }

    // Show hidden tabs only if they match the current tab param
    if (HIDDEN_TABS.includes(key)) {
      return tab === key;
    }

    return true;
  }).map(([key, Component]) => ({
    title: changeCase(key.replace("-", " "), "title"),
    id: key,
    content: Component,
  }));

  // Determine default tab
  const defaultTab = tab && tabs.some(t => t.id === tab) 
    ? tab 
    : tabs[0].id;

  // Check if we should show the tabs list (not showing for hidden tabs)
  const showTabsList = !tab || !HIDDEN_TABS.includes(tab);

  return (
    <div className="flex flex-col gap-6">
      <MagicCard className="rounded-lg shadow" layerClassName="bg-card">
        <Tabs defaultValue={defaultTab} className="mb-6 pt-6">
          {showTabsList && (

            <TabsList className="flex justify-around gap-4 flex-wrap mx-4 h-auto">
              {tabs.map((tab) => (
                <TabsTrigger
                  value={tab.id}
                  key={tab.id}
                  className="capitalize w-full flex-1 rounded-lg"
                >
                  {tab.title}
                </TabsTrigger>
              ))}
            </TabsList>
          )}
          <div className="px-4 border-0 pb-6">
            {tabs.map((tab) => (
              <TabsContent value={tab.id} key={tab.id}>
                {tab.content}
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </MagicCard>
    </div>
  );
}