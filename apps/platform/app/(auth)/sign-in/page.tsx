// import SignUpForm from "./sign-up";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Terminal } from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import SignInForm from "./sign-in";

import { auth } from "src/lib/auth";


export default async function SignInPage() {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    if (session) return redirect("/");


    return (
        <div className="min-h-screen w-full mx-auto px-4 relative h-[100vh] flex-col items-center justify-center bg-background-gradient">
            <div className="lg:p-8 @container flex flex-col justify-center items-center">
                <Card
                    variant="glass"
                    className="m-auto flex flex-col justify-center space-y-6 max-w-[35rem]  mx-auto w-full mt-32 @lg:mt-0"
                >
                    <Tabs defaultValue="sign-in" className="w-full">
                        <CardHeader>
                            <TabsList>
                                <TabsTrigger value="sign-in">Sign In</TabsTrigger>
                                <TabsTrigger value="sign-up">Sign Up</TabsTrigger>
                            </TabsList>
                        </CardHeader>
                        <CardContent className="px-10">
                            <TabsContent value="sign-in">
                                <CardTitle>Sign In</CardTitle>
                                <CardDescription className="mt-2 mb-5">
                                    Log in for a seamless experience.
                                </CardDescription>
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
                        </CardContent>
                    </Tabs>
                </Card>
            </div>
        </div>
    );
}
