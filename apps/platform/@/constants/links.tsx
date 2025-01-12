import { BsInstagram } from "react-icons/bs";
import { FiLinkedin } from "react-icons/fi";
import { LuGithub } from "react-icons/lu";
import { RiTwitterXFill } from "react-icons/ri";

import { AudioLines, Bot, CalendarRange } from "lucide-react";
import { BiSpreadsheet } from "react-icons/bi";
import { GrAnnounce, GrSchedules } from "react-icons/gr";
import { LuBookA, LuSchool } from "react-icons/lu";
import { MdOutlinePoll } from "react-icons/md";

export const quick_links = [
  {
    href: "/results",
    title: "Results",
    description: "Check your results here.",
    Icon: BiSpreadsheet,
  },
  {
    href: "/syllabus",
    title: "Syllabus",
    description: "Check your syllabus here.",
    Icon: LuBookA,
  },
  {
    href: "/classroom-availability",
    title: "Classroom Availability",
    description: "Check the availability of classrooms here.",
    Icon: LuSchool,
  },
  {
    href: "/schedules",
    title: "Schedules",
    description: "Check your schedules here.",
    Icon: GrSchedules,
    disabled: true,
  },
  {
    href: "/misc/calender",
    title: "Academic Calender",
    description: "Check the academic calender here.",
    Icon: CalendarRange,
    disabled: true,
  },
  {
    title: "Community",
    href: "/community",
    Icon: AudioLines,
    description: "Join the community and interact with your peers.",
  },
  {
    title: "Announcements",
    href: "/announcements",
    Icon: GrAnnounce,
    description: "Check out the latest announcements.",
  },
  {
    title: "Polls",
    href: "/polls",
    Icon: MdOutlinePoll,
    description: "Participate in polls.",
  },
  {
    href: "/chat",
    title: "Chatbot",
    description: "Chat with the college chatbot.(Beta)",
    Icon: Bot,
    disabled: true,
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
