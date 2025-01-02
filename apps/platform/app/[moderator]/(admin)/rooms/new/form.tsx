"use client";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { InferInsertModel } from "drizzle-orm";
import { useState } from "react";
import type { rooms } from "~/db/schema";

import { Plus } from "lucide-react";
import toast from "react-hot-toast";

type RoomType = InferInsertModel<typeof rooms>;

export default function CreateRoomForm({
  onSubmit,
}: {
  onSubmit: (room: RoomType) => Promise<RoomType>;
}) {
  const [state, setState] = useState<RoomType>({
    roomNumber: "",
    roomType: "",
    capacity: 0,
    currentStatus: "occupied",
    lastUpdatedTime: new Date(),
    createdAt: new Date(),
  });
  const { roomNumber, roomType, capacity, currentStatus } = state;

  return (
    <>
      <CardContent className="grid gap-4 w-full grid-cols-1 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="roomNumber">Room Number</Label>
          <Input
            id="roomNumber"
            name="roomNumber"
            placeholder="Room Name"
            variant="fluid"
            value={roomNumber}
            onChange={(e) => {
              setState({
                ...state,
                roomNumber: e.target.value.toUpperCase(),
              });
            }}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="roomType">Room Type</Label>
          <Select
            name="roomType"
            value={roomType}
            onValueChange={(value) => {
              setState({
                ...state,
                roomType: value,
              });
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Type" className="capitalize" />
            </SelectTrigger>
            <SelectContent>
              {["classroom", "conference", "office", "lab"].map((type) => (
                <SelectItem value={type} key={type} className="capitalize">
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="capacity">Capacity</Label>
          <Input
            id="capacity"
            name="capacity"
            placeholder="Capacity"
            variant="fluid"
            type="number"
            value={capacity || ""}
            onChange={(e) => {
              setState({
                ...state,
                capacity: Number.parseInt(e.target.value),
              });
            }}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="currentStatus">Current Status</Label>

          <Select
            name="currentStatus"
            value={currentStatus}
            onValueChange={(value: "available" | "occupied") => {
              setState({
                ...state,
                currentStatus: value,
              });
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Status" className="capitalize" />
            </SelectTrigger>
            <SelectContent>
              {["available", "occupied"].map((status) => (
                <SelectItem value={status} key={status} className="capitalize">
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          type="submit"
          className="mx-auto"
          onClick={(e) => {
            e.preventDefault();
            toast.promise(onSubmit(state), {
              loading: "Saving...",
              success: (data) => `Room ${data.roomNumber} created successfully`,
              error: "Could not create room",
            });
          }}
        >
          Create Room <Plus className="inline-block ml-2" size={16} />
        </Button>
      </CardFooter>
    </>
  );
}
