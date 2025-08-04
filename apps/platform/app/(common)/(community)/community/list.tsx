import { UserPreview } from "@/components/application/user-preview";
import EmptyArea from "@/components/common/empty-area";
import ShareButton from "@/components/common/share-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { ArrowRight, Bookmark, Dot, Eye, Share } from "lucide-react";
import Link from "next/link";
import { BiUpvote } from "react-icons/bi";
import { GrAnnounce } from "react-icons/gr";
import Markdown from 'react-markdown';
import type { CommunityPostTypeWithId } from "src/models/community";
import { CATEGORY_IMAGES } from "~/constants/common.community";
import { appConfig } from "~/project.config";
import { formatNumber } from "~/utils/number";

export default function CommunityPostList({
  posts,
}: {
  posts: CommunityPostTypeWithId[];
}) {
  if (posts.length === 0) {
    return (
      <EmptyArea
        icons={[GrAnnounce]}
        title="No community posts"
        description="There are no community posts at the moment."
      />
    );
  }
  return (
    <div className="grid grid-cols-1 gap-4 w-full">
      {posts.map((post) => {
        return (
          <div
            key={post._id}
            className="w-full mx-auto rounded-lg bg-card backdrop-blur-md p-3 lg:p-5 grid grid-cols-1 space-y-4"
          >
            <div className="inline-flex items-center gap-2">
              <Avatar className="size-6 rounded-full">
                <AvatarImage
                  alt={post.author.username}
                  width={20}
                  height={20}
                  src={
                    CATEGORY_IMAGES[post.category]
                      ? CATEGORY_IMAGES[post.category]
                      : `https://api.dicebear.com/5.x/initials/svg?seed=${post.category}`
                  }
                />
                <AvatarFallback>
                  {post.category.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <p className="text-xs text-muted-foreground">
                <Link
                  href={`/community?c=${post.category}`}
                  className="hover:underline hover:text-primary font-medium"
                >
                  c/{post.category}
                </Link>
                <Dot className="inline-block -mx-1" />
                <span>
                  {formatDistanceToNow(new Date(post.createdAt), {
                    addSuffix: true,
                  })}
                </span>
                <Dot className="inline-block -mx-1" />
                <UserPreview user={post.author}>
                  <span className="ml-1 text-primary hover:underline cursor-pointer">
                    {post.author.name}
                  </span>
                </UserPreview>
              </p>
            </div>
            <h3 className="text-base font-medium">{post.title}</h3>
            <article className="border py-4  max-w-full prose prose-sm dark:prose-invert text-muted-foreground text-xs pl-2 bg-muted/50 w-full rounded-lg">
              {/* show only 200 characters */}

              <Markdown>
                {post.content.slice(0, 200) +
                  (post.content.length > 200 ? "..." : "")}
              </Markdown>
            </article>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1 rounded-2xl bg-background px-3 py-1.5 [&>svg]:size-4 h-full">
                  <Eye />
                  <span className="text-xs font-medium text-muted-foreground">
                    {formatNumber(post.views)}
                    {post.views < 1 ? " View" : " Views"}
                  </span>
                </div>
                <div className="flex items-center gap-1 rounded-2xl bg-background px-3 py-1.5 [&>svg]:size-4 h-full">
                  <BiUpvote />
                  <span className="text-xs font-medium text-muted-foreground">
                    {formatNumber(post.likes.length)}
                    {post.likes.length < 1 ? " Like" : " Likes"}
                  </span>
                </div>
                <div className="flex items-center gap-1 rounded-2xl bg-background px-3 py-1.5 [&>svg]:size-4 h-full">
                  <Bookmark />
                  <span className="text-xs font-medium text-muted-foreground">
                    {formatNumber(post.savedBy.length)}
                    {post.savedBy.length < 1 ? " Saved" : " Saves"}
                  </span>
                </div>
                <ShareButton
                  data={{
                    title: post.title,
                    text: "Check out this post on our community platform!",
                    url: appConfig.url + `/community/posts/${post._id}`,
                  }}

                  variant="ghost"
                  size="xs"
                  className="rounded-2xl bg-background flex items-center gap-1.5 h-full hover:ring-1 hover:ring-primary transition-all"

                >
                  <Share />
                  Share
                </ShareButton>
              </div>
              <div className="ml-auto">
                <Button variant="dark" size="sm" effect="shineHover" asChild>
                  <Link href={`/community/posts/${post._id}`}>
                    View Post
                    <ArrowRight />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
