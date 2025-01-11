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
import { Users } from 'lucide-react';
import { BiSpreadsheet } from "react-icons/bi";
import { GrSchedules } from "react-icons/gr";
import { LuBookA, LuBuilding, LuSchool } from "react-icons/lu";
import { PiStudentFill } from "react-icons/pi";
import type { Session } from "~/lib/auth-client";

import { CalendarRange } from "lucide-react";
import { GrStorage } from "react-icons/gr";
import { TbDashboard } from "react-icons/tb";
import { ROLES } from "~/constants";

export type rawLinkType = {
  title: string;
  path: string;
  allowed_roles: Session["user"]["role"] | Session["user"]["other_roles"] | "*";
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  items?: {
    title: string;
    path: string;
    allowed_roles: Session["user"]["role"] | Session["user"]["other_roles"] | "*";
  }[];
};

const all_links: rawLinkType[] = [
  {
    title: "Dashboard",
    icon: TbDashboard,
    path: "/",
    allowed_roles: ["*"],
  },
  {
    title: "Users",
    icon: Users,
    path: "/users",
    allowed_roles: [ROLES.ADMIN],
    items: [
      {
        title: "Create User",
        path: "/new",
        allowed_roles: [ROLES.ADMIN],
      },
    ],
  },
  {
    title: "Result",
    icon: BiSpreadsheet,
    path: "/result",
    allowed_roles: [ROLES.ADMIN],
    items: [
      {
        title: "Scraping",
        path: "/scraping",
        allowed_roles: [ROLES.ADMIN],
      },
      {
        title: "Import",
        path: "/import",
        allowed_roles: [ROLES.ADMIN],
      },
    ],
  },
  {
    title: "Storage",
    icon: GrStorage,
    path: "/storage",
    allowed_roles: [ROLES.ADMIN],
  },
  {
    title: "Courses",
    icon: LuBookA,
    path: "/courses",
    allowed_roles: [ROLES.STUDENT,ROLES.CR,ROLES.FACULTY,ROLES.HOD,ROLES.ADMIN],
  },
  {
    title: "Schedules",
    icon: GrSchedules,
    path: "/schedules",
    allowed_roles: ["*"],
  },
  {
    title: "Personal Attendance",
    icon: CalendarRange,
    path: "/attendance-personal",
    allowed_roles: [ROLES.STUDENT],
  },
  {
    title: "Rooms",
    icon: LuSchool,
    path: "/rooms",
    allowed_roles: [ROLES.ADMIN],
    items: [
      {
        title: "Create Classroom",
        path: "/new",
        allowed_roles: [ROLES.ADMIN],
      },
    ],
  },
  {
    title: "Hostels",
    icon: LuBuilding,
    path: "/hostels",
    allowed_roles: [ROLES.CHIEF_WARDEN,ROLES.ADMIN],
    items: [
      {
        title: "Add Hostel",
        path: "/add",
        allowed_roles: [ROLES.CHIEF_WARDEN,ROLES.ADMIN],
      },
    ],
  },
  {
    title: "Hosteler Students",
    icon: PiStudentFill,
    path: "/hostel/students",
    allowed_roles: [ROLES.WARDEN,ROLES.ASSISTANT_WARDEN,ROLES.MMCA,ROLES.ADMIN],
    items: [
      {
        title: "Add Hostelers Student",
        path: "/add",
        allowed_roles: [ROLES.WARDEN,ROLES.ASSISTANT_WARDEN,ROLES.MMCA,ROLES.ADMIN],
      },
    ],
  },
];

const getSideNavLinks = (role: string) => {
  return all_links
    .filter((link) => link.allowed_roles.includes(role) || link.allowed_roles.includes("*"))
    .map((link) => ({
      title: link.title,
      icon: link.icon,
      href: `/${role}${link.path}`,
      items: link?.items?.filter((link) => link.allowed_roles.includes(role) || link.allowed_roles.includes("*"))?.map((item) => ({
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
      className="bg-white/20 backdrop-blur-3xl border-r border-gray-300/30"
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
