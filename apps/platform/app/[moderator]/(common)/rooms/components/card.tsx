"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import toast from "react-hot-toast";
import { updateStatus } from "src/lib/room/actions";
import { RoomTypeWithId } from "src/models/room";

type Props = {
  room: RoomTypeWithId;
};

export default function RoomCard({ room }: Props) {
  return (
    <Card variant="glass" className="hover:shadow-lg">
      <CardHeader>
        <CardTitle>
          {room.roomNumber}
          <Button
            size="icon"
            className="ml-5"
            onClick={() => {
              toast.promise(
                updateStatus(
                  room.roomNumber,
                  room.currentStatus === "available" ? "occupied" : "available"
                ),
                {
                  loading: "Updating room status...",
                  success: "Room status updated successfully!",
                  error: "An error occurred while updating room status",
                }
              );
            }}
          >
            {room.currentStatus === "available" ? "Occupy" : "Release"}
          </Button>
        </CardTitle>
        <CardDescription>
          Last updated: {new Date(room.lastUpdatedTime).toLocaleTimeString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex w-full flex-col md:flex-row md:justify-around items-start gap-2">
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs font-medium text-gray-700">Capacity</span>
            <Badge className="uppercase" variant="default_light">
              {room.capacity}
            </Badge>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs font-medium text-gray-700">Room Type</span>
            <Badge className="uppercase" variant="ghost">
              {room.roomType}
            </Badge>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs font-medium text-gray-700">
              Current Status
            </span>
            <Badge
              className="uppercase"
              variant={
                room.currentStatus === "available" ? "success" : "destructive"
              }
            >
              {room.currentStatus}
            </Badge>
          </div>
        </div>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}
