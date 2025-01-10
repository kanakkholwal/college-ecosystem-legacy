import { AppLogo } from "@/components/logo";
// import SignUpForm from "./sign-up";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { headers } from "next/headers";
import { auth } from "src/lib/auth";
import ForgotPassword from "./forget-password";
import ResetPassword from "./reset-password";
import SignInForm from "./sign-in";
import SignUpForm from "./sign-up";


const TABS = ["sign-in", "sign-up", "forget-password","reset-password", "verify-email"];

interface Props {
  searchParams: Promise<{
    tab: string;
  }>;
}

export default async function SignInPage({ searchParams }: Props) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  // if (session) return redirect("/");

  const { tab } = await searchParams;

  return (
    <div className="min-h-screen w-full mx-auto lg:px-4 relative h-[100vh] flex-col items-center justify-center bg-background-gradient">
      <div className="lg:p-8 @container flex flex-col justify-center items-center m-auto">
        <Card
          variant="glass"
          className="m-auto flex flex-col justify-center space-y-6 max-w-[35rem] mx-auto w-full mt-32 @lg:mt-0"
        >
          <AppLogo className="mt-12"/>
          <Tabs
            defaultValue={TABS.includes(tab) ? tab : TABS[0]}
            className="w-full"
          >
            <CardHeader>
              <TabsList className="flex justify-around space-x-4 flex-wrap">
                {TABS.map((tab) => {
                  if(session && tab === "sign-up") return null;
                  if(!session && tab === "sign-in") return null;


                  return (
                    <TabsTrigger
                      key={tab}
                      value={tab}
                      className={cn("capitalize w-full flex-1",
                        ["reset-password", "verify-email"].includes(tab) ? "hidden" : ""
                      )}
                    >
                      {tab.replace("-", " ")}
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </CardHeader>
            <CardContent className="px-4 @lg:px-10">
              <TabsContent value="sign-in">
                <SignInForm />
              </TabsContent>
              <TabsContent value="sign-up">
                <SignUpForm />
              </TabsContent>
              <TabsContent value="forget-password">
                <ForgotPassword />
              </TabsContent>
              <TabsContent value="reset-password">
                <ResetPassword />
              </TabsContent>
              {/* biome-ignore lint/style/useSelfClosingElements: <explanation> */}
              <TabsContent value="verify-email"></TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
