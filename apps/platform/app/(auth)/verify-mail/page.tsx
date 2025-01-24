import { AppLogo } from "@/components/logo";
import { Card } from "@/components/ui/card";
import { getSession } from "~/lib/auth-server";
import VerifyEmail from "../sign-in/verify-mail";



export default async function VerifyEmailPage() {
    const data = await getSession();
    // if (session) return redirect("/");

    return (
        <div className="min-h-screen w-full mx-auto lg:px-4 relative h-[100vh] flex-col items-center justify-center bg-background-gradient">
            <div className="lg:p-8 @container flex flex-col justify-center items-center m-auto">
                <Card
                    variant="glass"
                    className="m-auto flex flex-col justify-center space-y-6 max-w-[35rem] mx-auto w-full mt-32 @lg:mt-0"
                >
                    <AppLogo className="mt-12" />
                    <div className="px-4 @lg:px-10 border-0 pb-6">
                        <VerifyEmail />
                    </div>
                </Card>
            </div>
        </div>
    );
}
