import TypingIndicator from "@/components/animation/TypingIndicator";
import { format } from 'date-fns';
import { Message } from "../types";



export default function MessageComponent({ message,isLoading }: { message: Message,isLoading?:boolean }) {
  const isUser = message.role === 'user';

  return (
    <div className={`w-full flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[70%]`}>
        <div className={`px-4 py-2 rounded-lg ${
          isUser 
            ? 'bg-primary text-white rounded-br-none' 
            : 'bg-gray-200 text-gray-800 rounded-bl-none'
        }`}>
          {message.content.trim() === "" ? <TypingIndicator className="h-5"/> :  <p className="text-sm">{message.content}</p>}
        </div>
        {message.createdAt && (
          <span className="text-xs text-gray-500 mt-1">
            {format(message.createdAt, 'HH:mm')}
          </span>
        )}
      </div>
    </div>
  );
}