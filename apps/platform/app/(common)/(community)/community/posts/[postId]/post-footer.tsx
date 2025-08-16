"use client";

import ShareButton from "@/components/common/share-button";
import { Icon } from "@/components/icons";
import { cn } from "@/lib/utils";
import { Bookmark, BookmarkCheck, Eye, Share, ThumbsUp } from "lucide-react";
import { useOptimistic, useTransition } from "react";
import toast from "react-hot-toast";
import type { CommunityPostTypeWithId } from "src/models/community";
import { updatePost } from "~/actions/common.community";
import type { Session } from "~/auth";
import { appConfig } from "~/project.config";
import { formatNumber } from "~/utils/number";

export default function PostFooterOptimistic({
  post,
  user,
}: {
  post: CommunityPostTypeWithId;
  user?: Session["user"];
}) {
  const [isPending, startTransition] = useTransition();

  // Optimistic state — toggles instantly on UI
  const [optimisticPost, setOptimisticPost] = useOptimistic(
    post,
    (current, action: { type: "toggleLike" | "toggleSave"; userId: string }) => {
      if (action.type === "toggleLike") {
        const liked = current.likes.includes(action.userId);
        return {
          ...current,
          likes: liked
            ? current.likes.filter((id) => id !== action.userId)
            : [...current.likes, action.userId],
        };
      }
      if (action.type === "toggleSave") {
        const saved = current.savedBy.includes(action.userId);
        return {
          ...current,
          savedBy: saved
            ? current.savedBy.filter((id) => id !== action.userId)
            : [...current.savedBy, action.userId],
        };
      }
      return current;
    }
  );

  const handleLike = () => {
    if (!user?.id) return;
    startTransition(() => {
      setOptimisticPost({ type: "toggleLike", userId: user.id });
      void updatePost(post._id, { type: "toggleLike" })
        .catch((error) => {
          toast.error("Failed to update post: " + error.message);
          console.error("Failed to update post:", error);
        });
    });
  };

  const handleSave = () => {
    if (!user?.id) return;
    startTransition(() => {
      setOptimisticPost({ type: "toggleSave", userId: user.id });
      void updatePost(post._id, { type: "toggleSave" })
        .catch((error) => {
          toast.error("Failed to update post: " + error.message);
          console.error("Failed to update post:", error);
        })
    });
  };

  return (
    <div className="inline-flex items-center gap-3 w-full justify-between">
      <div className="flex gap-2 items-center h-7">
        {/* Views */}
        <div className="flex items-center gap-1 rounded-2xl bg-background px-3 py-1.5 [&>svg]:size-4 h-full">
          <Eye />
          <span className="text-xs font-medium text-muted-foreground">
            {formatNumber(optimisticPost.views)}
            {optimisticPost.views < 1 ? " View" : " Views"}
          </span>
        </div>

        {/* Like */}
        <div
          title="Like Post"
          aria-label="Like Post"
          className="rounded-2xl bg-background flex items-center gap-1.5 h-full hover:ring-1 hover:ring-primary transition-all"
        >
          <button
            onClick={handleLike}
            className={cn(
              user?.id &&
              optimisticPost.likes.includes(user.id) &&
              "text-primary bg-primary/10"
            )}
            disabled={isPending}
          >
            {isPending && optimisticPost.likes.includes(user?.id ?? "")
              ? <Icon name="loader-circle" className="animate-spin" />
              : <ThumbsUp />}
          </button>
          <span className="text-xs pr-2 font-medium text-muted-foreground">
            {formatNumber(optimisticPost.likes.length)}{" "}
            {optimisticPost.likes.length < 1 ? " Like" : " Likes"}
          </span>
        </div>

        {/* Save */}
        <div
          title="Bookmark Post"
          aria-label="Bookmark Post"
          className="rounded-2xl bg-background flex items-center gap-1.5 h-full hover:ring-1 hover:ring-primary transition-all"
        >
          <button
            onClick={handleSave}
            className={cn(
              "flex items-center gap-1 aspect-square h-full p-2 rounded-full text-xs [&>svg]:size-4 transition-all",
              "hover:text-primary hover:bg-primary/10 active:scale-95",
              user?.id &&
              optimisticPost.savedBy.includes(user.id) &&
              "text-primary bg-primary/10"
            )}
            disabled={isPending}
          >
            {optimisticPost.savedBy.includes(user?.id ?? "") ? (
              <BookmarkCheck />
            ) : (
              <Bookmark />
            )}
          </button>
          <span className="text-xs pr-2 font-medium text-muted-foreground">
            {formatNumber(optimisticPost.savedBy.length)}{" "}
            {optimisticPost.savedBy.length < 1 ? " Save" : " Saves"}
          </span>
        </div>

        {/* Share */}
        <ShareButton
          data={{
            title: optimisticPost.title,
            text: "Check out this post on our community platform!",
            url: appConfig.url + `/community/posts/${optimisticPost._id}`,
          }}
          variant="ghost"
          size="xs"
          className="rounded-2xl bg-background flex items-center gap-1.5 h-full hover:ring-1 hover:ring-primary transition-all"
        >
          <Share />
          Share
        </ShareButton>
      </div>
    </div>
  );
}
