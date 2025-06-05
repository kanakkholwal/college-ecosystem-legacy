import Image from "next/image";
import Link from "next/link";
import { CATEGORIES } from "~/constants/community";

import { Button } from "@/components/ui/button";
import { SortAsc, TrendingUpIcon } from "lucide-react";
import type { Metadata } from "next";
import { RiCommunityLine } from "react-icons/ri";

export const metadata: Metadata = {
  title: {
    default: "Communities",
    template: "%s | Communities",
  },
  description: "Explore different communities",
};

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 min-h-screen">
      {/* Sidebar */}
      <aside className="hidden md:block md:col-span-1 space-y-4 sticky top-4 h-fit">
        <div className="bg-card rounded-2xl shadow p-4">
          <h2 className="text-base font-medium mb-2">Communities</h2>
          <div className="space-y-1 text-sm grid-cols-1 gap-1 ">
            <Button
              variant="ghost"
              size="sm"
              width="full"
              className="justify-start"
              asChild
            >
              <Link href="/community" shallow>
                <RiCommunityLine />
                All Posts
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              width="full"
              className="justify-start"
              asChild
            >
              <Link href="/community?sort=popular" shallow>
                <TrendingUpIcon />
                Popular Posts
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              width="full"
              className="justify-start"
              asChild
            >
              <Link href="/community?sort=recent" shallow>
                <SortAsc />
                Recent Posts
              </Link>
            </Button>
          </div>
        </div>
        <div className="bg-card rounded-2xl shadow p-4">
          <h2 className="text-base font-medium mb-2">Popular Communities</h2>
          <div className="text-sm grid grid-cols-1 gap-1">
            {CATEGORIES.map((category) => {
              return (
                <Link
                  key={category.value}
                  href={`/community?c=${category.value}`}
                  className="hover:bg-muted hover:text-foreground cursor-pointer py-1 px-2 rounded-lg inline-flex items-center gap-1.5 text-muted-foreground text-sm"
                >
                  <Image
                    src={category.image}
                    alt={category.description}
                    width={24}
                    height={24}
                    className="inline-block rounded-full size-5 object-contain"
                  />
                  c/{category.name}
                </Link>
              );
            })}
          </div>
        </div>
      </aside>

      {children}
    </div>
  );
}
