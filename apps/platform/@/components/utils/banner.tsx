"use client";
import { BorderBeam } from "@/components/animation/border-beam";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type React from "react";

interface BannerActionPropsBase {
  className?: string;
  title: string | React.ReactNode;
  description: string | React.ReactNode;
}

interface BannerActionWithBtnProps extends BannerActionPropsBase {
  btnProps: React.ComponentProps<typeof Button>;
  actionComponent?: never;
}

interface BannerActionWithComponent extends BannerActionPropsBase {
  btnProps?: never;
  actionComponent: React.ReactNode;
}

type BannerPanelProps = BannerActionWithBtnProps | BannerActionWithComponent;

export function BannerPanel({
  className,
  description,
  title,
  btnProps,
  actionComponent,
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
        <div className="min-w-24">
          {actionComponent ? actionComponent :
            <Button
              size="sm"
              variant="outline"
              {...btnProps}
              className={cn("min-w-24", btnProps?.className)}
            />}
        </div>
      </div>
      <BorderBeam />
    </div>
  );
}