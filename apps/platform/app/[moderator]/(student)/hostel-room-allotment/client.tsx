"use client";
import { cn } from "@/lib/utils";
import type { HostelRoomJson } from "~/models/allotment";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import { Button } from "@/components/ui/button";


export function ViewRoomButton({
    room,
}: {
    
    room: HostelRoomJson
}) {
    return (
        <div
            className={cn("bg-background border-primary/10 hover:border-primary/20 hover:shadow text-center")}
        >
            <ResponsiveDialog
                btnProps={{
                    variant: "ghost",
                    children: "View",
                }}
                title={room.roomNumber}
                description={`${room.capacity} Seater`}
            >
                <div className="flex flex-col items-center justify-center p-4 space-y-2">
                    <h2 className="text-2xl font-bold">{room.roomNumber}</h2>
                    <p className="text-gray-500">{room.capacity} Seater</p>
                    <div className="flex flex-row items-center gap-2">
                        {Array.from({ length: room.capacity }).map((_, index) => {
                            return (
                                <span key={`room.${index.toString()}`} className={cn("text-gray-500 font-bold inline-block", (index + 1) <= room.occupied_seats ? "text-green-500" : "text-gray-500")}>
                                    {index + 1}
                                </span>
                            );
                        })}
                        <span className="text-grey-500 text-sm">
                            {room.occupied_seats}/ {room.capacity}
                        </span>
                    </div>
                    <div className="mt-2">
                        <span className={`text-sm ${room.isLocked ? "text-red-500" : "text-green-500"}`}>
                            {room.isLocked ? "Locked" : "Unlocked"}
                        </span>
                    </div>
                </div>
            </ResponsiveDialog>
        </div>
    );
}