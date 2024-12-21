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
import { useReducer } from "react";
import { RoomType } from "src/models/room";
import { ACTION_TYPES, roomFormReducer } from "./store";

import { Plus } from "lucide-react";
import toast from "react-hot-toast";

export default function CreateRoomForm({
  onSubmit,
}: {
  onSubmit: (room: RoomType) => Promise<RoomType>;
}) {
  const [state, dispatch] = useReducer(roomFormReducer, {
    roomNumber: "",
    roomType: "",
    capacity: 0,
    currentStatus: "occupied",
    lastUpdatedTime: new Date(),
    usageHistory: [],
  } as RoomType);
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
              dispatch({
                type: ACTION_TYPES.SET_ROOM_NUMBER,
                roomNumber: e.target.value,
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
              dispatch({
                type: ACTION_TYPES.SET_ROOM_TYPE,
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
            value={capacity}
            onChange={(e) => {
              dispatch({
                type: ACTION_TYPES.SET_ROOM_CAPACITY,
                capacity: Number(e.target.value),
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
              dispatch({
                type: ACTION_TYPES.SET_ROOM_STATUS,
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
