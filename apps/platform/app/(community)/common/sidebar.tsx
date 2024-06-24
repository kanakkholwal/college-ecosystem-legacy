"use client";
import { SidenavLinkType } from "@/components/common/sidebar";
import { AudioLines } from "lucide-react";
import { GrAnnounce } from "react-icons/gr";
import { MdOutlinePoll } from "react-icons/md";
import { TbHome } from "react-icons/tb";

export const sidenav_links: SidenavLinkType[] = [
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
];
