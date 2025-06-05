import { Button } from "@/components/ui/button";
import EditCommunityPost from "./form";

import EmptyArea from "@/components/common/empty-area";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Session } from "~/lib/auth";
import { getSession } from "~/lib/auth-server";
import { getPostById } from "~/lib/community/actions";

interface Props {
  searchParams: Promise<{
    postId: string;
  }>;
}

export const metadata :Metadata = {
  title: `Edit Community Post`,
  description: "Edit a post in the community",
}

export default async function CommunityPostEditPage(props:Props) {
  const searchParams = await props.searchParams;
  if (!searchParams.postId) return notFound();
  const post = await getPostById(
    searchParams.postId,
    true
  );
  if (!post) return notFound();
  
  const session = await getSession() as Session;
  if (session.user.id !== post.author.id || session.user.role !== "admin") {
    return <EmptyArea
      title="Unauthorized"
      description="You are not authorized to edit this post."
      actionProps={{
        variant: "ghost",
        size: "sm",
        asChild: true,
        children: <Link href="/community">Back to Community</Link>
      }}
    />;
  }

  if (!post) return notFound();
  console.log(post);
  return (
    <main className="md:col-span-3 space-y-4 pr-2">
      <div className="bg-card w-full rounded-lg inline-flex justify-between items-center gap-3 px-2 lg:px-4 py-1 lg:py-2">
        <h3 className="text-base font-medium">
          Edit Post: {post.title}
        </h3>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/community">
            <ArrowLeft />
            Back to Community
          </Link>
        </Button>
      </div>
      <EditCommunityPost postId={post._id} post={post} />
    </main>
  );
}
