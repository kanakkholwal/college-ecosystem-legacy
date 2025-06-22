"use client";

import { usePathname } from "next/navigation";

import { ButtonLink } from "@/components/utils/link";
import { cn } from "@/lib/utils";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string;
    title: string;
  }[];
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "flex gap-1 space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1",
        className
      )}
      {...props}
    >
      {items.map((item) => (
        <ButtonLink
          key={item.href}
          variant={pathname.includes(item.href) ? "outline" : "ghost"}
          className="justify-start"
          href={item.href}>
            {item.title}
        </ButtonLink>
      ))}
    </nav>
  );
}
