import ChatArea, { HistoryArea } from "./client";

export default function ChatbotPage() {
    return (
        <div className="flex flex-col items-center justify-center h-full mt-10 px-2 pr-3">
            <h1 className="text-2xl font-bold mb-4">Chat with our AI Assistant</h1>
            <p className="text-muted-foreground text-center mb-8">
                Ask questions about our platform, resources, or anything else you need help with.
            </p>

            <div className="w-full p-3 bg-card rounded-lg shadow-md border">
                <HistoryArea />
                <ChatArea />
            </div>
        </div>
    );
}