"use client";

import type * as React from "react";

import { NavMain } from "@/components/common/sidebar/nav-main";
import { NavUser } from "@/components/common/sidebar/nav-user";
import { RoleSwitcher } from "@/components/common/sidebar/role-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import type { Session } from "~/lib/auth-client";

import { sidebar_links } from "@/constants/links";

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
    <Sidebar
      collapsible="icon"
      className="backdrop-blur-3xl border-r border-border"
      {...props}
    >
      <SidebarHeader>
        <RoleSwitcher user={user} />
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
