"use client";

import ProfileDropdown from "@/components/common/profile-dropdown";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { titlesMap } from "@/constants/titles";
import { usePathname } from "next/navigation";
import type { Session } from "~/lib/auth-client";
import { ThemeSwitcher } from "./theme-switcher";

export default function Navbar({ user }: { user: Session["user"] }) {
  const pathname = usePathname();

  return (
    <nav className="w-full p-4 backdrop-blur border-b border-solid flex items-center lg:px-6 z-2">
      <SidebarTrigger className="mx-2" />
      <div className="flex items-start flex-col">
        <h3 className="text-sm font-semibold">
          {titlesMap.get(pathname)?.title ?? "Dashboard"}
        </h3>
        <p className="text-xs text-muted-foreground font-light truncate w-full max-w-80">
          {titlesMap.get(pathname)?.description ?? pathname}
        </p>
      </div>
      <div className="ml-auto inline-flex gap-2 items-center">
        <ThemeSwitcher />
        <ProfileDropdown user={user} />
      </div>
    </nav>
  );
}
