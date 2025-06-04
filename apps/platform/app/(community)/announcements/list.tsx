import EmptyArea from '@/components/common/empty-area';
import { MDXRemote } from '@mintlify/mdx';
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { GrAnnounce } from "react-icons/gr";
import type { AnnouncementTypeWithId } from "src/models/announcement";

export default function AnnouncementsList({
  announcements,
}: {
  announcements: AnnouncementTypeWithId[];
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
            className="w-full mx-auto rounded-lg bg-card backdrop-blur-md p-3 lg:p-5 space-y-4"
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
                <Link
                  href={`/u/${announcement.createdBy.username}`}
                  className="text-primary hover:underline"
                >
                  @{announcement.createdBy.username}
                </Link>
              </p>
            </div>
            <article className="prose prose-sm dark:prose-invert text-muted-foreground">
              <MDXRemote source={announcement.content} parseFrontmatter />
            </article>
          </div>
        );
      })}
    </div>
  );
}
