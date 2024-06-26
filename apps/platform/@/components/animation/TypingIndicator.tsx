import { cn } from "@/lib/utils";
import "./TypingIndicator.css"; // We'll create this file for custom animations

export default function TypingIndicator({ className }: { className?: string }) {
  return (
    <div className={cn("w-16 h-8 relative z-10 typing-indicator", className)}>
      <div className="typing-circle"></div>
      <div className="typing-circle"></div>
      <div className="typing-circle"></div>
      <div className="typing-shadow"></div>
      <div className="typing-shadow"></div>
      <div className="typing-shadow"></div>
    </div>
  );
}
