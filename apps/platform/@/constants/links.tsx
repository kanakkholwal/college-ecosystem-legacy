import type { Session } from "~/lib/auth-client";

import { Users } from "lucide-react";
import { BsInstagram } from "react-icons/bs";
import { FiLinkedin } from "react-icons/fi";
import { LuBookA, LuBuilding, LuGithub, LuSchool } from "react-icons/lu";
import { PiStudentFill } from "react-icons/pi";
import { RiTwitterXFill } from "react-icons/ri";
// import { TbServer2 } from "react-icons/tb";

import { GrStorage } from "react-icons/gr";
import { IoCalendarOutline } from "react-icons/io5";
import { TbDashboard } from "react-icons/tb";
import { ROLES } from "~/constants";

import { AudioLines, Bot, CalendarRange } from "lucide-react";
import { BiSpreadsheet } from "react-icons/bi";
import { GrAnnounce, GrSchedules } from "react-icons/gr";
import { MdOutlinePoll } from "react-icons/md";

export type RouterCardLink = {
  href: string;
  title: string;
  description: string;
  external?: boolean;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  allowed_roles: Session["user"]["role"] | Session["user"]["other_roles"] | "*";
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
  {
    href: "/chat",
    title: "Chatbot",
    description: "Chat with the college chatbot.(Beta)",
    Icon: Bot,
    disabled: true,
    allowed_roles: ["*"],
  },
];

export type rawLinkType = {
  title: string;
  path: string;
  allowed_roles: Session["user"]["role"] | Session["user"]["other_roles"] | "*";
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  items?: {
    title: string;
    path: string;
    allowed_roles:
      | Session["user"]["role"]
      | Session["user"]["other_roles"]
      | "*";
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
      {
        title: "Fix User",
        path: "/fix",
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
    title: "Storage",
    icon: GrStorage,
    path: "/storage",
    allowed_roles: [ROLES.ADMIN],
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
      ROLES.STUDENT,
      ROLES.CR,
      ROLES.FACULTY,
      ROLES.HOD,
      ROLES.ADMIN,
    ],
    items: [
      {
        title: "Import from PDF",
        path: "/import",
        allowed_roles: [
          ROLES.STUDENT,
          ROLES.CR,
          ROLES.FACULTY,
          ROLES.HOD,
          ROLES.ADMIN,
        ],
      },
    ],
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
    allowed_roles: [ROLES.CHIEF_WARDEN, ROLES.ADMIN],
    items: [],
  },
  {
    title: "Hostel",
    icon: LuBuilding,
    path: "/hostel",
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
  return links.filter(
    (link) =>
      link.allowed_roles.includes(role) || link.allowed_roles.includes("*")
  );
};
