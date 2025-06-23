import { Settings, Tickets, Users } from "lucide-react";
import { BsInstagram } from "react-icons/bs";
import { FiLinkedin } from "react-icons/fi";
import { LuBookA, LuBuilding, LuGithub, LuSchool } from "react-icons/lu";
import { RiTwitterXFill } from "react-icons/ri";
import type { Session } from "~/lib/auth-client";
// import { TbServer2 } from "react-icons/tb";

import { IoCalendarOutline } from "react-icons/io5";
import { TbDashboard } from "react-icons/tb";
import { ROLES } from "~/constants";

import { AudioLines, CalendarRange } from "lucide-react";
import { BiSpreadsheet } from "react-icons/bi";
import { GrAnnounce, GrSchedules } from "react-icons/gr";
import { MdOutlinePoll } from "react-icons/md";
import { appConfig, supportLinks } from "~/project.config";

export type AllowedRoleType =
  | Session["user"]["role"]
  | Session["user"]["other_roles"][number]
  | "*"
  | `!${Session["user"]["role"]}`
  | `!${Session["user"]["other_roles"][number]}`;

export type RouterCardLink = {
  href: string;
  title: string;
  description: string;
  external?: boolean;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  allowed_roles: AllowedRoleType[] | AllowedRoleType;
  disabled?: boolean;
};

export const quick_links: RouterCardLink[] = [
  {
    href: "/results",
    title: "Results",
    description: "Check your results here.",
    allowed_roles: ["*"],
    Icon: BiSpreadsheet,
  },
  {
    href: "/syllabus",
    title: "Syllabus",
    description: "Check your syllabus here.",
    Icon: LuBookA,
    allowed_roles: ["*"],
  },
  {
    href: "/classroom-availability",
    title: "Classroom Availability",
    description: "Check the availability of classrooms here.",
    Icon: LuSchool,
    allowed_roles: ["*"],
  },
  {
    href: "/schedules",
    title: "Schedules",
    description: "Check your schedules here.",
    Icon: GrSchedules,
    disabled: false,
    allowed_roles: ["*"],
  },
  {
    href: "/academic-calendar",
    title: "Academic Calendar",
    description: "Check the academic calender here.",
    Icon: CalendarRange,
    disabled: false,
    allowed_roles: ["*"],
  },
  {
    title: "Community",
    href: "/community",
    Icon: AudioLines,
    description: "Join the community and interact with your peers.",
    allowed_roles: ["*"],
  },
  {
    title: "Announcements",
    href: "/announcements",
    Icon: GrAnnounce,
    description: "Check out the latest announcements.",
    allowed_roles: ["*"],
  },
  {
    title: "Polls",
    href: "/polls",
    Icon: MdOutlinePoll,
    description: "Participate in polls.",
    allowed_roles: ["*"],
  },
  // {
  //   href: "/chat",
  //   title: "Chatbot",
  //   description: "Chat with the college chatbot.(Beta)",
  //   Icon: Bot,
  //   disabled: true,
  //   allowed_roles: ["*"],
  // },
];

export type rawLinkType = {
  title: string;
  path: string;
  allowed_roles: AllowedRoleType[] | AllowedRoleType;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  preserveParams?: boolean;
  items?: {
    title: string;
    path: string;
    allowed_roles: AllowedRoleType[] | AllowedRoleType;
  }[];
};

export const sidebar_links: rawLinkType[] = [
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
        title: "Import from Excel",
        path: "/import",
        allowed_roles: [ROLES.ADMIN],
      },
    ],
  },

  {
    title: "Academic Events",
    icon: IoCalendarOutline,
    path: "/events",
    allowed_roles: [ROLES.ADMIN],
  },
  // {
  //   title: "Server",
  //   icon: TbServer2,
  //   path: "/server",
  //   allowed_roles: [ROLES.ADMIN],
  // },
  {
    title: "Courses",
    icon: LuBookA,
    path: "/courses",
    allowed_roles: [ROLES.ADMIN],
  },
  {
    title: "Schedules",
    icon: GrSchedules,
    path: "/schedules",
    allowed_roles: [`!${ROLES.GUARD}`],
  },
  {
    title: "Personal Attendance",
    icon: CalendarRange,
    path: "/attendance-personal",
    allowed_roles: [ROLES.STUDENT],
  },
  {
    title: "Out Pass",
    icon: Tickets,
    path: "/outpass",
    allowed_roles: [ROLES.STUDENT],
  },
  {
    title: "Rooms",
    icon: LuSchool,
    path: "/rooms",
    allowed_roles: [ROLES.ADMIN],
    items: [
      {
        title: "Add Room",
        path: "/new",
        allowed_roles: [ROLES.ADMIN],
      },
    ],
  },
  {
    title: "Hostels",
    icon: LuBuilding,
    path: "/hostels",
    allowed_roles: [
      ROLES.CHIEF_WARDEN,
      ROLES.ADMIN,
      ROLES.ASSISTANT_WARDEN,
      ROLES.WARDEN,
      ROLES.MMCA,
    ],
    items: [],
  },
  // {
  //   title: "Hostel",
  //   icon: LuBuilding,
  //   path: "/hostel",
  //   preserveParams: true,
  //   allowed_roles: [
  //     ROLES.ADMIN,
  //     ROLES.WARDEN,
  //     ROLES.ASSISTANT_WARDEN,
  //     ROLES.MMCA,
  //   ],
  //   items: [
  //     {
  //       title: "Out Pass",
  //       path: "/out-pass/list",
  //       allowed_roles: [
  //         ROLES.ADMIN,
  //         ROLES.WARDEN,
  //         ROLES.ASSISTANT_WARDEN,
  //         ROLES.MMCA,
  //       ],
  //     },
  //     {
  //       title: "Out Pass Requests",
  //       path: "/out-pass/requests",
  //       allowed_roles: [
  //         ROLES.ADMIN,
  //         ROLES.WARDEN,
  //         ROLES.ASSISTANT_WARDEN,
  //         ROLES.MMCA,
  //       ],
  //     },
  //   ],
  // },
  // {
  //   title: "Hosteler Students",
  //   icon: PiStudentFill,
  //   path: "/hostel/students",
  //   allowed_roles: [
  //     ROLES.WARDEN,
  //     ROLES.ASSISTANT_WARDEN,
  //     ROLES.MMCA,
  //     ROLES.ADMIN,
  //   ],
  //   items: [
  //     {
  //       title: "Add Hostelers Student",
  //       path: "/add",
  //       allowed_roles: [
  //         ROLES.WARDEN,
  //         ROLES.ASSISTANT_WARDEN,
  //         ROLES.MMCA,
  //         ROLES.ADMIN,
  //       ],
  //     },
  //   ],
  // },
  {
    title: "Settings",
    icon: Settings,
    path: "/settings",
    allowed_roles: ["*"],
    items: [
      {
        title: "Account",
        path: "/account",
        allowed_roles: ["*"],
      },
      {
        title: "Appearance",
        path: "/appearance",
        allowed_roles: ["*"],
      },
    ],
  },
];

interface SocialLink {
  href: string;
  icon: React.ElementType;
}

export const socials: SocialLink[] = [
  {
    href: appConfig.socials.twitter,
    icon: RiTwitterXFill,
  },
  {
    href: appConfig.socials.linkedin,
    icon: FiLinkedin,
  },
  {
    href: appConfig.socials.github,
    icon: LuGithub,
  },
  {
    href: appConfig.socials.instagram,
    icon: BsInstagram,
  },
];

export const getLinksByRole = <T extends rawLinkType | RouterCardLink>(
  role: string,
  links: T[]
): T[] => {
  return links.filter((link) =>
    checkRoleAccess(role, normalizeRoles(link.allowed_roles))
  );
};
// Helper function to normalize allowed_roles to array
const normalizeRoles = (
  roles: AllowedRoleType | AllowedRoleType[]
): string[] => {
  return Array.isArray(roles)
    ? roles.map((role) => String(role))
    : [String(roles)];
};
// Helper function to check role access with negation support
const checkRoleAccess = (userRole: string, allowedRoles: string[]): boolean => {
  // If allowed_roles is "*", allow access to everyone
  if (allowedRoles.includes("*")) return true;

  // Check for direct role match
  if (allowedRoles.includes(userRole)) return true;

  // Check for negation roles (starting with "!")
  const positiveRoles = allowedRoles.filter((role) => !role.startsWith("!"));
  const negatedRoles = allowedRoles.filter((role) => role.startsWith("!"));

  // If there are positive roles specified, use standard inclusion logic
  if (positiveRoles.length > 0) {
    return positiveRoles.includes(userRole);
  }

  // If only negation roles are specified, allow access if user's role is not negated
  return !negatedRoles.some(
    (negRole) => userRole === negRole.slice(1) // Remove "!" prefix for comparison
  );
};

export const SUPPORT_LINKS = supportLinks;

export type NavLink = {
  title: string;
  href: string;
  description: string;
  Icon?: React.FC<React.SVGProps<SVGSVGElement>>;
  items?: NavLink[];
};

export const getNavLinks = (user?: Session["user"]): NavLink[] => {
  const linksByRole = [user?.role, ...(user?.other_roles || [])]
    .map((role) => getLinksByRole("*", quick_links))
    .flat() // filter out unique links
    .filter(
      (link, index, self) =>
        index ===
        self.findIndex((l) => l.href === link.href && l.title === link.title)
    );
  // console.log("Links by role:", linksByRole);

  return [
    // {
    //   title: "Home",
    //   href: "/",
    //   description: "Go to the home page.",
    //   Icon: House,
    // },
    ...linksByRole,
    ...(user ? user.other_roles?.length <= 1
      ? [
          {
            title: "Settings",
            href: user.other_roles[0] + "/settings",
            description: "Manage your account settings.",
            Icon: Settings,
          },
        ]
      : [
          {
            title: "Dashboard",
            href: "/" + user.other_roles[0],
            description: "Manage your account settings.",
            Icon: Settings,
            items: user.other_roles.map((role) => ({
              title:
                role.charAt(0).toUpperCase() + role.slice(1) + " Dashboard",
              href: `/${role}`,
              description: `Manage your ${role} dashboard.`,
              Icon: Settings,
            })),
          },
        ]: []),
  ];
};
