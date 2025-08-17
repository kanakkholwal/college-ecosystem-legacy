import CreateAnnouncement from "./form";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: `Create Announcement`,
  description: "Create an announcement here",
};

export default function CreateAnnouncementPage() {
  return (
    <>
      <div className="bg-card rounded-lg py-2 px-3 mx-2 max-w-3xl w-full md:mx-auto mt-8">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/announcements">
            <ArrowLeft />
            Back to Announcements
          </Link>
        </Button>
      </div>
      <CreateAnnouncement />
    </>
  );
}
