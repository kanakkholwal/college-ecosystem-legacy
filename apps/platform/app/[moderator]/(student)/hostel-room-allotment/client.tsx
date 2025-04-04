"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import { Lock, Unlock } from "lucide-react";
import { useState } from "react";
import { isValidRollNumber } from "~/constants/departments";
import type { HostelRoomJson } from "~/models/allotment";


export function ViewRoomButton({
    room,
    joinable
}: {

    room: HostelRoomJson,
    joinable: boolean
}) {
    const [rollNumbers, setRollNumbers] = useState<string[]>([]);
    const [value, setValue] = useState<string>("");


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
                    {(room.occupied_seats >= room.capacity) ? <span className="text-sm text-red-500">Room is full</span> : <span className="text-sm text-green-500">Room is Joinable</span>}

                    <div className="grid w-full gap-2">
                        <div className="flex flex-row items-center justify-start">
                            {rollNumbers.map((rollNumber) => {
                                return (
                                    <span key={rollNumber}>
                                        {rollNumber}
                                    </span>
                                )
                            })}
                        </div>
                        <div>
                            <Input
                                placeholder="Enter Roll Number"
                                value={value}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    const rollNumbers = value.split(",").map((rollNumber) => rollNumber.trim())
                                        .filter((rollNumber) => rollNumber !== "" && isValidRollNumber(rollNumber));
                                    setRollNumbers(rollNumbers);
                                    setValue(value);
                                }}
                            />
                            <Button size="sm" variant="default_light" className="mt-2" onClick={() => {
                                const rollNumbers = value.split(",").map((rollNumber) => rollNumber.trim())
                            }}>
                                Add
                            </Button>
                        </div>

                    </div>


                </div>
            </ResponsiveDialog>
        </>
    );
}