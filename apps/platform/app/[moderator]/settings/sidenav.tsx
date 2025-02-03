"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string
    title: string
  }[]
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const pathname = usePathname()

  return (
    <nav
      className={cn(
        "flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1",
        className
      )}
      {...props}
    >
      {items.map((item) => (<Button
        key={item.href}
        variant={pathname.includes(item.href) ? "default_light" : "ghost"}
        effect="shineHover"
        className="justify-start"
        asChild>
        <Link
          href={item.href}
        >
          {item.title}
        </Link>
      </Button>))}
    </nav>
  )
}