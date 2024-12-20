"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import { useShare } from "@/hooks/useShare";
import { Bookmark, BookmarkCheck, Eye, Share, ThumbsUp } from "lucide-react";

import { useState } from "react";
import type { Session } from "src/lib/auth-client";
import { updatePost } from "src/lib/community/actions";
import type { CommunityPostTypeWithId } from "src/models/community";
import { formatNumber } from "src/utils/number";

export default function PostFooter({
  post,
  user,
}: {
  post: CommunityPostTypeWithId;
  user: Session["user"];
}) {
  const { share, socials } = useShare({
    title: post.title,
    text: post.content,
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/community/posts/${post._id}`,
  });

  // refactor this with useTransition after react 19
  const [liking, setLiking] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);

  return (
    <CardFooter className="gap-2 w-full justify-between">
      <div className="flex gap-2 items-center">
        <Button
          size="sm"
          disabled={liking}
          variant={post.likes.includes(user.id) ? "default_light" : "glass"}
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
          size="sm"
          disabled={saving}
          variant={post.savedBy.includes(user.id) ? "default_light" : "glass"}
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

        <ResponsiveDialog
          title={"Share this Post"}
          description={"Share this post with your friends"}
          btnProps={{
            variant: "glass",
            size: "sm",
            children: (
              <>
                <Share />
                <span>Share</span>
              </>
            ),
          }}
        >
          <div className="grid grid-cols-2 gap-2">
            {socials.map((social, index) => {
              return (
                <Button
                  key={social.name + index.toString()}
                  size="sm"
                  variant="default_light"
                  className="w-full justify-start"
                  onClick={() => {
                    window.open(social.url, "_blank");
                  }}
                >
                  <social.icon />
                  {social.name}
                </Button>
              );
            })}
            <Button
              size="sm"
              variant="default_light"
              className="w-full justify-start"
              onClick={() => {
                share();
              }}
            >
              <span>More</span>
            </Button>
          </div>
        </ResponsiveDialog>
      </div>
      <div className="flex gap-2 items-center">
        <Badge className="gap-1" variant="glass">
          <Eye size={16} />
          <span>{formatNumber(post.views)}</span>
        </Badge>
      </div>
    </CardFooter>
  );
}
