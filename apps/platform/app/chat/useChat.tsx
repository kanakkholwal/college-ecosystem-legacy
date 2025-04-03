import { nanoid } from "nanoid";
import { useCallback, useEffect, useRef, useState } from "react";

import type { Message } from "./types";

interface ChatMessage extends Message {}

interface UseChatResult {
  messages: ChatMessage[];
  input: string;
  isLoading: boolean;
  error: string | null;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (
    e: React.FormEvent<HTMLFormElement | HTMLTextAreaElement>
  ) => void;
  scrollRef: React.RefObject<HTMLDivElement | null>;
}

export function useChat(): UseChatResult {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInput(e.target.value);
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement | HTMLTextAreaElement>) => {
      e.preventDefault();
      if (!input.trim() || isLoading) return;

      setIsLoading(true);
      setError(null);

      // Add user message to chat
      const userMessage: ChatMessage = {
        role: "user",
        content: input.trim(),
        id: nanoid(),
        createdAt: new Date(),
      };
      setMessages((prev) => [...prev, userMessage]);

      // Prepare assistant message
      const assistantMessage: ChatMessage = {
        role: "bot",
        content: "",
        id: nanoid(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
      setInput("");

      // Create a new AbortController for this request
      abortControllerRef.current = new AbortController();

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: userMessage.content }),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) throw new Error("Failed to fetch response");
        if (!response.body) throw new Error("Response body is null");
        const { answer } = await response.json();
        setMessages((prev) => {
          const lastMessage = prev[prev.length - 1];
          if (lastMessage.role === "bot") {
            return [
              ...prev.slice(0, -1),
              { ...lastMessage, content: answer, createdAt: new Date() },
            ];
          }
          return prev;
        });
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      } catch (err: any) {
        if (err.name === "AbortError") {
          setError("Request was cancelled");
        } else {
          setError("An error occurred while fetching the response");
          console.error("Chat error:", err);
        }
      } finally {
        setIsLoading(false);
        abortControllerRef.current = null;
      }
    },
    [input, isLoading]
  );

  return {
    messages,
    input,
    isLoading,
    error,
    handleInputChange,
    handleSubmit,
    scrollRef,
  };
}
