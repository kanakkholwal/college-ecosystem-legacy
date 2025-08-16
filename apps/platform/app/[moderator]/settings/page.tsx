import { ResponsiveContainer } from "@/components/common/container";
import { RouterCard } from "@/components/common/router-card";
//   import Image from "next/image";
import { Moon, UserRoundCog } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings",
  description: "Settings page",
};
const list = [
  {
    label: "Appearance",
    description: "Customize the look and feel of the application",
    icon: Moon,
    href: "settings/appearance",
  },
  {
    label: "Account",
    description: "Manage your account settings",
    icon: UserRoundCog,
    href: "settings/account",
  },
  // {
  //   label: "Integrations",
  //   description: "Manage your integrations",
  //   icon: Workflow,
  //   href: "settings/integrations",
  // },
] as const;

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ moderator: string }>;
}) {
  const { moderator } = await params;
  return (
    <ResponsiveContainer className="p-3 @3xl:grid-cols-2  @5xl:grid-cols-3">
      {list.map((link, index) => {
        return (
          <RouterCard
            key={link.href}
            href={`/${moderator}/${link.href}`}
            data-aos="fade-up"
            data-aos-delay={index * 100}
            data-aos-offset="200"
            title={link.label}
            description="Click to navigate"
            Icon={link.icon}
          />
        );
      })}
    </ResponsiveContainer>
  );
}
