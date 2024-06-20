"use client";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Message } from "../types";
import MessageComponent from "./message";

export default function ChatList({ messages }: { messages: Message[] }) {
  return (
    <AnimatePresence>
      {messages?.map((message, index) => (
        <motion.div
          key={index}
          layout
          initial={{ opacity: 0, scale: 1, y: 50, x: 0 }}
          animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, scale: 1, y: 1, x: 0 }}
          transition={{
            opacity: { duration: 0.1 },
            layout: {
              type: "spring",
              bounce: 0.3,
              duration: messages.indexOf(message) * 0.05 + 0.2,
            },
          }}
          style={{
            originX: 0.5,
            originY: 0.5,
          }}
          className={cn(
            "flex flex-col gap-2 p-4 whitespace-pre-wrap",
            message.role !== "user" ? "items-end" : "items-start"
          )}
        >
          <MessageComponent message={message} />
        </motion.div>
      ))}
    </AnimatePresence>
  );
}
