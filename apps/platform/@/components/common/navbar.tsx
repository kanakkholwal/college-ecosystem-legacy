"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Bug, Cloud, LogOut, UserRound } from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BsInstagram } from "react-icons/bs";
import { FiLinkedin } from "react-icons/fi";
import { LuGithub } from "react-icons/lu";
import { RiTwitterXFill } from "react-icons/ri";
import type { Session } from "~/lib/auth-client";
import { authClient } from "~/lib/auth-client"; 
import type { SidenavLinkType } from "./sidebar";
import { SidebarContent } from "./sidebar";


interface NavbarProps {
  user: Session["user"];
  showBreadcrumbs?: boolean;
  sidebarLinks?: SidenavLinkType[];
}
interface SocialLink {
  href: string;
  icon: React.ElementType;
}

export default function Navbar({
  user,
  showBreadcrumbs = false,
  sidebarLinks,
}: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div
      className={cn(
        "sticky marker:lg:static left-0 top-0 lg:top-5 lg:mt-5 z-50 inset-inline-0 mx-auto w-full lg:px-6 lg:rounded-full lg:overflow-hidden backdrop-blur-2xl lg:bg-white/20 border-gray-300/50 bg-gradient-to-b from-primary/5 "
      )}
    >
      <nav
        className={cn(
          "mx-auto w-full p-4 lg:py-2 lg:border border-b border-slate-900/5",
          "flex items-center justify-between font-bold text-xl"
        )}
      >
        <Link
          href="/"
          className="relative bg-gradient-to-r from-primary to-sky-500 bg-clip-text text-transparent hover:from-sky-500 hover:to-primary lg:text-xl whitespace-nowrap"
        >
          {process.env.NEXT_PUBLIC_WEBSITE_NAME}
        </Link>
        <div className="flex items-center gap-5">
          <div className="items-center gap-5 hidden sm:inline-flex">
            {socials.map((link) => {
              return (
                <Link
                  href={link.href}
                  target="_blank"
                  key={link.href}
                  className="hover:text-primary hover:-translate-y-1 ease-in duration-300 flex justify-center items-center h-16 icon "
                >
                  <link.icon className="w-5 h-5" />
                </Link>
              );
            })}
          </div>

          <div className="border-r border-gray-300 dark:border-neutral-800 h-8 hidden lg:block" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="link"
                size="icon"
                rounded="full"
              >
                <Avatar>
                  <AvatarImage src={user.image as string} alt={user.username} className="size-8 rounded-full" />
                  <AvatarFallback className="!hover:no-underline">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" side="bottom" align="end">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  {/* <p className="block md:hidden text-sm font-medium leading-none">{user.name}</p> */}
                  <p className="text-xs capitalize leading-none text-primary md:font-medium ">
                    {user.name.toLowerCase()}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground ">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                {user.other_roles.includes("student") && (
                  <DropdownMenuItem asChild>
                    <Link href={`/results/${user.username}`}>
                      <UserRound className="mr-2 h-4 w-4" />
                      <span>Your Result</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                {user.role === "admin" && (
                  <DropdownMenuItem asChild>
                    <Link href={"/admin"}>
                      <UserRound className="mr-2 h-4 w-4" />
                      <span>Admin Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                {user.other_roles.map((role) => {
                  return (
                    <DropdownMenuItem asChild key={role}>
                      <Link href={`/${role}`}>
                        <UserRound className="mr-2 h-4 w-4" />
                        <span className="capitalize">{role} Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                  );
                })}
                <DropdownMenuItem asChild>
                  <Link
                    href={
                      "https://github.com/kanakkholwal/college-ecosystem/issues"
                    }
                    target="_blank"
                  >
                    <Bug className="mr-2 h-4 w-4" />
                    <span>Report an issue</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href={
                      "https://forms.gle/u2ptK12iRVdn5oXF7"
                    }
                    target="_blank"
                  >
                    <Bug className="mr-2 h-4 w-4" />
                    <span>
                      Give an feedback
                    </span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="https://forms.gle/v8Angn9VCbt9oVko7"
                    target="_blank"
                  >
                    <Bug className="mr-2 h-4 w-4" />
                    <span>
                      Suggest a feature
                    </span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled>
                <Cloud className="mr-2 h-4 w-4" />
                <span>API</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={async () => {
                  await authClient.signOut({
                    fetchOptions: {
                      onSuccess: () => {
                        router.push("/sign-in"); // redirect to login page
                      },
                    },
                  });
                }}
                className="cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
      {!showBreadcrumbs && !sidebarLinks ? null : (
        <div className="flex items-center p-4 border-b border-slate-900/10 lg:hidden dark:border-slate-50/[0.06] w-full">
          {sidebarLinks && sidebarLinks.length > 0 && (
            <Sheet>
              <SheetTrigger asChild>
                <button
                  type="button"
                  className="text-slate-500 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-300"
                >
                  <span className="sr-only">Navigation</span>
                  {/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
                  <svg width={24} height={24}>
                    <path
                      d="M5 6h14M5 12h14M5 18h14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </SheetTrigger>
              <SheetContent className="pt-12">
                <SidebarContent sidebarLinks={sidebarLinks} />
              </SheetContent>
            </Sheet>
          )}
          {showBreadcrumbs && (
            <ol className="ml-4 flex text-sm font-semibold leading-6 whitespace-nowrap min-w-0 capitalize">
              {/* {pathname.split("/").slice(1).join(" / ") || "Home"} */}
              {pathname
                .split("/")
                .slice(1)
                .map((item: string, index: number) => {
                  return (
                    <li
                      key={item.concat(index.toString())}
                      className={cn(
                        "flex items-center text-slate-900 ",
                        index !== 0 && "truncate"
                      )}
                    >
                      {item}
                      {index !== pathname.split("/").length - 1 && (
                        <svg
                          width={3}
                          height={6}
                          aria-hidden="true"
                          className="mx-3 overflow-visible text-slate-600"
                        >
                          <path
                            d="M0 0L3 3L0 6"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                        </svg>
                      )}
                    </li>
                  );
                })}
            </ol>
          )}
        </div>
      )}
    </div>
  );
}

const socials: SocialLink[] = [
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
