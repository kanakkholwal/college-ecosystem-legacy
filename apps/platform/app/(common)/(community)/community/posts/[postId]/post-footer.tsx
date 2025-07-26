"use client";
import ShareButton from "@/components/common/share-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
      <div className="flex gap-2 items-center">
        <Badge>
          <Eye />
          {formatNumber(post.views)}
        </Badge>
        <Button
          size="xs"
          disabled={liking}
          variant={user?.id ? (post.likes.includes(user?.id) ? "default_light" : "outline") : "outline"}
          onClick={() => {
            if(!user?.id)return;
            setLiking(true);
            updatePost(post._id, {
              likes: post.likes.includes(user?.id)
                ? post.likes.filter((id) => id !== user?.id)
                : [...post.likes, user?.id],
            }).finally(() => setLiking(false));
          }}
        >
          <ThumbsUp />
          <span>{formatNumber(post.likes.length)}</span>
          <span>Like</span>
        </Button>
        <Button
          size="xs"
          disabled={saving}
          variant={user?.id ? (post.savedBy.includes(user.id) ? "default_light" : "outline") : "outline"}
          onClick={() => {
            if (!user?.id) return;
            setSaving(true);
            updatePost(post._id, {
              savedBy: post.savedBy.includes(user.id)
                ? post.savedBy.filter((id) => id !== user.id)
                : [...post.savedBy, user.id],
            }).finally(() => setSaving(false));
          }}
        >
          {user?.id ? (post.savedBy.includes(user.id) ? <BookmarkCheck /> : <Bookmark />) : <Bookmark />}
          <span>{formatNumber(post.savedBy.length)}</span>
          <span>Saves</span>
        </Button>
        <ShareButton
          data={{
            title: post.title,
            text: post.content.slice(0, 100) + "...",
            url: appConfig.url + `/community/posts/${post._id}`,
          }}
          variant="ghost"
          size="xs"
        >
          <Share />
          Share
        </ShareButton>
      </div>
    </div>
  );
}
