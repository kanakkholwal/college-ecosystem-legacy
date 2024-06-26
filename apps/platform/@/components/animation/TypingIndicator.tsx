import './TypingIndicator.css'; // We'll create this file for custom animations

export default function TypingIndicator() {
  return (
    <div className="w-16 h-8 relative z-10 typing-indicator">
      <div className="typing-circle"></div>
      <div className="typing-circle"></div>
      <div className="typing-circle"></div>
      <div className="typing-shadow"></div>
      <div className="typing-shadow"></div>
      <div className="typing-shadow"></div>
    </div>
  );
}