"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import { useQuery } from '@tanstack/react-query';
import { Lock, Unlock } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { addRoomMembers, joinRoom } from "~/actions/allotment-process";
import { isValidRollNumber } from "~/constants/departments";
import type { HostelRoomJson } from "~/models/allotment";
import { ORG_DOMAIN } from "~/project.config";

const fetchRoomDetails = async (roomId: string) => {
    const response = await fetch(`/api/hostel/room-members?roomId=${roomId}`, {
        method: "GET",
        cache: "no-store"
    });
    if (!response.ok) {
        throw new Error("Failed to fetch room details");
    }
    const data = await response.json();
    return data;
}

export function ViewRoomButton({
    room,
    joinable,
    hostId
}: {
    hostId: string,
    room: HostelRoomJson,
    joinable: boolean
}) {
      const roomInfo = useQuery({ 
        queryKey: ['room',room._id],
        queryFn: () => fetchRoomDetails(room._id),
        enabled: !!room._id,
    })

    const [rollNumbers, setRollNumbers] = useState<string[]>([]);
    const [value, setValue] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const isHost = room.hostStudent === hostId;


    return (
        <>
            <ResponsiveDialog
                btnProps={{
                    variant: "default_light",
                    children: "View",
                    size: "sm"
                }}
                title={<>
                    Room {room.roomNumber}
                    {room.isLocked ? <Lock className="text-red-500 inline-block size-5 ml-2" /> : <Unlock className="text-green-500 inline-block size-5 ml-2" />}

                </>}
                description={`${room.capacity} Seater | ${joinable ? "Joinable" : "Not Joinable"}`}
            >
                <div className="flex flex-col items-center justify-center p-4 space-y-2">
                    <p className={`text-sm font-semibold ${(room.occupied_seats >= room.capacity) ? "text-red-500" : "text-green-500"}`}>
                        {(room.occupied_seats >= room.capacity) ? "Room is full" : "Room is Joinable"}
                    </p>


                    <div className="grid w-full gap-2">
                        <div className="flex flex-row items-center justify-start">
                            {rollNumbers.map((rollNumber, idx) => {
                                return (
                                    <span key={rollNumber}>
                                        {rollNumber} {idx > 0 ? "," : ""}
                                    </span>
                                )
                            })}
                        </div>
                        {room?.hostStudent ? (<div>
                            <Input
                                placeholder="Enter Roll Number"
                                value={value}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    const rollNumbers = value.split(",").map((rollNumber) => rollNumber.trim())
                                        .filter((rollNumber) => rollNumber !== "" && isValidRollNumber(rollNumber));
                                    if ((room.capacity - room.occupied_seats) < rollNumbers.length) {
                                        alert("Can not add more roll numbers than available seats");
                                        return;
                                    }
                                    setRollNumbers(rollNumbers);
                                    setValue(value);
                                }}
                            />
                            <Button size="sm" variant="default_light" className="mt-2" disabled={loading} onClick={() => {
                                const rollNumbers = value.split(",").map((rollNumber) => rollNumber.trim()).
                                    filter((rollNumber) => rollNumber !== "" && isValidRollNumber(rollNumber));
                                const members = rollNumbers.map((rollNumber) => `${rollNumber.trim()}@${ORG_DOMAIN}`);
                                setLoading(true);
                                toast.promise(addRoomMembers(room._id, hostId, members), {
                                    loading: "Adding Room Members...",
                                    success: "Room Members Added Successfully",
                                    error: "Error Adding Room Members"
                                }).finally(() => {
                                    setRollNumbers([]);
                                    setValue("");
                                    setLoading(false);
                                })

                            }}>
                                Add Members
                            </Button>
                        </div>
                        ) : <>
                            <Button variant="default_light" disabled={loading} onClick={() => {
                                setLoading(true);
                                toast.promise(joinRoom(room._id, hostId), {
                                    loading: "Joining Room...",
                                    success: "Room Joined Successfully",
                                    error: "Error Joining Room"
                                }).finally(() => {
                                    setLoading(false);
                                })

                            }}>

                                {loading ? "Joining " : "Join "} room as Host
                            </Button>

                        </>}

                        {room.occupied_seats > 0 && (<div>
                            <h6>Joined Students </h6>
                            <div className="flex flex-col items-start justify-start">
                                {roomInfo.data?.members?.map((member: { name: string; rollNumber: string; email: string; }) => {
                                    return (
                                        <div key={member.rollNumber} className="flex flex-row items-center justify-start">
                                            <span>{member.rollNumber} </span>
                                            <span className="text-sm text-gray-500">({member.name})</span>
                                            {room.hostStudent === hostId && (member.email === roomInfo.data.hostStudent.email ) && (<Button size="sm">
                                                Remove
                                            </Button>)}

                                        </div>
                                    )
                                })}
                            </div>
                        </div>)}
                    </div>


                </div>
            </ResponsiveDialog>
        </>
    );
}