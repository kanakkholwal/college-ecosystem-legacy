import { GrAnnounce } from "react-icons/gr";
import CreateAnnouncement from "./form";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: `Create Announcement`,
  description: "Create an announcement here",
};

export default async function CreateAnnouncementPage() {
  return (
    <>
      <div className="bg-card backdrop-blur-lg mt-5 rounded-lg p-4 @container/polls max-w-5xl w-full mx-auto space-y-8">
        <Button variant="link" size="sm" asChild>
          <Link href="/announcements">
            <ArrowLeft />
            Back to Announcements
          </Link>
        </Button>
        <h3 className="text-xl font-semibold">
          <GrAnnounce className="size-5 mr-2 inline-block" />
          Create Announcement
        </h3>
        <CreateAnnouncement />
      </div>
    </>
  );
}
