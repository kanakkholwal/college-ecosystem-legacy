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
import type { Session } from "~/auth/client";

import AdUnit from "@/components/common/adsense";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { sidebar_links } from "@/constants/links";
import Link from "next/link";
import { appConfig, orgConfig } from "~/project.config";

const getSideNavLinks = (role: string, prefixPath?: string) => {
  return sidebar_links
    .filter(
      (link) =>
        link.allowed_roles.includes(role) || link.allowed_roles.includes("*")
    )
    .map((link) => ({
      title: link.title,
      icon: link.icon,
      href: prefixPath ? `/${prefixPath}${link.path}` : `/${role}${link.path}`,
      preserveParams: link?.preserveParams,
      items: link?.items
        ?.filter(
          (link) =>
            link.allowed_roles.includes(role) ||
            link.allowed_roles.includes("*")
        )
        ?.map((item) => ({
          title: item.title,
          href: prefixPath
            ? `/${prefixPath}${link.path}${item.path}`
            : `/${role}${link.path}${item.path}`,
        })),
    }));
};

interface SidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: Session["user"];
  moderator: string;
  prefixPath?: string; // Optional prefix path for links
}

export function AppSidebar({
  user,
  moderator,
  prefixPath,
  ...props
}: SidebarProps) {
  const links = getSideNavLinks(moderator, prefixPath);

  return (
    <Sidebar collapsible="icon" className="border-r border-border" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
              size="lg"
            >
              <Link href={`/${prefixPath ? prefixPath : moderator}`}>
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src="/logo-square.webp" alt={appConfig.name} />
                  <AvatarFallback className="flex items-center justify-center rounded-lg text-3xl font-bold text-center relative bg-gradient-to-r from-primary to-sky-500 bg-clip-text text-transparent hover:from-sky-500 hover:to-primary whitespace-nowrap">
                    {orgConfig.shortName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {appConfig.name}
                  </span>
                  <span className="truncate text-xs">
                    {orgConfig.mailSuffix}
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={links} />
      </SidebarContent>
      <AdUnit adSlot="display-square" key="adsense-app-sidebar" />

      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
