
import { cn } from "@/lib/utils";
import { ArrowRight, ArrowUpRight, AudioLines } from "lucide-react";
import Link from "next/link";
import { GrAnnounce } from "react-icons/gr";
import { LuSearch } from "react-icons/lu";
import { MdOutlinePoll } from "react-icons/md";
import { TbHome } from "react-icons/tb";

export const sidenav_links = [
  {
    title: "Home",
    href: "/",
    Icon: TbHome,
  },
  {
    title: "Community",
    href: "/community",
    Icon: AudioLines,
  },
  {
    title: "Announcements",
    href: "/announcements",
    Icon: GrAnnounce,
  },
  {
    title: "Polls",
    href: "/polls",
    Icon: MdOutlinePoll,
  },
  // {
  //     title: "Contact",
  //     href: "/contact",
  //     Icon: ArrowRight,
  // },
];
