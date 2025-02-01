"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

interface OutpassActionFooterProps {
  className?: string;
}

export function OutpassActionFooter({ className }: OutpassActionFooterProps) {
  return (
    <div className={cn("flex space-x-2 mt-2", className)}>
      <Button size="sm" variant="default_light">
        <Check />
        Approve
      </Button>
      <Button size="sm" variant="destructive_light">
        <X />
        Reject
      </Button>
    </div>
  );
}
