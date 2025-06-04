import CreateCommunityPost from "./form";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Create Community Post`,
  description: "Create a post in the community",
};

export default function CreateCommunityPostPage() {
  return (
    <main className="md:col-span-3 space-y-4 pr-2">
      <div className="bg-card backdrop-blur-lg mt-5 rounded-lg p-4 @container/community m-3">
        <div className="w-full flex justify-between items-baseline whitespace-nowrap gap-2">
          <h3 className="text-xl font-semibold">Create Community Post</h3>
        </div>
      </div>
      <CreateCommunityPost />
    </main>
  );
}
