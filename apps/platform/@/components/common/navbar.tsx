"use client";
import ProfileDropdown from "@/components/common/profile-dropdown";
import { SUPPORT_LINKS, getNavLinks, socials } from "@/constants/links";
import { cn } from "@/lib/utils";
import { ArrowUpRight, LogIn } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Session } from "~/lib/auth";
import { ApplicationInfo } from "../logo";
import { ButtonLink } from "../utils/link";
import { NavTabs } from "./nav-tabs";
import { ThemeSwitcher } from "./theme-switcher";

interface NavbarProps {
  user?: Session["user"];
}

export default function Navbar({ user }: NavbarProps) {
  const navLinks = getNavLinks(user);
  const pathname = usePathname();

  return (
    <header
      className={cn("z-50 w-full pb-2 transition-all", "bg-card border-b")}
    >
      <div className="w-full max-w-(--max-app-width) mx-auto flex items-center justify-between px-4 py-2">
        <Link
          href="/"
          className="relative bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent hover:from-secondary hover:to-primary lg:text-xl whitespace-nowrap"
        >
          <ApplicationInfo/>
        </Link>
        <div className="ml-auto flex gap-2 items-center">
          <ThemeSwitcher />
          {user ? <ProfileDropdown user={user} /> : 
          <ButtonLink 
          size="sm" rounded="full"
          href={`/sign-in?next=${pathname}`}
          variant="rainbow">
            Log In
            <LogIn />
          </ButtonLink>
          }
        </div>
      </div>
      <div className="w-full max-w-(--max-app-width) mx-auto">
        <NavTabs
          navLinks={navLinks.map((link) => ({
            id: link.href,
            href: link.href,
            children: (
              <>
                {link.Icon && <link.Icon className="size-4" />}
                {link.title}
              </>
            ),
            items: link.items,
          }))}
        />
      </div>
    </header>
  );
}

export function SocialBar() {
  return (
    <div className="inline-flex flex-row items-center empty:hidden gap-3 mx-auto">
      {socials.map((link) => {
        return (
          <Link
            href={link.href}
            target="_blank"
            key={link.href}
            className={cn(
              "inline-flex items-center justify-center rounded-md text-sm font-medium disabled:pointer-events-none disabled:opacity-50 p-1.5 [&_svg]:size-5 size-8 icon text-muted-foreground md:[&_svg]:size-4.5",
              "hover:bg-muted hover:text-primary hover:-translate-y-1 ease-in transition-all duration-300 flex justify-center items-center"
            )}
          >
            <link.icon />
          </Link>
        );
      })}
    </div>
  );
}

export function SupportBar() {
  return (
    <div className="inline-flex flex-wrap items-center empty:hidden gap-2 justify-center md:justify-start">
      {SUPPORT_LINKS.map((link) => {
        return (
          <Link
            href={link.href}
            target="_blank"
            key={link.href}
            className={cn(
              "group inline-flex items-center gap-1 p-2 text-muted-foreground transition-colors hover:text-primary data-[active=true]:text-primary [&_svg]:size-4 text-xs font-medium"
            )}
          >
            {link.title}
            <ArrowUpRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        );
      })}
    </div>
  );
}
