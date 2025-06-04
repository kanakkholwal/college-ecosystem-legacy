"use client";
import ShareButton from "@/components/common/share-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bookmark, BookmarkCheck, Eye, Share, ThumbsUp } from "lucide-react";

import { useState } from "react";
import type { Session } from "src/lib/auth-client";
import { updatePost } from "src/lib/community/actions";
import type { CommunityPostTypeWithId } from "src/models/community";
import { formatNumber } from "src/utils/number";
import { appConfig } from "~/project.config";

export default function PostFooter({
  post,
  user,
}: {
  post: CommunityPostTypeWithId;
  user: Session["user"];
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
          variant={post.likes.includes(user.id) ? "default_light" : "outline"}
          onClick={() => {
            setLiking(true);
            updatePost(post._id, {
              likes: post.likes.includes(user.id)
                ? post.likes.filter((id) => id !== user.id)
                : [...post.likes, user.id],
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
          variant={post.savedBy.includes(user.id) ? "default_light" : "outline"}
          onClick={() => {
            setSaving(true);
            updatePost(post._id, {
              savedBy: post.savedBy.includes(user.id)
                ? post.savedBy.filter((id) => id !== user.id)
                : [...post.savedBy, user.id],
            }).finally(() => setSaving(false));
          }}
        >
          {post.savedBy.includes(user.id) ? <BookmarkCheck /> : <Bookmark />}
          <span>{formatNumber(post.savedBy.length)}</span>
          <span>Save</span>
        </Button>
        <ShareButton
          data={{
            title: post.title,
            text: post.content,
            url: appConfig.url + `/community/posts/${post._id}`,
          }}
          variant="ghost" size="xs">
          <Share />
          Share
        </ShareButton>

      </div>

    </div>
  );
}
