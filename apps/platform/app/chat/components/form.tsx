"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CornerDownLeft, Mic, Paperclip } from "lucide-react";
// import ChatList from "./chat-list";

export default function Form() {
  // const { messages, input, setInput, handleInputChange, handleSubmit, isLoading: chatEndpointIsLoading, setMessages } =
  //     useChat({
  //         api: "endpoint",
  //         onResponse(response) {

  //         },
  //         streamMode: "text",
  //         onError: (e) => {
  //             toast.error(e.message);
  //         }
  //     });
  return (
    <form className="relative overflow-hidden rounded-lg border bg-background w-full h-full">
      <ScrollArea className="h-96 w-full rounded-md border p-4">
        {/* <ChatList messages={messages} /> */}
      </ScrollArea>

      <div className="sticky bottom-0 left-0 right-0">
        <Label htmlFor="message" className="sr-only">
          Message
        </Label>
        <Textarea
          id="message"
          placeholder="Type your message here..."
          className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
        />
        <div className="flex items-center p-3 pt-0 gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon_sm" type="button">
                  <Paperclip />
                  <span className="sr-only">Attach file</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">Attach File</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon_sm" type="button">
                  <Mic />
                  <span className="sr-only">Use Microphone</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">Use Microphone</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Button type="submit" size="sm" className="ml-auto gap-1.5">
            Send Message
            <CornerDownLeft />
          </Button>
        </div>
      </div>
    </form>
  );
}
