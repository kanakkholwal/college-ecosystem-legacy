"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import { socials } from "@/constants/links";
import { Home, LogOut, UserRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Session } from "~/lib/auth-client";
import { authClient } from "~/lib/auth-client";
import { Separator } from "../ui/separator";
import { changeCase } from "~/utils/string";

interface ProfileDropdownProps {
  user: Session["user"];
}

export default function ProfileDropdown({ user }: ProfileDropdownProps) {
  const router = useRouter();

  const links = [
    ...[
      user.other_roles.includes("student")
        ? {
            Icon: UserRound,
            href: `/results/${user.username}`,
            title: "Your Result",
          }
        : null,
    ],
    ...[
      user.role === "admin"
        ? {
            Icon: UserRound,
            href: "/admin",
            title: "Admin Dashboard",
          }
        : null,
    ],
    ...user.other_roles.map((role) => ({
      Icon: UserRound,
      href: `/${role}`,
      title: `${role} Dashboard`,
    })),
  ].filter((elem) => elem !== null);

  return (
    <ResponsiveDialog
      title={"Your Profile"}
      description="How you appear across the platform"
      btnProps={{
        size: "icon",
        rounded: "full",
        variant: "outline",
        children: (
          <Avatar className="size-8 rounded-full">
            <AvatarImage
              alt={user.username}
              width={32}
              height={32}
              src={
                user.image
                  ? user.image
                  : `https://api.dicebear.com/5.x/initials/svg?seed=${user.name}`
              }
              // src={
              //   user.image
              //     ? (user.image as string)
              //     : user.gender !== "non_specified"
              //       ? `/assets/avatars/${user.gender}_user.png`
              //       : ""
              // }
            />
            <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
        ),
      }}
    >
      <div className="flex gap-4 mx-auto">
        <Avatar className="size-16 rounded-full bg-muted">
          <AvatarImage
            src={
              user.image
                ? user.image
                : `https://api.dicebear.com/5.x/initials/svg?seed=${user.name}`
            }
            alt={user.username}
            className="size-16"
          />
          <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col justify-center items-start">
          <h4 className="text-muted-foreground font-bold tracking-wide text-lg">
            {user.name}
          </h4>
          <p className="text-muted-foreground font-medium text-base">
            {user.email}
          </p>
          <p>
            <span className="rounded-md px-2 py-1 text-xs font-medium capitalize bg-primary/30 text-primary whitespace-nowrap">
              {user.department}
            </span>
          </p>
        </div>
      </div>
      <Separator className="my-3" />
      <div className="grid grid-cols-2 gap-2 flex-wrap mx-auto">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link?.href || ""}
            className="rounded-md h-8 px-3 py-2 inline-flex justify-start gap-2 items-center text-sm font-medium capitalize border bg-muted text-muted-foreground hover:border-primary hover:text-primary whitespace-nowrap"
          >
            {link.Icon && <link.Icon className="size-3 inline-block" />}
            <span className="truncate">{changeCase(link.title, "title")}</span>
          </Link>
        ))}
      </div>
      <Separator className="my-2" />

      <div className="flex flex-row gap-2 flex-wrap">
        {SUPPORT_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link?.href || ""}
            className="rounded-md px-3 py-1 text-xs font-medium capitalize bg-muted text-muted-foreground hover:text-primary whitespace-nowrap"
          >
            {link.title}
          </Link>
        ))}
      </div>
      <div className="flex items-center justify-between gap-4 w-full flex-wrap mt-2">
        <div className="flex gap-2">
          {socials.map((link) => {
            return (
              <Link
                href={link.href}
                target="_blank"
                key={link.href}
                className="hover:text-primary hover:-translate-y-1 ease-in duration-300 flex justify-center items-center h-12 icon"
              >
                <link.icon className="size-4" />
              </Link>
            );
          })}
        </div>
        <div className="flex gap-2">
          <Button variant="default_light" size="sm" asChild>
            <Link href="/">
              <Home />
              Go to Home
            </Link>
          </Button>
          <Button
            variant="default_light"
            size="sm"
            onClick={async () => {
              await authClient.signOut({
                fetchOptions: {
                  onSuccess: () => {
                    router.push("/sign-in"); // redirect to login page
                  },
                },
              });
            }}
          >
            <LogOut />
            Log out
          </Button>
        </div>
      </div>
    </ResponsiveDialog>
  );
}

const SUPPORT_LINKS = [
  {
    href: "https://github.com/kanakkholwal/college-ecosystem",
    title: "Contribute to this project",
  },
  {
    href: "https://github.com/kanakkholwal/college-ecosystem/issues",
    title: "Report an issue",
  },
  {
    href: "https://forms.gle/u2ptK12iRVdn5oXF7",
    title: "Give a feedback",
  },
  {
    href: "https://forms.gle/v8Angn9VCbt9oVko7",
    title: "Suggest a feature",
  },
];
