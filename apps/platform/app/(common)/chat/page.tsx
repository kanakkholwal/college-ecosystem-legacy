import { orgConfig } from "~/project.config";
import ChatArea, { HistoryArea } from "./client";

const chat_list = [
    {
        title: "Chat with AI Assistant",
        description: "Interact with our AI assistant to get answers to your questions.",
        slug: "chat",
        date: new Date().toISOString(),
        type: "chat",
    },
    {
        title: "Chat History",
        description: "View your chat history with the AI assistant.",
        slug: "chat-history",
        date: new Date().toISOString(),
        type: "history",

    },
    
];

interface ChatbotPageProps {
    searchParams?: Promise<{
        chat_id?: string;
    }>;
}
export default async function ChatbotPage({ searchParams }: ChatbotPageProps) {
    const params = await searchParams;
    const chatId = params?.chat_id || "new-chat";

    return (
        <div className="flex flex-col items-center justify-center h-full mt-10 px-2 pr-3">
            <h1 className="text-2xl font-bold mb-4">
                Chat with our AI Assistant
                - (Alpha)
            </h1>
            <p className="text-muted-foreground text-center mb-8">
                - {chatId === "new-chat" ? "Start a new chat" : "Continue chat"} about any topic you like 
                related to our platform and {orgConfig.shortName}
            </p>

            <div className="w-full p-3 bg-card rounded-lg shadow-md border flex items-stretch gap-4">
                <HistoryArea chat_list={chat_list} />
                <ChatArea />
            </div>
        </div>
    );
}