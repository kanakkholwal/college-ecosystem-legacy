"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaRegUser } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import { VscChevronDown } from "react-icons/vsc";
import type { Session } from "src/lib/auth-client";
import { authClient } from "src/lib/auth-client";
import {titlesMap} from "@/constants/titles";


export default function Navbar({ user }: { user: Session["user"] }) {
  const pathname = usePathname();

  return (
    <nav className="w-full p-4  backdrop-blur border-b border-solid border-slate-100/50 dark:border-slate-700 flex items-center lg:px-6 z-2">
      <SidebarTrigger className="mx-2" />

      <div className="flex items-start flex-col">
        <h3 className="text-lg font-bold">
          {titlesMap.get(pathname)?.title ?? "Dashboard"}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold truncate w-full max-w-72">
          {titlesMap.get(pathname)?.description ?? pathname}
        </p>
      </div>
      <div className="ml-auto inline-flex gap-1 items-center">
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex items-center space-x-2 px-3 py-1.5 rounded-lg"
              >
                <span className="text-slate-500 dark:text-slate-300 text-sm ml-2 font-semibold hidden md:inline-block">
                  {user.name}
                </span>
                <VscChevronDown className="text-slate-500" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent sideOffset={15}>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link
                  href={"/profile"}
                  className="w-full text-accent-foreground hover:text-slate-800"
                >
                  <FaRegUser className="w-3 h-3 mr-1" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <button
                  type="button"
                  onClick={async (e) => {
                    e.preventDefault();
                    await authClient.signOut();
                  }}
                  className="w-full text-accent-foreground hover:text-slate-800"
                >
                  <MdLogout className="w-3 h-3 mr-1" />
                  Log Out
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
