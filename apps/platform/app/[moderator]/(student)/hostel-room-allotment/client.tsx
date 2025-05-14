"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import { useQuery } from "@tanstack/react-query";
import { Lock, X as RemoveIcon, Unlock } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { MdOutlineChair } from "react-icons/md";
import { addRoomMembers, joinRoom } from "~/actions/allotment-process";
import { isValidRollNumber } from "~/constants/departments";
import type { HostelRoomJson } from "~/models/allotment";
import { ORG_DOMAIN } from "~/project.config";

const fetchRoomDetails = async (roomId: string) => {
  const response = await fetch(`/api/hostel/room-members?roomId=${roomId}`, {
    method: "GET",
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch room details");
  }
  const data = await response.json();
  return data;
};

export function ViewRoomButton({
  room,
  joinable,
  hostId,
}: {
  hostId: string;
  room: HostelRoomJson;
  joinable: boolean;
}) {
  const roomInfo = useQuery({
    queryKey: ["room", room._id],
    queryFn: () => fetchRoomDetails(room._id),
    enabled: !!room._id,
  });

  const [rollNumbers, setRollNumbers] = useState<string[]>([]);
  const [value, setValue] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>();
  const isHost = room.hostStudent === hostId;

  return (
    <>
      <ResponsiveDialog
        btnProps={{
          variant: "default_light",
          children: "View",
          size: "sm",
        }}
        title={
          <>
            Room {room.roomNumber}
            {room.isLocked ? (
              <Lock className="text-red-500 inline-block size-4 ml-2" />
            ) : (
              <Unlock className="text-green-500 inline-block size-4 ml-2" />
            )}
          </>
        }
        description={
          <>
            <span>{`${room.capacity} Seater | `}</span>
            <span
              className={`text-sm font-semibold ${room.occupied_seats >= room.capacity || room.isLocked ? "text-red-500" : "text-green-500"}`}
            >
              {room.isLocked
                ? "Room is locked"
                : room.occupied_seats >= room.capacity
                  ? "Room is full"
                  : "Room is Joinable"}
            </span>
          </>
        }
      >
        {room?.hostStudent ? (
          <div className="flex flex-col items-center justify-center p-4 space-y-2">
            <div>
              {typeof room.hostStudent === "string"
                ? "Room has a host"
                : `
                                Host : ${room.hostStudent.name} $({room.hostStudent.email})
                            `}
            </div>
            <div className="flex flex-row items-center justify-start gap-1">
              <span className="text-muted-foreground text-sm">
                Joined students :{" "}
              </span>
              {(typeof room.hostStudent !== "string"
                ? roomInfo.data?.members?.concat([
                    {
                      email: room.hostStudent.email,
                      name: room.hostStudent.name,
                      rollNumber: room.hostStudent.rollNumber,
                    },
                  ])
                : roomInfo.data?.members
              )?.map(
                (member: {
                  name: string;
                  rollNumber: string;
                  email: string;
                }) => (
                  <Badge
                    key={member.rollNumber}
                    variant="outline"
                    className="rounded-xl px-1.5"
                  >
                    <span className="text-xs">
                      {member.rollNumber} ({member.name})
                    </span>
                    {room.hostStudent === hostId &&
                      member.email === roomInfo.data.hostStudent.email && (
                        <button
                          aria-label={`Remove ${member.name}`}
                          aria-roledescription="button to remove option"
                          type="button"
                          onClick={() => {
                            // Logic to remove member
                          }}
                        >
                          <span className="sr-only">
                            Remove {member.name} option
                          </span>
                          <RemoveIcon className="size-3 hover:stroke-destructive" />
                        </button>
                      )}
                  </Badge>
                )
              )}
            </div>

            <div className="flex flex-row items-center gap-2">
              {Array.from({ length: room.capacity }).map((_, index) => {
                const isOccupied = index + 1 <= room.occupied_seats;
                return (
                  <Button
                    key={`room.${index.toString()}`}
                    size="icon_sm"
                    onClick={() => setSelectedIndex(index)}
                    variant={isOccupied ? "warning_light" : "outline"}
                  >
                    <MdOutlineChair />
                  </Button>
                );
              })}
            </div>

            <div className="grid w-full gap-2">
              {room?.hostStudent ? (
                <div>
                  <Input
                    placeholder="Enter Roll Number"
                    value={value}
                    onChange={(e) => {
                      const value = e.target.value;
                      const rollNumbers = value
                        .split(",")
                        .map((rollNumber) => rollNumber.trim())
                        .filter(
                          (rollNumber) =>
                            rollNumber !== "" && isValidRollNumber(rollNumber)
                        );
                      if (
                        room.capacity - room.occupied_seats <
                        rollNumbers.length
                      ) {
                        alert(
                          "Can not add more roll numbers than available seats"
                        );
                        return;
                      }
                      setRollNumbers(rollNumbers);
                      setValue(value);
                    }}
                  />
                  <Button
                    size="sm"
                    variant="default_light"
                    className="mt-2"
                    disabled={loading}
                    onClick={() => {
                      const rollNumbers = value
                        .split(",")
                        .map((rollNumber) => rollNumber.trim())
                        .filter(
                          (rollNumber) =>
                            rollNumber !== "" && isValidRollNumber(rollNumber)
                        );
                      const members = rollNumbers.map(
                        (rollNumber) => `${rollNumber.trim()}@${ORG_DOMAIN}`
                      );
                      setLoading(true);
                      toast
                        .promise(addRoomMembers(room._id, hostId, members), {
                          loading: "Adding Room Members...",
                          success: "Room Members Added Successfully",
                          error: "Error Adding Room Members",
                        })
                        .finally(() => {
                          setRollNumbers([]);
                          setValue("");
                          setLoading(false);
                        });
                    }}
                  >
                    Add Members
                  </Button>
                </div>
              ) : (
                <>
                  <Button
                    variant="default_light"
                    disabled={loading}
                    onClick={() => {
                      setLoading(true);
                      toast
                        .promise(joinRoom(room._id, hostId), {
                          loading: "Joining Room...",
                          success: "Room Joined Successfully",
                          error: "Error Joining Room",
                        })
                        .finally(() => {
                          setLoading(false);
                        });
                    }}
                  >
                    {loading ? "Joining " : "Join "} room as Host
                  </Button>
                </>
              )}

              {room.occupied_seats > 0 && (
                <div>
                  <div className="flex flex-col items-start justify-start">
                    {roomInfo.data?.members?.map(
                      (member: {
                        name: string;
                        rollNumber: string;
                        email: string;
                      }) => {
                        return (
                          <div
                            key={member.rollNumber}
                            className="flex flex-row items-center justify-start"
                          >
                            <span>{member.rollNumber} </span>
                            <span className="text-sm text-gray-500">
                              ({member.name})
                            </span>
                            {room.hostStudent === hostId &&
                              member.email ===
                                roomInfo.data.hostStudent.email && (
                                <Button size="sm">Remove</Button>
                              )}
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <Button
            variant="default_light"
            disabled={loading}
            onClick={() => {
              setLoading(true);
              toast
                .promise(joinRoom(room._id, hostId), {
                  loading: "Joining Room...",
                  success: "Room Joined Successfully",
                  error: "Error Joining Room",
                })
                .finally(() => {
                  setLoading(false);
                });
            }}
          >
            {loading ? "Joining " : "Join "} room as Host
          </Button>
        )}
      </ResponsiveDialog>
    </>
  );
}
