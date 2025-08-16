"use client";

import { UserPreview } from "@/components/application/user-preview";
import EmptyArea from "@/components/common/empty-area";
import ShareButton from "@/components/common/share-button";
import { Icon } from "@/components/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { ArrowRight, Dot } from "lucide-react";
import Link from "next/link";
import { startTransition, useOptimistic } from "react";
import { GrAnnounce } from "react-icons/gr";
import Markdown from "react-markdown";
import type { CommunityPostTypeWithId } from "src/models/community";
import { updatePost } from "~/actions/common.community"; // server action
import type { Session } from "~/auth";
import { CATEGORY_IMAGES } from "~/constants/common.community";
import { appConfig } from "~/project.config";
import { formatNumber } from "~/utils/number";

export default function CommunityPostList({
  posts,
  user,
}: {
  posts: CommunityPostTypeWithId[];
  user?: Session["user"];
}) {
  const [optimisticPosts, setOptimisticPosts] = useOptimistic(
    posts,
    (
      state,
      action: { type: "toggleLike" | "toggleSave"; id: string; userId: string }
    ) => {
      return state.map((p) => {
        if (p._id !== action.id) return p;

        if (action.type === "toggleLike") {
          const liked = p.likes.includes(action.userId);
          return {
            ...p,
            likes: liked
              ? p.likes.filter((uid) => uid !== action.userId)
              : [...p.likes, action.userId],
          };
        }

        if (action.type === "toggleSave") {
          const saved = p.savedBy.includes(action.userId);
          return {
            ...p,
            savedBy: saved
              ? p.savedBy.filter((uid) => uid !== action.userId)
              : [...p.savedBy, action.userId],
          };
        }

        return p;
      });
    }
  );

  if (optimisticPosts.length === 0) {
    return (
      <EmptyArea
        icons={[GrAnnounce]}
        title="No community posts"
        description="There are no community posts at the moment."
      />
    );
  }

  const handleToggle = (postId: string, type: "toggleLike" | "toggleSave") => {
    if (!user?.id) return;
    startTransition(() => {
      setOptimisticPosts({ type, id: postId, userId: user.id });
      updatePost(postId, { type });
    });
  };

  return (
    <div className="grid grid-cols-1 gap-4 w-full">
      {optimisticPosts.map((post) => (
        <div
          key={post._id}
          className="w-full mx-auto rounded-lg backdrop-blur-md lg:p-5 bg-card border border-border p-4 flex flex-col gap-4"
        >
          <div className="flex items-center justify-between gap-4 card-header">
            <div className="flex items-center gap-4">
              <Avatar className="size-8 rounded-full">
                <AvatarImage
                  alt={post.author.username}
                  width={35}
                  height={25}
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
              <div className="h-10 grid grid-cols-1 -gap-1">
                <Link
                  href={`/community?c=${post.category}`}
                  className="hover:underline hover:text-primary font-medium text-sm"
                >
                  c/{post.category}
                </Link>
                <p className="flex items-center gap-1 opacity-70 text-sm">
                  <UserPreview user={post.author}>
                    <small className="hover:underline cursor-pointer">
                      @{post.author.username}
                    </small>
                  </UserPreview>
                  <Dot className="inline-block -mx-1" />
                  <small>
                    {formatDistanceToNow(new Date(post.createdAt), {
                      addSuffix: true,
                    })}
                  </small>
                </p>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-base font-medium">{post.title}</h3>
            <Badge size="sm">
              <Icon name="trend-up" />
              {formatNumber(post.views)} impressions
            </Badge>
          </div>
          <article className="max-w-full prose prose-sm dark:prose-invert text-muted-foreground pl-2 w-full rounded-lg whitespace-pre-wrap truncate">
            <Markdown>
              {post.content.slice(0, 300) +
                (post.content.length > 300 ? "..." : "")}
            </Markdown>
          </article>

          <div className="flex items-center gap-3">
            <div className="flex items-center justify-between gap-2">
              <button
                onClick={() => handleToggle(post._id, "toggleLike")}
                className="flex grow items-center justify-center gap-3 rounded-md px-4 py-2 transition hover:bg-accent"
              >
                <Icon
                  name={
                    user && post.likes.includes(user.id)
                      ? "heart"
                      : "heart-empty"
                  }
                  className={cn(
                    "size-4",
                    user && post.likes.includes(user.id) && "text-red-500"
                  )}
                />
                <span className="inline font-medium opacity-90 text-[14px] transition hover:opacity-100">
                  {formatNumber(post.likes.length)}
                  <span className="max-sm:hidden">
                    {post.likes.length < 1 ? " Like" : " Likes"}
                  </span>
                </span>
              </button>

              <button
                onClick={() => handleToggle(post._id, "toggleSave")}
                className="flex grow items-center justify-center gap-3 rounded-md px-4 py-2 transition hover:bg-accent"
              >
                <Icon
                  name={
                    user && post.savedBy.includes(user.id)
                      ? "bookmark-check"
                      : "bookmark"
                  }
                  className={cn(
                    "size-4",
                    user && post.savedBy.includes(user.id) && "text-emerald-500"
                  )}
                />
                <span className="inline font-medium opacity-90 text-[14px] transition hover:opacity-100">
                  {formatNumber(post.savedBy.length)}
                  <span className="max-sm:hidden">
                    {post.savedBy.length < 1 ? " Saved" : " Saves"}
                  </span>
                </span>
              </button>

              <ShareButton
                data={{
                  title: post.title,
                  text: "Check out this post on our community platform!",
                  url: appConfig.url + `/community/posts/${post._id}`,
                }}
                variant="ghost"
                size="xs"
                className="flex grow items-center justify-center gap-3 rounded-md px-4 py-2 transition hover:bg-accent h-full"
              >
                <Icon name="send" />
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
      ))}
    </div>
  );
}
