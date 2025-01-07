"use client";
import ProfileDropdown from "@/components/common/profile-dropdown";
import { cn } from "@/lib/utils";
import Link from "next/link";
import type { Session } from "~/lib/auth-client";


interface NavbarProps {
  user: Session["user"];
}


export default function Navbar({
  user
}: NavbarProps) {

  return (
    <div
      className={cn(
        "sticky marker:lg:static left-0 top-0 lg:top-5 lg:mt-5 z-50 inset-inline-0 mx-auto w-full max-w-[720px] lg:px-6 lg:rounded-full lg:overflow-hidden ",
        "backdrop-blur-2xl lg:bg-white/20 lg:border lg:border-gray-300 bg-gradient-to-b from-primary/5"
      )}
    >
      <nav
        className={cn(
          "mx-auto w-full p-4 lg:py-2",
          "flex items-center justify-between font-bold text-xl"
        )}
      >
        <Link
          href="/"
          className="relative bg-gradient-to-r from-primary to-sky-500 bg-clip-text text-transparent hover:from-sky-500 hover:to-primary lg:text-xl whitespace-nowrap"
        >
          {process.env.NEXT_PUBLIC_WEBSITE_NAME}
        </Link>
        <div className="ml-auto">
          <ProfileDropdown user={user} />
        </div>
      </nav>
    </div>
  );
}


