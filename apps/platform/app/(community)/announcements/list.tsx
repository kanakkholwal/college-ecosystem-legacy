import { UserPreview } from "@/components/application/user-preview";
import EmptyArea from "@/components/common/empty-area";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { GrAnnounce } from "react-icons/gr";
import Markdown from 'react-markdown';
import type { AnnouncementTypeWithId } from "src/models/announcement";
import { Session } from "~/lib/auth-client";
import DeleteButton from "./delete-btn";

export default function AnnouncementsList({
  announcements,
  user
}: {
  announcements: AnnouncementTypeWithId[];
  user?: Session["user"]
}) {
  if (announcements.length === 0) {
    return (
      <EmptyArea
        icons={[GrAnnounce]}
        title="No announcements"
        description="There are no announcements at the moment."
      />
    );
  }
  return (
    <div className="grid gap-4 w-full">
      {announcements.map((announcement) => {
        return (
          <div
            key={announcement._id}
            className="relative w-full mx-auto rounded-lg bg-card backdrop-blur-md p-3 lg:p-5 space-y-4"
          >
            <div>
              <h3 className="text-base font-medium">{announcement.title}</h3>
              <p className="text-xs text-muted-foreground">
                Posted{" "}
                <span>
                  {formatDistanceToNow(new Date(announcement.createdAt), {
                    addSuffix: true,
                  })}
                </span>{" "}
                in
                <Link
                  href={`/announcements?category=${announcement.relatedFor}`}
                  className="text-primary hover:underline"
                >
                  {` ${announcement.relatedFor}`}
                </Link>
                {" by "}
                <UserPreview user={announcement.createdBy}>
                  <span className="ml-1 text-primary hover:underline cursor-pointer">
                    {announcement.createdBy.name}
                  </span>
                </UserPreview>
              </p>
            </div>

            {(announcement.createdBy.id === user?.id || user?.role === "admin") && (
              <div className="absolute top-2 right-2">
                <DeleteButton announcementId={announcement._id} />
              </div>)}
            <article className="prose prose-sm dark:prose-invert text-muted-foreground">
              <Markdown>
                {announcement.content}
              </Markdown>
            </article>
          </div>
        );
      })}
    </div>
  );
}
