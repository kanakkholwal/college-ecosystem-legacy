
'use client';

import { useChat } from '@ai-sdk/react';

export default function ChatArea() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  return (
    <main className="flex flex-col w-full h-full max-w-md pt-24 mx-auto stretch relative">
      {messages.map(m => (
        <div key={m.id} className="whitespace-pre-wrap">
          {m.role === 'user' ? 'User: ' : 'AI: '}
          {m.content}
        </div>
      ))}

      <form
        onSubmit={handleSubmit}
        className="sticky bottom-0 w-full max-w-md mb-5 border border-gray-300 rounded shadow-xl"
      >
        <input
          className="w-full p-2"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
      </form>
    </main>
  );
}

export function HistoryArea(){
    return (
        <aside className="flex flex-col items-center justify-center h-full max-w-xs border-r pr-4">
        <h6 className="text-lg font-semibold mb-4">Chat History</h6>
        {/* Chat history content goes here */}
        </aside>
    );
}