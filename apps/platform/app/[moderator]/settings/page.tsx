import { ResponsiveContainer } from "@/components/common/container";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
//   import Image from "next/image";
import { Moon, UserRoundCog, Workflow } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

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
    href: "/settings/account",
  },
  {
    label: "Integrations",
    description: "Manage your integrations",
    icon: Workflow,
    href: "settings/integrations",
  },
] as const;

export default async function SettingsPage() {
  return (
    <ResponsiveContainer className="p-4 @3xl:grid-cols-3  @5xl:grid-cols-3">
      {list.map((link, index) => {
        return (
          <Link
            key={link.href}
            href={link.href}
            data-aos="fade-up"
            data-aos-delay={index * 100}
            data-aos-offset="200"
          >
            <Card className="transition transform duration-300 hover:translate-x-1 hover:-translate-y-1 hover:shadow-lg cursor-pointer border p-10 h-full flex content-center flex-wrap">
              <div className="h-fit w-full">
                <div className="flex justify-center w-full">
                  <link.icon className="h-10 w-10" />
                </div>
                <CardTitle className="text-center mt-2">{link.label}</CardTitle>
                <CardDescription className="text-center mt-4">
                  {link.description}
                </CardDescription>
              </div>
            </Card>
          </Link>
        );
      })}
    </ResponsiveContainer>
  );
}
