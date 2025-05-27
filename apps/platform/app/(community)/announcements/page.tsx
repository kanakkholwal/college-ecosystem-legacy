import EmptyArea from "@/components/common/empty-area";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Suspense } from "react";
import { GrAnnounce } from "react-icons/gr";

import { getAnnouncements } from "src/lib/announcement/actions";
import AnnouncementsList from "./list";

import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { RELATED_FOR_TYPES } from "~/models/announcement";
import { changeCase } from "~/utils/string";

export const metadata: Metadata = {
  title: `Announcements | ${process.env.NEXT_PUBLIC_WEBSITE_NAME}`,
  description: "Check the latest announcements here.",
};

export default async function AnnouncementsPage() {
  // const session = await getSession() as sessionType;
  const announcements = await getAnnouncements();
  console.log(announcements);

  return (
    <div className="max-w-6xl mx-auto w-full px-4 py-10 flex gap-5 flex-col md:flex-row relative">
      <main className="flex flex-col gap-5 w-full md:max-w-3/4">
        <div className="w-full flex justify-between items-center gap-2 mb-10 bg-card p-4 rounded-lg">
          <h3 className="text-lg font-medium">Announcements</h3>
          <Button variant="link" size="sm" asChild>
            <Link href="/announcements/create">
              Create Announcement
              <ArrowRight />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-4 columns-1 snap-y snap-mandatory p-4">
          {announcements.length === 0 && (
            <EmptyArea
              icons={[GrAnnounce]}
              title="No announcements"
              description="There are no announcements at the moment."
            />
          )}
          <Suspense fallback={<div>Loading...</div>}>
            <AnnouncementsList announcements={announcements} />
          </Suspense>
        </div>
      </main>
      <aside className="space-y-5 p-4 rounded-lg bg-card md:w-1/4 h-fit md:sticky md:top-24">
        <div className="text-base font-medium text-card-foreground whitespace-nowrap border-b border-border pb-3 flex items-center gap-2">
          <GrAnnounce className="inline-block size-4" />
          Categories
        </div>
        <div className="grid grid-cols-1 gap-1">
          {RELATED_FOR_TYPES.map((category) => (
            <Link
              key={category}
              className="px-4 py-1 rounded-md border-l border-border text-sm text-muted-foreground font-medium hover:text-primary hover:pl-2 hover:bg-primary/5 hover:border-primary transition-all"
              href={`/announcements?c=${category}`}
              shallow={true}
            >
              {changeCase(category, "camel_to_title")}
            </Link>
          ))}
        </div>
      </aside>
    </div>
  );
}
