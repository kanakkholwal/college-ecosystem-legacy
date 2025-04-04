import EmptyArea from "@/components/common/empty-area";
import ConditionalRender from "@/components/utils/conditional-render";
import ErrorBanner from "@/components/utils/error";
import { ErrorBoundaryWithSuspense } from "@/components/utils/error-boundary";
import { SkeletonCardArea } from "@/components/utils/skeleton-cards";
import { cn } from "@/lib/utils";
import { MdOutlineChair } from "react-icons/md";
import {
  getAllotmentProcess,
  getHostelRooms,
  getUpcomingSlots
} from "~/actions/allotment-process";
import { getHostelByUser } from "~/actions/hostel";
import { getSession } from "~/lib/auth-server";

import type { HostelRoomJson } from "~/models/allotment";
import { ViewRoomButton } from "./client";



export default async function HostelRoomAllotmentPage() {
  const session = await getSession();
  const hostelResponse = await getHostelByUser();

  console.log(hostelResponse);

  if (!hostelResponse.success || !hostelResponse.hostel) {
    return <div className="w-full">
      <EmptyArea
        title={hostelResponse.message}
        description="Please contact the admin to assign you a hostel."
      />

    </div>;
  }
  const { hostel } = hostelResponse;
  const allotmentProcess = await getAllotmentProcess(hostel._id);

  let hostelRoomsResponse: Awaited<ReturnType<typeof getHostelRooms>> | null = null;
  let upcomingSlotsResponse: Awaited<ReturnType<typeof getUpcomingSlots>> | null = null;

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



  return (
    <div className="space-y-5 my-2">
      <ErrorBoundaryWithSuspense

        fallback={<ErrorBanner />}
        loadingFallback={
          <SkeletonCardArea
            className="mx-auto"
            skeletonClassName="bg-gray-200"
          />
        }
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
          {upcomingSlotsResponse?.error && <EmptyArea
            title="Something went while fetching slots"
            description={upcomingSlotsResponse?.message}
          />}
          {hostelRoomsResponse?.error && <EmptyArea
            title="Something went while fetching rooms"
            description={hostelRoomsResponse?.message}
          />}

          <div>
            <h2 className="text-2xl font-bold">Hostel Room Allotment</h2>
            <p className="text-gray-500">
              Select a room to view details and allotment options.
            </p>
          </div>

          {hostelRoomsResponse?.data?.map((room) => {
            return (
              <RoomCard
                key={room._id}
                room={room}
              />
            );
          })}
        </ConditionalRender>


      </ErrorBoundaryWithSuspense>
    </div>
  );
}

type RoomCardProps = {
  room: HostelRoomJson
};

function RoomCard({ room }: RoomCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow duration-300">
      <div>
        <h6 className="text-base font-semibold mb-4">{room.roomNumber}</h6>
        <p className="text-gray-500 text-sm">{room.capacity} Seater</p>
      </div>
      <div className="flex flex-row items-centerW gap-2">
        {Array.from({ length: room.capacity }).map((_, index) => {
          return (
            <MdOutlineChair
              key={`room.${index.toString()}`}
              className={cn(`text-gray-500 font-bold inline-block ${(index + 1) <= room.occupied_seats ? "text-green-500" : "text-gray-500"}`)}
            />
          );
        })}
        <span className="text-grey-500 text-sm">
          {room.occupied_seats}/ {room.capacity}
        </span>
      </div>
      <div className="mt-2">
        <span
          className={`text-sm ${room.isLocked ? "text-red-500" : "text-green-500"}`}
        >
          {room.isLocked ? "Locked" : "Unlocked"}
        </span>
      </div>
      <ViewRoomButton room={room} />
    </div>
  );
}
