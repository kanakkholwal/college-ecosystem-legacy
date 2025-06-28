
'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import ConditionalRender from '@/components/utils/conditional-render';
import { cn } from '@/lib/utils';
import { useChat } from '@ai-sdk/react';
import { ArrowRight, Plus } from 'lucide-react';
import { useQueryState } from 'nuqs';

const chat = {
    title: "Chat with AI Assistant",
    date: new Date().toISOString(),
    slug: "chat-with-ai",
    type: "chat",
}
export default function ChatArea() {
    const { messages, input, handleInputChange, handleSubmit } = useChat();

    return (
        <main className=" w-full h-full relative">
            <div className="text-base font-medium">
                {chat.title || 'Chat with AI Assistant'}

            </div>
            <ConditionalRender condition={messages.length === 0}>
                <div className="flex items-center flex-col justify-center space-y-4 py-4 my-8 m-auto border bg-background p-2 rounded-md w-full max-w-sm mx-auto">

                    <h3 className="text-lg font-semibold text-foreground">
                        {chat.title || 'Chat with AI Assistant'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        All messages are private and not shared with anyone.
                    </p>

                    <Button
                        variant="default_light"
                        rounded="full"
                        size="sm"
                        title="Start new chat"
                        asChild
                    >
                        <Label htmlFor='chat_input'>

                            <Plus />
                            Start New Chat
                        </Label>
                    </Button>
                </div>
            </ConditionalRender>
            {messages.map(m => (
                <div key={m.id} className="whitespace-pre-wrap">
                    {m.role === 'user' ? 'User: ' : 'AI: '}
                    {m.content}
                </div>
            ))}

            <form
                onSubmit={handleSubmit}
                className="sticky top-auto bottom-0 w-full mb-5 mx-auto flex items-start justify-between gap-2 p-2 bg-card rounded-md border"
            >
                <Textarea
                    className="w-full h-auto resize-none"
                    id="chat_input"
                    name='chat_input'
                    value={input}
                    placeholder="Say something..."
                    onChange={handleInputChange}
                />
                <Button
                    type="submit"
                    variant="default"
                    size="icon"
                    className="h-10 w-10 p-2"
                    disabled={!input.trim()}
                >
                    <ArrowRight className="size-4" />
                </Button>
            </form>
        </main>
    );
}
interface HistoryAreaProps {
    chat_list: Array<{
        title: string;
        slug: string;
        type: string;
        date: string;
    }>
}
export function HistoryArea({ chat_list }: HistoryAreaProps) {
    const [selectedChat, setSelectedChat] = useQueryState('chat_id', {

    });
    return (
        <aside className="flex flex-col items-center justify-center h-full max-w-xs border-r pr-4 w-full">
            <div className="flex items-center justify-between w-full gap-2 mb-4">
                <h6 className="text-base font-medium whitespace-nowrap">Chat History</h6>
                <Button
                    onClick={() => setSelectedChat('new-chat')}
                    variant="outline"
                    size="xs"
                    title="Start new chat"
                >
                    <Plus />
                    Start New Chat
                </Button>
            </div>
            {/* Chat history content goes here */}
            <div className="space-y-2 w-full">
                {chat_list.map(chat => (
                    <div key={chat.slug}
                        role='button'
                        aria-labelledby='chat.title'
                        onClick={() => {
                            // Handle chat selection
                            setSelectedChat(chat.slug);
                        }}
                        className={
                            cn(
                                "w-full border-b py-2 pr-5 relative cursor-pointer hover:bg-muted p-2 rounded-md transition-all group",
                                selectedChat === chat.slug ? "bg-muted" : ""
                            )
                        }
                    >
                        <h6 className="font-semibold text-sm text-card-foreground/80 group-hover:text-card-foreground">{chat.title}</h6>
                        <p className="text-xs text-muted-foreground">
                            {new Date(chat.date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                            })}
                        </p>
                        <ArrowRight className="size-4 text-muted-foreground absolute left-auto right-2 top-1/2 -translate-y-1/2" />
                    </div>
                ))}
            </div>
        </aside>
    );
}