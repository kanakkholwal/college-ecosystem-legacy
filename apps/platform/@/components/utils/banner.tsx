"use client";
import { BorderBeam } from "@/components/animation/border-beam";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type React from "react";

interface BannerPanelProps {
  className?: string;
  title: string | React.ReactNode;
  description: string | React.ReactNode;
  btnProps?: React.ComponentProps<typeof Button>;
}

export function BannerPanel({
  className,
  description,
  title,
  btnProps,
}: BannerPanelProps) {
  return (
    <div
      className={cn(
        "bg-muted px-4 py-3 md:py-2 rounded-lg max-w-max mx-auto relative",
        className
      )}
    >
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 relative z-50">
        <div className="text-sm flex gap-1">
          <div className="font-medium">{title}</div>
          <div className="mx-2 text-muted-foreground">•</div>
          {description}
        </div>
        <Button
          size="sm"
          variant="outline"
          {...btnProps}
          className={cn("min-w-24", btnProps?.className)}
        />
      </div>
      <BorderBeam className="z-1 md:rounded-full" />
    </div>
  );
}
