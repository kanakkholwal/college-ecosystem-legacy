"use client";

import ShareButton from "@/components/common/share-button";
import { Icon } from "@/components/icons";
import { cn } from "@/lib/utils";
import { Eye } from "lucide-react";
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
    (
      current,
      action: { type: "toggleLike" | "toggleSave"; userId: string }
    ) => {
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
      void updatePost(post._id, { type: "toggleLike" }).catch((error) => {
        toast.error("Failed to update post: " + error.message);
        console.error("Failed to update post:", error);
      });
    });
  };

  const handleSave = () => {
    if (!user?.id) return;
    startTransition(() => {
      setOptimisticPost({ type: "toggleSave", userId: user.id });
      void updatePost(post._id, { type: "toggleSave" }).catch((error) => {
        toast.error("Failed to update post: " + error.message);
        console.error("Failed to update post:", error);
      });
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
        <button
          onClick={handleLike}
          className="flex grow items-center justify-center gap-3 rounded-md px-4 py-2 transition hover:bg-accent"
        >
          <Icon
            name={
              user && optimisticPost.likes.includes(user.id)
                ? "heart"
                : "heart-empty"
            }
            className={cn(
              "size-4",
              user && optimisticPost.likes.includes(user.id) && "text-red-500"
            )}
          />
          <span className="inline font-medium opacity-90 text-[14px] transition hover:opacity-100">
            {formatNumber(optimisticPost.likes.length)}
            <span className="max-sm:hidden">
              {optimisticPost.likes.length < 1 ? " Like" : " Likes"}
            </span>
          </span>
        </button>

        {/* Save */}
        <button
          onClick={handleSave}
          className="flex grow items-center justify-center gap-3 rounded-md px-4 py-2 transition hover:bg-accent"
        >
          <Icon
            name={
              user && optimisticPost.savedBy.includes(user.id)
                ? "bookmark-check"
                : "bookmark"
            }
            className={cn(
              "size-4",
              user && optimisticPost.savedBy.includes(user.id) && "text-emerald-500"
            )}
          />
          <span className="inline font-medium opacity-90 text-[14px] transition hover:opacity-100">
            {formatNumber(optimisticPost.savedBy.length)}
            <span className="max-sm:hidden">
              {optimisticPost.savedBy.length < 1 ? " Saved" : " Saves"}
            </span>
          </span>
        </button>

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
          <Icon name="send" />
          <span className="max-sm:hidden">
            Share
          </span>
        </ShareButton>
      </div>
    </div>
  );
}
