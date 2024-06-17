"use client";
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
    Sheet,
    SheetContent,
    SheetTrigger
} from "@/components/ui/sheet";
import { cn } from '@/lib/utils';
import {
    Cloud,
    Eye,
    LogOut,
    Settings,
    UserRound
} from 'lucide-react';
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { BsInstagram } from "react-icons/bs";
import { FiLinkedin } from "react-icons/fi";
import { LuGithub } from "react-icons/lu";
import { RiTwitterXFill } from "react-icons/ri";
import { SidebarContent } from "./sidebar";

export default function Navbar() {
    const pathname = usePathname();

    return (
        <div className={cn(
            "sticky marker:lg:static left-0 top-0 lg:mt-5 z-50 inset-inline-0 mx-auto w-full backdrop-blur-2xl  lg:bg-white/20 lg:dark:bg-zinc-800/30 border-gray-300/50 bg-gradient-to-b from-primary/5 dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit "
        )}>
            <nav className={cn(
                "mx-auto w-full p-4 lg:py-2 lg:rounded-xl lg:border border-b border-slate-900/5",
                "flex items-center justify-between font-bold text-xl")}>
                <Link href="/" className="relative bg-gradient-to-r from-primary to-sky-500 bg-clip-text text-transparent hover:from-sky-500 hover:to-primary lg:text-xl whitespace-nowrap">
                    {process.env.NEXT_PUBLIC_WEBSITE_NAME}
                </Link>
                <div className="flex items-center gap-5">
                    <div className="items-center gap-5 hidden sm:inline-flex">
                        <Link href="https://x.com/kanakkholwal" className={" hover:text-primary hover:-translate-y-1 ease-in duration-300 flex justify-center items-center h-8 icon"}>
                            <RiTwitterXFill className="w-5 h-5" />
                        </Link>
                        <Link href="https://linkedin.com/in/kanak-kholwal" className={" hover:text-primary hover:-translate-y-1 ease-in duration-300 flex justify-center items-center h-8 icon"}>
                            <FiLinkedin className="w-5 h-5" />
                        </Link>
                        <Link href="https://github.com/kanakkholwal" className={" hover:text-primary hover:-translate-y-1  ease-in duration-300 flex justify-center items-center h-16 icon"}>
                            <LuGithub className="w-5 h-5" />
                        </Link>
                        <Link href="https://instagram.com/kanakkholwal" className={" hover:text-primary hover:-translate-y-1  ease-in duration-300 flex justify-center items-center h-16 icon"}>
                            <BsInstagram className="w-5 h-5" />
                        </Link>
                    </div>

                    <div className="border-r border-gray-300 dark:border-neutral-800 h-8 hidden lg:block" />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="link" size="icon" rounded="full">
                                <UserRound />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" side="bottom" align="end">
                        <DropdownMenuLabel className="font-normal">
                                    {/* <div className="flex flex-col space-y-1">
                                        <p className="block md:hidden text-sm font-medium leading-none">{session.user.name}</p>
                                        <p className="text-xs capitalize  leading-none text-primary md:font-medium ">
                                            {session.user.type + " Account"}
                                        </p>
                                        <p className="text-xs leading-none text-muted-foreground ">
                                            {session.user.email}
                                        </p>

                                    </div> */}
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem>
                                    <UserRound className="mr-2 h-4 w-4" />
                                    <span>Profile</span>
                                    {/* <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut> */}
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Settings className="mr-2 h-4 w-4" />
                                    <span>Settings</span>
                                    {/* <DropdownMenuShortcut>⌘S</DropdownMenuShortcut> */}
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem disabled>
                                <Cloud className="mr-2 h-4 w-4" />
                                <span>API</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem disabled>
                                <Eye className="mr-2 h-4 w-4" />
                                <span>
                                    <img src="https://visitor-badge.laobi.icu/badge?page_id=nith_portal.visitor-badge" alt="Visitor counter" className="inline-block font-inherit" />
                                </span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/", })} className='cursor-pointer'>
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Log out</span>
                                {/* <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut> */}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </nav>
            <div className="flex items-center p-4 border-b border-slate-900/10 lg:hidden dark:border-slate-50/[0.06] w-full">

                <Sheet>
                    <SheetTrigger asChild>
                        <button type="button" className="text-slate-500 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-300">
                            <span className="sr-only">Navigation</span>
                            <svg width={24} height={24}>
                                <path d="M5 6h14M5 12h14M5 18h14" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
                            </svg>
                        </button>
                    </SheetTrigger>
                    <SheetContent className="pt-12">
                        <SidebarContent />
                    </SheetContent>
                </Sheet>
                <ol className="ml-4 flex text-sm font-semibold leading-6 whitespace-nowrap min-w-0 capitalize">
                    {/* {pathname.split("/").slice(1).join(" / ") || "Home"} */}
                    {pathname.split("/").slice(1).map((item, index) => {
                        return (
                            <li key={index} className={cn("flex items-center text-slate-900 ", index !== 0 && "truncate")}>
                                {item}
                                {index !== pathname.split("/").length - 1 && (
                                    <svg width={3} height={6} aria-hidden="true" className="mx-3 overflow-visible text-slate-600">
                                        <path d="M0 0L3 3L0 6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    </svg>
                                )}
                            </li>
                        );
                    })}
                </ol>
            </div>


        </div>)
}