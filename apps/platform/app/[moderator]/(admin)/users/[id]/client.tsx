"use client";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { TransitionPanel } from "@/components/ui/transition-panel";
import React, { useState } from "react";

interface TransitionPanelProps {
  items: {
    title: string;
    subtitle: string;
    content: React.ReactNode;
    id: string;
  }[];
}

export function TabsTransitionPanel({ items }: TransitionPanelProps) {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  return (
    <div>
      <div className="mb-4 flex space-x-2">
        <ToggleGroup
          defaultValue={"0"}
          onValueChange={(value) =>
            setActiveIndex(items.findIndex((item) => item.id === value))
          }
          type="single"
        >
          {items.map((item) => (
            <ToggleGroupItem value={item.id} key={item.id}>
              {item.title}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
      <div className="overflow-hidden border-t border-zinc-200 dark:border-zinc-700">
        <TransitionPanel
          activeIndex={activeIndex}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          variants={{
            enter: { opacity: 0, y: -50, filter: "blur(4px)" },
            center: { opacity: 1, y: 0, filter: "blur(0px)" },
            exit: { opacity: 0, y: 50, filter: "blur(4px)" },
          }}
        >
          {items.map((item) => (
            <React.Fragment key={item.id}>{item.content}</React.Fragment>
          ))}
        </TransitionPanel>
      </div>
    </div>
  );
}
