import EmptyArea from "@/components/common/empty-area";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Suspense } from "react";
import { GrAnnounce } from "react-icons/gr";

import { getAnnouncements } from "src/lib/announcement/actions";
import AnnouncementsList from "./list";

import { Badge } from "@/components/ui/badge";
import { Tabs, VercelTabsList } from "@/components/ui/tabs";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { RELATED_FOR_TYPES } from "~/models/announcement";
import { changeCase } from "~/utils/string";

export const metadata: Metadata = {
  title: `Announcements `,
  description: "Check the latest announcements here.",
};

export default async function AnnouncementsPage(props: {
  searchParams: Promise<{ category?: string }>;
}) {
  // const session = await getSession() as sessionType;
  const searchParams = await props.searchParams;
  const category = searchParams.category || RELATED_FOR_TYPES[0];
  const announcements = await getAnnouncements();
  console.log(announcements);

  return (
    <div className="">
      <Tabs defaultValue={category} className="w-full grid gap-4">
        <VercelTabsList
          tabs={[
            {
              label: "All",
              id: "all",
            },
            ...RELATED_FOR_TYPES.map((category) => ({
              label: changeCase(category, "camel_to_title"),
              id: category,
            })),
          ]}
          onTabChangeQuery="category"
        />
        <div className="w-full max-w-2xl mx-1.5 lg:mx-auto flex justify-between items-center gap-2 bg-card px-2 lg:px-4 py-1 lg:py-2 rounded-lg border">
          <h3 className="text-base font-medium">
            Announcements
            <Badge size="sm" className="ml-2">
              {(RELATED_FOR_TYPES.includes(category as any) ?
                announcements.filter(
                  (announcement) =>
                    announcement.relatedFor === category
                ) : announcements).length}
            </Badge>
          </h3>
          <Button variant="link" size="sm" asChild>
            <Link href="/announcements/create">
              Create Announcement
              <ArrowRight />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-4 columns-1 snap-y snap-mandatory px-2 lg:px-4 w-full max-w-2xl mx-auto">
          {announcements.length === 0 && (
            <EmptyArea
              icons={[GrAnnounce]}
              title="No announcements"
              description="There are no announcements at the moment."
            />
          )}
          <Suspense fallback={<div>Loading...</div>}>
            <AnnouncementsList announcements={
              RELATED_FOR_TYPES.includes(category as any) ?
                announcements.filter(
                  (announcement) =>
                    announcement.relatedFor === category
                ) : announcements
            } />
          </Suspense>
        </div>
      </Tabs>


    </div>
  );
}
