import { Button } from "@/components/ui/button";
import CreateCommunityPost from "./form";

import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: `Create Community Post`,
  description: "Create a post in the community",
};

export default function CreateCommunityPostPage() {
  return (
    <main className="md:col-span-3 space-y-4 pr-2">
      <div className="bg-card w-full rounded-lg inline-flex justify-between items-center gap-3 px-2 lg:px-4 py-1 lg:py-2">
        <h3 className="text-base font-medium">Create Community Post</h3>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/community">
            <ArrowLeft />
            Back to Community
          </Link>
        </Button>
      </div>
      <CreateCommunityPost />
    </main>
  );
}
