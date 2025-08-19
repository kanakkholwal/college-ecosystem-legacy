import { cn } from "@/lib/utils";
import React from "react";

export type HeaderBarProps = {
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  titleNode: React.ReactNode;
  descriptionNode: React.ReactNode;
  actionNode?: React.ReactNode;
  className?: string;
};
export function HeaderBar({
  Icon,
  titleNode,
  descriptionNode,
  actionNode,
  className,
}: HeaderBarProps) {
  return (
    <div
      className={cn(
        "w-full flex items-center flex-wrap p-4 py-2 mt-2 mb-4 gap-2 bg-card rounded-lg border",
        className
      )}
    >
      <Icon className="inline-block size-5 mr-2" />
      <div>
        <h3 className="text-sm font-semibold">{titleNode}</h3>
        <p className="text-muted-foreground text-xs">{descriptionNode}</p>
      </div>
      <div className="inline-flex items-center gap-2 ml-auto">
        {actionNode}
      </div>
    </div>
  );
}
