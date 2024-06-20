"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import { useShare } from "@/hooks/useShare";
import {
  Bookmark,
  BookmarkCheck,
  Ellipsis,
  Eye,
  Share,
  ThumbsUp,
} from "lucide-react";
import { updatePost } from "src/lib/community/actions";
import { CommunityPostTypeWithId } from "src/models/community";
import { sessionType } from "src/types/session";
import { formatNumber } from "src/utils/number";
import { useState } from "react";

export default function PostFooter({
  post,
  user,
}: {
  post: CommunityPostTypeWithId;
  user: sessionType["user"];
}) {
  const { share, socials } = useShare({
    title: post.title,
    text: post.content,
    url: process.env.NEXT_PUBLIC_BASE_URL + `/community/posts/${post._id}`,
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
          variant={post.likes.includes(user._id) ? "default_light" : "glass"}
          onClick={() => {
            setLiking(true);
            updatePost(post._id, {
              likes: post.likes.includes(user._id)
                ? post.likes.filter((id) => id !== user._id)
                : [...post.likes, user._id],
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
          variant={post.savedBy.includes(user._id) ? "default_light" : "glass"}
          onClick={() => {
            setSaving(true);
            updatePost(post._id, {
              savedBy: post.savedBy.includes(user._id)
                ? post.savedBy.filter((id) => id !== user._id)
                : [...post.savedBy, user._id],
            }).finally(() => setSaving(false));
          }}
        >
          {post.savedBy.includes(user._id) ? <BookmarkCheck /> : <Bookmark />}
          <span>{formatNumber(post.savedBy.length)}</span>
          <span>Save</span>
        </Button>

        <ResponsiveDialog
          title={`Share this Post`}
          description={`Share this post with your friends`}
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
                  key={index}
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
              <Ellipsis />
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
