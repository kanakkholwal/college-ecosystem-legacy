import { redirect } from "next/navigation";
import { getSession } from "src/lib/auth";
import { sessionType } from "src/types/session";

export default async function ChatBotPage() {

    const session = await getSession() as sessionType | null;
    if(!session?.user){
        return redirect('/login')
    }


    return <div className="flex min-h-screen h-full w-full flex-col items-center justify-start @container/page max-w-[1680px] mx-auto px-3">
        <div className="flex w-full mt-8 gap-4">
            <main className="flex-1 @container flex-col items-center justify-start space-y-4">
                <h1>Chat Bot</h1>
                <p>Chat Bot content goes here</p>
            </main>
        </div>
    </div>

}