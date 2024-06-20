import MarkdownView from "@/components/common/markdown/view";
import { formatDistanceToNow } from "date-fns";
import { AnnouncementTypeWithId } from "src/models/announcement";

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
            className="w-full mx-auto rounded-lg bg-white/20 backdrop-blur-md p-6 space-y-4"
          >
            <div className="flex justify-between items-center w-full">
              <h3 className="text-xl font-semibold">{announcement.title}</h3>
              <span className="text-sm text-gray-600">
                {formatDistanceToNow(new Date(announcement.createdAt), {
                  addSuffix: true,
                })}
              </span>
            </div>
            <MarkdownView>{announcement.content}</MarkdownView>
          </div>
        );
      })}
    </div>
  );
}
