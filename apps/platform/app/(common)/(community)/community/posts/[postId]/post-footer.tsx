"use client";
import ShareButton from "@/components/common/share-button";
import { Icon } from "@/components/icons";
import { cn } from "@/lib/utils";
import { Bookmark, BookmarkCheck, Eye, Share, ThumbsUp } from "lucide-react";

import { useState } from "react";
import { updatePost } from "src/actions/common.community";
import type { CommunityPostTypeWithId } from "src/models/community";
import { formatNumber } from "src/utils/number";
import type { Session } from "~/auth/client";
import { appConfig } from "~/project.config";

export default function PostFooter({
  post,
  user,
}: {
  post: CommunityPostTypeWithId;
  user?: Session["user"];
}) {
  // refactor this with useTransition after react 19
  const [liking, setLiking] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);

  return (
    <div className="inline-flex items-center gap-3 w-full justify-between">
      <div className="flex gap-2 items-center h-7">
        <div className="flex items-center gap-1 rounded-2xl bg-background px-3 py-1.5 [&>svg]:size-4 h-full">
          <Eye />
          <span className="text-xs font-medium text-muted-foreground">
            {formatNumber(post.views)}
            {post.views < 1 ? " View" : " Views"}
          </span>
        </div>
        <div
          title="Like Post"
          aria-label="Like Post"
          className="rounded-2xl bg-background flex items-center gap-1.5 h-full hover:ring-1 hover:ring-primary transition-all"
        >
          <button
            className={cn(
              "flex items-center gap-1 aspect-square h-full p-2 rounded-full text-xs [&>svg]:size-4 transition-all",
              "hover:text-primary hover:bg-primary/10 focus-visible:bg-primary/10 text-foreground active:scale-95",
              user?.id ? (post.likes.includes(user?.id) ? "text-primary bg-primary/10" : "") : ""
            )}
            title="Like Post"
            aria-label="Like Post"
            disabled={liking}
            onClick={() => {
              if (!user?.id || liking) return;
              setLiking(true);
              updatePost(post._id, {
                likes: post.likes.includes(user?.id)
                  ? post.likes.filter((id) => id !== user?.id)
                  : [...post.likes, user?.id],
              }).finally(() => setLiking(false));
            }}
          >
            {liking ? (
              <Icon name="loader-circle" className="animate-spin" />
            ) : <ThumbsUp />}
          </button>
          <span className="text-xs pr-2 font-medium text-muted-foreground">
            {formatNumber(post.likes.length)} {post.likes.length < 1 ? " Like" : " Likes"}
          </span>
        </div>
        <div
          title="Bookmark Post"
          aria-label="Bookmark Post"
          className="rounded-2xl bg-background flex items-center gap-1.5 h-full hover:ring-1 hover:ring-primary transition-all">
          <button
            className={cn(
              "flex items-center gap-1 aspect-square h-full p-2 rounded-full text-xs [&>svg]:size-4 transition-all",
              "hover:text-primary hover:bg-primary/10 focus-visible:bg-primary/10 text-foreground active:scale-95",
              user?.id ? (post.savedBy.includes(user?.id) ? "text-primary bg-primary/10" : "") : ""
            )}
            title="Bookmark Post"
            aria-label="Bookmark Post"
            disabled={saving}
            onClick={() => {
              if (!user?.id || saving) return;
              setSaving(true);
              updatePost(post._id, {
                savedBy: post.savedBy.includes(user?.id)
                  ? post.savedBy.filter((id) => id !== user?.id)
                  : [...post.savedBy, user?.id],
              }).finally(() => setSaving(false));
            }}
          >
            {saving ? (
              <Icon name="loader-circle" className="animate-spin" />
            ) : user?.id ? (post.savedBy.includes(user?.id) ? <BookmarkCheck /> : <Bookmark />) : <Bookmark />}
          </button>
          <span className="text-xs pr-2 font-medium text-muted-foreground">
            {formatNumber(post.savedBy.length)} {post.savedBy.length < 1 ? " Save" : " Saves"}
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
    </div>
  );
}
