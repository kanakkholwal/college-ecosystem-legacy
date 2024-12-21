import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDistanceToNow, parseISO } from "date-fns";
import type { InferSelectModel } from "drizzle-orm";
import type { RoomTypeWithId } from "src/models/room";
import type { rooms, roomUsageHistory } from "~/db/schema/room";

type RoomSelect = InferSelectModel<typeof rooms>;
type UsageHistorySelect = InferSelectModel<typeof roomUsageHistory>;

// Function to convert a date string to local time string + time ago format
function formatDateAgo(dateString: string): string {
  const date = parseISO(dateString);
  const localTimeString = date.toLocaleTimeString(); // Convert to local time string
  const timeAgo = formatDistanceToNow(date, { addSuffix: true }); // Calculate time ago

  return `${localTimeString} (${timeAgo})`;
}

export function RoomCardPublic({
  room,
  ...props
}: { room: RoomSelect & { latestUsageHistory: { username: string; name: string } | null } } & React.ComponentProps<typeof Card>) {
  return (
    <Card
      variant="glass"
      className="hover:shadow-lg  animate-in popup"
      {...props}
    >
      <CardHeader>
        <CardTitle>{room.roomNumber}</CardTitle>
        <CardDescription className="font-semibold text-sm text-gray-700">
          Last updated: {room.lastUpdatedTime ? formatDateAgo(new Date(room.lastUpdatedTime).toISOString()) : "N/A"}
          {room.latestUsageHistory ? ` by ${room.latestUsageHistory.name}` : ""}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex w-full flex-col md:flex-row md:justify-around items-start gap-2">
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs font-medium text-gray-700">Capacity</span>
            <Badge className="uppercase" variant="default_light"size="sm">
              {room.capacity}
            </Badge>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs font-medium text-gray-700">Room Type</span>
            <Badge className="uppercase" variant="ghost" size="sm">
              {room.roomType}
            </Badge>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs font-medium text-gray-700">
              Current Status
            </span>
            <Badge
              className="uppercase"
              size="sm"
              variant={
                room.currentStatus === "available" ? "success" : "destructive"
              }
            >
              {room.currentStatus}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
