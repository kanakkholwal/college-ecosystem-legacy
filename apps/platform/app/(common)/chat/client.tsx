
'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import ConditionalRender from '@/components/utils/conditional-render';
import { cn } from '@/lib/utils';
import { useChat } from '@ai-sdk/react';
import { ArrowRight, Plus, Share } from 'lucide-react';
import { nanoid } from 'nanoid';
import { parseAsString, useQueryState } from 'nuqs';
import Markdown from 'react-markdown';

const chat = {
    title: "Chat with AI Assistant",
    date: new Date().toISOString(),
    slug: "chat-with-ai",
    type: "chat",
}
export default function ChatArea() {
    const [chat_id, setChatId] = useQueryState('chat_id', {
        defaultValue: chat.slug,
    });
    const { messages, input, handleInputChange, handleSubmit } = useChat();

    return (
        <main className="w-full min-h-full relative flex flex-col justify-between items-start gap-2">
            <div className="text-base text-muted-foreground font-medium w-full border-b pb-2 flex items-center justify-between">
                {chat.title || 'Chat with AI Assistant'}

                <Button
                    variant="outline"
                    size="sm"
                    rounded="full"
                    title="Share this chat"
                    className='ml-auto'
                    >
                        <Share/>
                    Share Chat
                    </Button>
            </div>
            <div className="flex-1 overflow-y-auto w-full max-h-[60vh] space-y-2 p-2 ">

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
                <div key={m.id} className="whitespace-pre-wrap w-full flex items-start gap-2 p-2 rounded-md bg-muted text-muted-foreground">
                    <span className={cn(
                        "font-semibold text-sm",
                        m.role === 'user' ? 'ml-auto mr-2' : 'ml-2 mr-auto',
                    )}>
                    {m.role === 'user' ? 'User: ' : 'AI: '}
                    </span>
                    <div className="text-sm text-foreground whitespace-pre-wrap break-words prose prose-sm max-w-full prose-green dark:prose-invert">
                    {m.content}
                    </div>
                </div>
            ))}
            </div>

            <form
                // onSubmit={handleSubmit}
                className="sticky top-auto bottom-0 w-full  mx-auto flex items-start justify-between gap-2 p-2 bg-card rounded-md border"
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
                    onClick={() =>{
                        if (messages.length === 0) {
                            setChatId(nanoid());
                            // If no messages, start a new chat
                            handleSubmit();
                        }
                    }}
                    title="Send message"
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
    const [selectedChat, setSelectedChat] = useQueryState('chat_id', parseAsString);
    return (
        <aside className="flex flex-col items-center justify-start min-h-full max-w-xs border-r pr-4 w-full">
            <div className="flex items-center justify-between w-full gap-2 mb-4">
                <h6 className="text-base font-medium whitespace-nowrap">Chat History</h6>
                <Button
                    onClick={() => setSelectedChat('new-chat')}
                    variant="outline"
                    size="xs"
                    rounded="full"
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