import ProfileDropdown from "@/components/common/profile-dropdown";
import { SUPPORT_LINKS, getNavLinks, socials } from "@/constants/links";
import { cn } from "@/lib/utils";
import Link from "next/link";
import type { Session } from "~/lib/auth";
import { appConfig } from "~/project.config";
import { Button } from "../ui/button";


interface NavbarProps {
  user: Session["user"];
}

export default function Navbar({ user }: NavbarProps) {
  const navLinks = getNavLinks(user);
  return (
    <header
      className={cn(
        "z-40 w-full pb-2 transition-all",
        "bg-card border-b",
      )}
    >
      <div className="w-full max-w-(--max-app-width) mx-auto flex items-center justify-between px-4 py-2">
        <Link
          href="/"
          className="relative  font-bold text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent hover:from-secondary hover:to-primary lg:text-xl whitespace-nowrap"
        >
          {appConfig.name}
        </Link>
        <div className="ml-auto flex gap-2 items-center">
          <ProfileDropdown user={user} />
        </div>
      </div>
      <div className="w-full max-w-(--max-app-width) mx-auto justify-start flex gap-2 items-center px-4 overflow-hidden">
        {navLinks.map((navLink) => {
          return <Button key={navLink.href} variant="ghost" size="sm" asChild>
            <Link href={navLink.href}>
              {navLink.Icon && <navLink.Icon className="size-4" />}
              {navLink.title}
            </Link>
          </Button>
        })}

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
              "hover:bg-accent hover:text-primary hover:-translate-y-1 ease-in transition-all duration-300 flex justify-center items-center"
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
    <div className="inline-flex flex-wrap items-center empty:hidden gap-2 mx-auto justify-center md:justify-start">
      {SUPPORT_LINKS.map((link) => {
        return (
          <Link
            href={link.href}
            target="_blank"
            key={link.href}
            className={cn(
              "inline-flex items-center gap-1 p-2 text-muted-foreground transition-colors hover:text-primary data-[active=true]:text-primary [&_svg]:size-4 text-xs font-medium"
            )}
          >
            {link.title}
          </Link>
        );
      })}
    </div>
  );
}
