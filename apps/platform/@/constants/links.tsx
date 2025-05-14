import { Settings, Users } from "lucide-react";
import { BsInstagram } from "react-icons/bs";
import { FiLinkedin } from "react-icons/fi";
import { LuBookA, LuBuilding, LuGithub, LuSchool } from "react-icons/lu";
import { PiStudentFill } from "react-icons/pi";
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
    disabled: true,
    allowed_roles: ["*"],
  },
  {
    href: "/misc/calender",
    title: "Academic Calender",
    description: "Check the academic calender here.",
    Icon: CalendarRange,
    disabled: true,
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
      }
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
    title: "Academic Calender",
    icon: IoCalendarOutline,
    path: "/academic-calender",
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
    allowed_roles: [
      ROLES.ADMIN,

    ],
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
    title: "All Hostels",
    icon: LuBuilding,
    path: "/hostels",
    allowed_roles: [ROLES.CHIEF_WARDEN, ROLES.ADMIN,ROLES.ASSISTANT_WARDEN,ROLES.WARDEN,ROLES.MMCA],
    items: [],
  },
  {
    title: "Hostel",
    icon: LuBuilding,
    path: "/hostel",
    preserveParams: true,
    allowed_roles: [
      ROLES.ADMIN,
      ROLES.WARDEN,
      ROLES.ASSISTANT_WARDEN,
      ROLES.MMCA,
    ],
    items: [
      {
        title: "Out Pass",
        path: "/out-pass/list",
        allowed_roles: [
          ROLES.ADMIN,
          ROLES.WARDEN,
          ROLES.ASSISTANT_WARDEN,
          ROLES.MMCA,
        ],
      },
      {
        title: "Out Pass Requests",
        path: "/out-pass/requests",
        allowed_roles: [
          ROLES.ADMIN,
          ROLES.WARDEN,
          ROLES.ASSISTANT_WARDEN,
          ROLES.MMCA,
        ],
      },
    ],
  },
  {
    title: "Hosteler Students",
    icon: PiStudentFill,
    path: "/hostel/students",
    allowed_roles: [
      ROLES.WARDEN,
      ROLES.ASSISTANT_WARDEN,
      ROLES.MMCA,
      ROLES.ADMIN,
    ],
    items: [
      {
        title: "Add Hostelers Student",
        path: "/add",
        allowed_roles: [
          ROLES.WARDEN,
          ROLES.ASSISTANT_WARDEN,
          ROLES.MMCA,
          ROLES.ADMIN,
        ],
      },
    ],
  },
  {
    title: "Settings",
    icon: Settings,
    path: "/settings",
    allowed_roles:["*"],
    items:[
      {
        title:"Account",
        path:"/account",
        allowed_roles:["*"]
      },
      {
        title:"Appearance",
        path:"/appearance",
        allowed_roles:["*"]
      },
    ]
  }
];

interface SocialLink {
  href: string;
  icon: React.ElementType;
}

export const socials: SocialLink[] = [
  {
    href: "https://x.com/kanakkholwal",
    icon: RiTwitterXFill,
  },
  {
    href: "https://linkedin.com/in/kanak-kholwal",
    icon: FiLinkedin,
  },
  {
    href: "https://github.com/kanakkholwal",
    icon: LuGithub,
  },
  {
    href: "https://instagram.com/kanakkholwal",
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



export const SUPPORT_LINKS = [
  {
    href: "https://github.com/kanakkholwal/college-ecosystem",
    title: "Contribute to this project",
  },
  {
    href: "https://github.com/kanakkholwal/college-ecosystem/issues",
    title: "Report an issue",
  },
  {
    href: "https://forms.gle/u2ptK12iRVdn5oXF7",
    title: "Give a feedback",
  },
  {
    href: "https://forms.gle/v8Angn9VCbt9oVko7",
    title: "Suggest a feature",
  },
];
