"use client";

import type * as React from "react";

import { NavMain } from "@/components/common/sidebar/nav-main";
import { NavUser } from "@/components/common/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import type { Session } from "~/lib/auth-client";

import { sidebar_links } from "@/constants/links";
import Link from "next/link";
import { appConfig } from "~/project.config";
import { ThemeSwitcher } from "../theme-switcher";

const getSideNavLinks = (role: string) => {
  return sidebar_links
    .filter(
      (link) =>
        link.allowed_roles.includes(role) || link.allowed_roles.includes("*")
    )
    .map((link) => ({
      title: link.title,
      icon: link.icon,
      href: `/${role}${link.path}`,
      preserveParams: link?.preserveParams,
      items: link?.items
        ?.filter(
          (link) =>
            link.allowed_roles.includes(role) ||
            link.allowed_roles.includes("*")
        )
        ?.map((item) => ({
          title: item.title,
          href: `/${role}${link.path}${item.path}`,
        })),
    }));
};

interface SidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: Session["user"];
  moderator: string;
}

export function AppSidebar({ user, moderator, ...props }: SidebarProps) {
  const links = getSideNavLinks(moderator);

  return (
    <Sidebar collapsible="icon" className="border-r border-border" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href={`/${moderator}`}>
                {/* <div>
                <ArrowUpCircleIcon className="h-5 w-5" />
                <span className="text-base font-semibold">Acme Inc.</span>
                </div> */}
                <div className="flex items-center justify-center rounded-lg text-3xl font-bold text-center relative bg-gradient-to-r from-primary to-sky-500 bg-clip-text text-transparent hover:from-sky-500 hover:to-primary whitespace-nowrap">
                  N
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate text-base font-semibold">
                    {appConfig.name}
                  </span>
                  {/* <span className="truncate text-xs">{activeRole.role}</span> */}
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={links} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
