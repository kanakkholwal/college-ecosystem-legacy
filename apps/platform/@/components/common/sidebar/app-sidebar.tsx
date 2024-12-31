"use client"

import type * as React from "react"

import { NavMain } from "@/components/common/sidebar/nav-main"
import { NavUser } from "@/components/common/sidebar/nav-user"
import { RoleSwitcher } from "@/components/common/sidebar/role-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import type { Session } from "~/lib/auth-client"

import {
  CalendarRange,
  Grid3X3,
  UserRoundCog
} from "lucide-react"
import { GrStorage } from "react-icons/gr"
import { LiaReadme } from "react-icons/lia"
import { SiGoogleclassroom } from "react-icons/si"
import { TbDashboard } from "react-icons/tb"


export type rawLinkType = {
  title: string;
  path: string;
  allowed_roles: Session["user"]["role"] | Session["user"]["other_roles"] | "*";
  icon:  React.FC<React.SVGProps<SVGSVGElement>>
  items?: {
    title: string;
    path: string;
  }[]
};

const all_links: rawLinkType[] = [
  {
    title: "Dashboard",
    icon: TbDashboard,
    path: "",
    allowed_roles: ["*"],
  },
  {
    title: "Users",
    icon: UserRoundCog,
    path: "/users",
    allowed_roles: ["admin", "moderator"],
    items: [
      {
        title: "Create User",
        path: "/new",
      },
    ]
  },
  {
    title: "Result",
    icon: Grid3X3,
    path: "/result",
    allowed_roles: ["admin", "moderator"],
    items:[
      {
        title: "Scraping",
        path: "/scraping",
      },
      {
        title: "Import",
        path: "/import",
      },
    ]
  },
  {
    title: "Storage",
    icon: GrStorage,
    path: "/storage",
    allowed_roles: ["admin", "moderator"],
  },
  {
    title: "Courses",
    icon: LiaReadme,
    path: "/courses",
    allowed_roles: ["*"],
  },
  {
    title: "Time Tables",
    icon: CalendarRange,
    path: "/schedules",
    allowed_roles: ["*"],
  },
  {
    title: "Classrooms",
    icon: SiGoogleclassroom,
    path: "/rooms",
    allowed_roles: ["*"],
    items: [
      {
        title: "Create Classroom",
        path: "/new",
      },
    ]
  },
];

const getSideNavLinks = (role: string) => {
  return all_links
    .filter((link) => {
      return (
        link.allowed_roles.includes(role) || link.allowed_roles.includes("*") 
      );
    })
    .map((link) => ({
      title: link.title,
      icon: link.icon,
      href: `/${role}${link.path}`,
      items: link?.items?.map((item) => ({
        title: item.title,
        href: `/${role}${link.path}${item.path}`,
      })),
    }));
};



interface SidebarProps extends React.ComponentProps<typeof Sidebar>{
    user:Session["user"]
    moderator: string
}

export function AppSidebar({ user,moderator,...props }: SidebarProps) {

  const links = getSideNavLinks(moderator)

  return (
    <Sidebar collapsible="icon" className="bg-white/20 backdrop-blur-3xl border-r border-gray-300/30" {...props}>
      <SidebarHeader>
        <RoleSwitcher  user={user}/>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={links} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
