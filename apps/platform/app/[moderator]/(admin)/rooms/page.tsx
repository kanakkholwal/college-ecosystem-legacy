import RoomCard from "@/components/application/room-card";
import SearchBox from "@/components/application/room-search";
import { RouterCard } from "@/components/common/router-card";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorBoundaryWithSuspense } from "@/components/utils/error-boundary";
import { BadgePlus } from "lucide-react";
import type { Metadata, ResolvingMetadata } from "next";
import { changeCase } from "src/utils/string";

import { getRoomsInfo, listAllRoomsWithHistory } from "~/actions/room";

type Props = {
  params: Promise<{
    moderator: string;
  }>;
  searchParams?: Promise<{
    query?: string;
    page?: string;
    currentStatus?: string;
    roomType?: string;
  }>;
};

export async function generateMetadata(
  props: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const params = await props.params;
  return {
    title: `Rooms | ${changeCase(params.moderator, "title")} Dashboard | ${process.env.NEXT_PUBLIC_WEBSITE_NAME}`,
    description: "Search for rooms based on their availability and type.",
  };
}

export default async function RoomsPage(props: Props) {
  const params = await props.params;
  const searchParams = await props.searchParams;

  const moderator = params.moderator;
  const query = searchParams?.query || "";
  const status = searchParams?.currentStatus || "";
  
  const rooms = await listAllRoomsWithHistory({
    status,
    roomNumber: query,
  })
  const { totalRooms, totalAvailableRooms, totalOccupiedRooms } =
    await getRoomsInfo();

  return (
    <>
      <div>
        <h1 className="text-2xl font-bold">Rooms Overview</h1>
        <p className="text-xs text-medium font-semibold">
          As of {new Date().toLocaleString()}
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white/20 backdrop-blur-lg p-4 rounded-lg shadow-md">
          <h4 className="text-lg font-bold">Total Rooms</h4>
          <h3 className="text-primary font-bold tracking-wide text-3xl mt-4">
            {totalRooms}
          </h3>
        </div>
        <div className="bg-white/20 backdrop-blur-lg p-4 rounded-lg shadow-md">
          <h4 className="text-lg font-bold">Available Rooms</h4>
          <h3 className="text-primary font-bold tracking-wide text-3xl mt-4">
            {totalAvailableRooms}
          </h3>
        </div>
        <div className="bg-white/20 backdrop-blur-lg p-4 rounded-lg shadow-md">
          <h4 className="text-lg font-bold">Occupied Rooms</h4>
          <h3 className="text-primary font-bold tracking-wide text-3xl mt-4">
            {totalOccupiedRooms}
          </h3>
        </div>
        <RouterCard
          Icon={BadgePlus}
          title="Add New Room"
          description="Add a new room to the system"
          href={`${moderator}/rooms/new`}
        />
      </div>
      <div className="lg:w-3/4 text-center mx-auto">
        <div className="mt-16 flex flex-wrap justify-center gap-y-4 gap-x-6">
          <SearchBox />
        </div>
      </div>
      <div className="mb-32 max-w-[144rem] grid lg:mb-0 lg:w-full mx-auto grid-cols-1 @md:grid-cols-2 @4xl:grid-cols-3 @6xl:grid-cols-4 text-left gap-4">
        <ErrorBoundaryWithSuspense
          key="Rooms"
          fallback={
            <h4 className="text-red-500 text-lg">
              {" "}
              Error fetching rooms. Please try again later.{" "}
            </h4>
          }
          loadingFallback={Array.from({ length: 8 }).map((_, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            <Skeleton className="h-12 w-full" key={`loading-${index}`} />
          ))}
        >
          {rooms.map((room) => {
            return <RoomCard key={room.id} room={room} />;
          })}
        </ErrorBoundaryWithSuspense>
      </div>

    </>
  );
}
