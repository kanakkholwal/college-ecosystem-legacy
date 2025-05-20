import MarkdownView from "@/components/common/markdown/view";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import type { AnnouncementTypeWithId } from "src/models/announcement";

export default function AnnouncementsList({
  announcements,
}: {
  announcements: AnnouncementTypeWithId[];
}) {
  return (
    <div className="grid gap-4 w-full">
      {announcements.map((announcement) => {
        return (
          <div
            key={announcement._id}
            className="w-full mx-auto rounded-lg bg-card backdrop-blur-md p-6 space-y-4"
          >
            <div>
              <h3 className="text-lg font-medium">{announcement.title}</h3>
              <p className="text-sm text-muted-foreground">
                Posted{" "}
                <span>
                  {formatDistanceToNow(new Date(announcement.createdAt), {
                    addSuffix: true,
                  })}
                </span>{" "}
                in
                <Link
                  href={`/announcements?c=${announcement.relatedFor}`}
                  className="text-primary hover:underline"
                >
                  {` ${announcement.relatedFor}`}
                </Link>
                {" by "}
                <Link
                  href={`/u/${announcement.createdBy.username}`}
                  className="text-primary hover:underline"
                >
                  {` ${announcement.createdBy.name}`}
                </Link>
                {` (${announcement.createdBy.username})`}
              </p>
            </div>
            <MarkdownView>{announcement.content}</MarkdownView>
          </div>
        );
      })}
    </div>
  );
}
