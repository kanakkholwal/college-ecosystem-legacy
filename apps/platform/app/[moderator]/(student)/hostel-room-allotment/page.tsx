import EmptyArea from "@/components/common/empty-area";
import ConditionalRender from "@/components/utils/conditional-render";
import { ErrorBoundaryWithSuspense } from "@/components/utils/error-boundary";
import { SkeletonCardArea } from "@/components/utils/skeleton-cards";
import { cn } from "@/lib/utils";
// import { getSession } from "~/lib/auth-server";
import { Lock, Unlock } from "lucide-react";
import { MdOutlineChair } from "react-icons/md";
import {
  getAllotmentProcess,
  getHostRoom,
  getHostelRooms,
  getUpcomingSlots,
} from "~/actions/hostel.allotment-process";
import { getHostelForStudent } from "~/actions/hostel.core";

import type { HostelRoomJson } from "~/models/allotment";
import { ViewRoomButton } from "./client";

import { ResponsiveContainer } from "@/components/common/container";

export default async function HostelRoomAllotmentPage() {
  const hostelResponse = await getHostelForStudent();

  if (
    !hostelResponse.success ||
    !hostelResponse.hosteler ||
    !hostelResponse.hostel
  ) {
    console.log(hostelResponse);
    return (
      <div className="w-full">
        <EmptyArea
          title={hostelResponse.message}
          description="Please contact the admin to assign you a hostel."
        />
      </div>
    );
  }
  const { hostel, hosteler } = hostelResponse;
  const allotmentProcess = await getAllotmentProcess(hosteler._id);
  console.log("allotment process:", allotmentProcess);

  const { data } = await getHostRoom(hosteler?._id as string);

  let hostelRoomsResponse: Awaited<ReturnType<typeof getHostelRooms>> | null =
    null;
  let upcomingSlotsResponse: Awaited<
    ReturnType<typeof getUpcomingSlots>
  > | null = null;

  if (allotmentProcess?.status === "open") {
    hostelRoomsResponse = await getHostelRooms(hostel._id);
    if (hostelRoomsResponse?.error) {
      console.log(hostelRoomsResponse.message);
    }

    upcomingSlotsResponse = await getUpcomingSlots(hostel._id);
    if (upcomingSlotsResponse?.error) {
      console.log(upcomingSlotsResponse.message);
    }
  }

  const hostJoinedRoom = data?.room;
  console.log(hostJoinedRoom);

  return (
    <div className="space-y-5 my-2">
      <ErrorBoundaryWithSuspense
        loadingFallback={<SkeletonCardArea className="mx-auto" />}
      >
        <ConditionalRender condition={allotmentProcess?.status === "closed"}>
          <EmptyArea
            title="Allotment Process Closed"
            description="Allotment process is closed for this hostel"
          />
        </ConditionalRender>

        <ConditionalRender condition={allotmentProcess?.status === "paused"}>
          <EmptyArea
            title="Allotment Process Paused"
            description="Allotment process is paused for this hostel for some reason"
          />
        </ConditionalRender>

        <ConditionalRender condition={allotmentProcess?.status === "completed"}>
          <EmptyArea
            title="Allotment Process Completed"
            description="Allotment process is completed for this hostel"
          />
        </ConditionalRender>

        <ConditionalRender condition={allotmentProcess?.status === "waiting"}>
          <EmptyArea
            title="Allotment Process Waiting"
            description="Allotment process is waiting for the admin to start the process"
          />
        </ConditionalRender>

        <ConditionalRender condition={allotmentProcess?.status === "open"}>
          {upcomingSlotsResponse?.error && (
            <EmptyArea
              title="Something went while fetching slots"
              description={upcomingSlotsResponse?.message}
            />
          )}
          {hostelRoomsResponse?.error && (
            <EmptyArea
              title="Something went while fetching rooms"
              description={hostelRoomsResponse?.message}
            />
          )}

          <div>
            <h2 className="text-lg font-semibold">Hostel Room Allotment</h2>
            <p className="text-sm text-muted-foreground">
              Select a room to view details and allotment options.
            </p>
          </div>
          <ResponsiveContainer className="mx-auto">
            {hostelRoomsResponse?.data?.map((room) => {
              const joinable =
                !hostJoinedRoom ||
                (room.occupied_seats < room.capacity && !room.isLocked);

              return (
                <RoomCard
                  key={room._id}
                  room={room}
                  joinable={joinable}
                  hostId={hosteler?._id as string}
                />
              );
            })}
          </ResponsiveContainer>
        </ConditionalRender>
      </ErrorBoundaryWithSuspense>
    </div>
  );
}

type RoomCardProps = {
  room: HostelRoomJson;
  joinable: boolean;
  hostId: string;
};

function RoomCard({ room, joinable, hostId }: RoomCardProps) {
  return (
    <div className="bg-card rounded-lg shadow-md p-4 space-y-3 hover:shadow-lg border hover:border-primary transition-shadow duration-300">
      <div>
        <h6 className="text-base font-semibold mb-2">
          {room.roomNumber}
          {room.isLocked ? (
            <Lock className="text-red-500 inline-block size-4 ml-2" />
          ) : (
            <Unlock className="text-green-500 inline-block size-4 ml-2" />
          )}
        </h6>
        <p className="text-sm text-muted-foreground">
          {room.capacity} Seater |{" "}
          <span className="text-muted-foreground font-bold inline-block">
            {room.occupied_seats}/ {room.capacity}
          </span>
        </p>
      </div>
      <div className="flex flex-row items-center gap-2">
        {Array.from({ length: room.capacity }).map((_, index) => {
          return (
            <MdOutlineChair
              key={`room.${index.toString()}`}
              className={cn(
                `text-muted-foreground font-bold inline-block ${index + 1 <= room.occupied_seats ? "text-green-500" : "text-muted-foreground"}`
              )}
            />
          );
        })}
      </div>
      <div className="">
        {room.occupied_seats >= room.capacity && !room.isLocked ? (
          <>
            <span className="text-sm text-red-500">Room is full</span>
          </>
        ) : (
          <ViewRoomButton room={room} joinable={joinable} hostId={hostId} />
        )}
      </div>
    </div>
  );
}
