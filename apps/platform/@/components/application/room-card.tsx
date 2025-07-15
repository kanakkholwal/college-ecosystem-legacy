"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { formatDistanceToNow, parseISO } from "date-fns";
import type { InferSelectModel } from "drizzle-orm";
import { Trash2 } from "lucide-react";
import type React from "react";
import toast from "react-hot-toast";
import { deleteRoom, updateRoom } from "~/actions/common.room";
import type { Session } from "~/auth/client";
import type { roomUsageHistory, rooms } from "~/db/schema/room";

type RoomSelect = InferSelectModel<typeof rooms>;
type UsageHistorySelect = InferSelectModel<typeof roomUsageHistory>;

// Function to convert a date string to local time string + time ago format
function formatDateAgo(dateString: string): string {
  const date = parseISO(dateString);
  const localTimeString = date.toLocaleTimeString(); // Convert to local time string
  const timeAgo = formatDistanceToNow(date, { addSuffix: true }); // Calculate time ago

  return `${localTimeString} (${timeAgo})`;
}

interface Props extends React.ComponentProps<typeof Card> {
  room: RoomSelect & {
    latestUsageHistory: { username: string; name: string } | null;
  };
  user?: Session["user"];
  deletable?: boolean;
}

export default function RoomCard({
  room,
  user,
  deletable = false,
  ...props
}: Props) {
  const authorized = user
    ? user?.role === "admin" ||
      user.other_roles?.includes("cr") ||
      user.other_roles?.includes("faculty")
    : false;

  const handleSwitch = (value: boolean) => {
    if (!(user && authorized)) return;
    toast.promise(
      updateRoom(
        room.id,
        {
          currentStatus:
            room.currentStatus === "available" ? "occupied" : "available",
        },
        {
          userId: user.id,
        }
      ),
      {
        loading: `Updating ${room.roomNumber} status...`,
        success: `Room ${room.roomNumber} status updated successfully!`,
        error: `Failed to update ${room.roomNumber} status!`,
      }
    );
  };

  return (
    <Card
      className="hover:shadow-lg animate-in popup @container/0 relative"
      {...props}
    >
      {user?.role === "admin" && deletable && (
        <div className="absolute -top-2 -left-2 z-10">
          <Button
            size="icon_sm"
            variant="destructive_light"
            onClick={() => {
              if (!(user && authorized)) return;
              toast.promise(deleteRoom(room.id), {
                loading: `Deleting ${room.roomNumber}...`,
                success: `Room ${room.roomNumber} deleted successfully!`,
                error: `Failed to delete ${room.roomNumber}!`,
              });
            }}
          >
            <Trash2 />
          </Button>
        </div>
      )}
      <CardHeader className="p-4">
        <div className="flex flex-wrap w-full justify-between gap-2 items-center">
          <div className="flex justify-center items-center h-10 p-4 rounded-full bg-muted font-semibold text-lg shrink-0">
            {room.roomNumber}
          </div>

          {authorized && (
            <div className="inline-flex flex-col items-end text-left ml-auto">
              <Label
                htmlFor="switch"
                className="text-xs text-muted-foreground font-semibold"
              >
                {room.currentStatus === "available" ? "Occupy" : "Release"}
              </Label>
              <Switch
                id="switch"
                defaultChecked={!(room.currentStatus === "available")}
                checked={!(room.currentStatus === "available")}
                onCheckedChange={(value) => handleSwitch(value)}
              />
            </div>
          )}
        </div>
        <CardDescription
          className="font-medium text-[10px] text-muted-foreground"
          suppressHydrationWarning={true}
        >
          Last updated:{" "}
          {room.lastUpdatedTime
            ? formatDateAgo(new Date(room.lastUpdatedTime).toISOString())
            : "N/A"}
          {room.latestUsageHistory ? ` by ${room.latestUsageHistory.name}` : ""}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex w-full flex-wrap justify-around items-start gap-2 pb-4 px-2 pt-0">
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs font-medium  text-muted-foreground">
            Capacity
          </span>
          <Badge size="sm">{room.capacity}</Badge>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs font-medium  text-muted-foreground">
            Room Type
          </span>
          <Badge size="sm">{room.roomType}</Badge>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs font-medium  text-muted-foreground">
            Current Status
          </span>
          <Badge
            size="sm"
            variant={
              room.currentStatus === "available" ? "success" : "destructive"
            }
          >
            {room.currentStatus}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
