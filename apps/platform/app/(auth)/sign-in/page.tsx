// import SignUpForm from "./sign-up";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
    Card,
    CardContent,
    CardHeader
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Terminal } from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "src/lib/auth";
import ForgotPassword from "./forget-password";
import ResetPassword from "./reset-password";
import SignInForm from "./sign-in";

const TABS = ["sign-in", "sign-up","forget-password"];

interface Props {
    searchParams:Promise<{
        tab: string;
    }>
}

export default async function SignInPage({ searchParams }: Props) {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    if (session) return redirect("/");

    const { tab } = await searchParams;

    return (
        <div className="min-h-screen w-full mx-auto px-4 relative h-[100vh] flex-col items-center justify-center bg-background-gradient">
            <div className="lg:p-8 @container flex flex-col justify-center items-center m-auto">
                <Card
                    variant="glass"
                    className="m-auto flex flex-col justify-center space-y-6 max-w-[35rem]  mx-auto w-full mt-32 @lg:mt-0"
                >
                    <Tabs defaultValue={TABS.includes(tab) ? tab : TABS[0]} className="w-full">
                        <CardHeader>
                            <TabsList className="flex justify-around space-x-4">
                                {TABS.map((tab) => {
                                    return (
                                        <TabsTrigger key={tab} value={tab} className="capitalize w-full flex-1">
                                            {tab.replace("-", " ")}
                                        </TabsTrigger>
                                    );
                                })}
                            </TabsList>
                        </CardHeader>
                        <CardContent className="px-10">
                            <TabsContent value="sign-in">
                                <SignInForm />
                            </TabsContent>
                            <TabsContent value="sign-up">
                                <Alert>
                                    <Terminal className="h-4 w-4" />
                                    <AlertTitle>
                                        Not available yet
                                    </AlertTitle>
                                    <AlertDescription>
                                        Sign up is not available at the moment. Please try again later.
                                    </AlertDescription>
                                </Alert>

                                {/* <CardTitle>Sign Up</CardTitle>
                                <CardDescription>
                                    Create a new account for platform access.
                                </CardDescription>
                                <SignUpForm /> */}
                            </TabsContent>
                            <TabsContent value="forget-password">
                                <ForgotPassword />
                            </TabsContent>
                            <TabsContent value="reset-password">
                                <ResetPassword />
                            </TabsContent>
                            <TabsContent value="verify-email">
                                
                            </TabsContent>
                        </CardContent>
                    </Tabs>
                </Card>
            </div>
        </div>
    );
}

