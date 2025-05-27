import RoomCard from "@/components/application/room-card";
import SearchBox from "@/components/application/room-search";
import { RouterCard } from "@/components/common/router-card";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorBoundaryWithSuspense } from "@/components/utils/error-boundary";
import { BadgePlus } from "lucide-react";
import type { Metadata, ResolvingMetadata } from "next";
import { changeCase } from "~/utils/string";

import { ResponsiveContainer } from "@/components/common/container";
import { getRoomsInfo, listAllRoomsWithHistory } from "~/actions/room";
import { getSession } from "~/lib/auth-server";

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
  });
  const { totalRooms, totalAvailableRooms, totalOccupiedRooms } =
    await getRoomsInfo();

  const session = await getSession();

  return (
    <div className="w-full space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Rooms Overview</h3>
        
      </div>
      <div className="grid grid-cols-1 gap-4 @md:grid-cols-2 @lg:grid-cols-3 @xl:grid-cols-4 px-4">
        <div className="bg-card border p-4 rounded-lg">
          <h4 className="text-lg font-semibold">Total Rooms</h4>
          <h3 className="text-primary font-semibold tracking-wide text-3xl mt-4">
            {totalRooms}
          </h3>
        </div>
        <div className="bg-card border p-4 rounded-lg">
          <h4 className="text-lg font-semibold">Available Rooms</h4>
          <h3 className="text-primary font-semibold tracking-wide text-3xl mt-4">
            {totalAvailableRooms}
          </h3>
        </div>
        <div className="bg-card border p-4 rounded-lg">
          <h4 className="text-lg font-semibold">Occupied Rooms</h4>
          <h3 className="text-primary font-semibold tracking-wide text-3xl mt-4">
            {totalOccupiedRooms}
          </h3>
        </div>
        <RouterCard
          Icon={BadgePlus}
          title="Add New Room"
          description="Add a new room to the system"
          href={`/${moderator}/rooms/new`}
        />
      </div>
      <div className="lg:w-3/4 text-center mx-auto">
        <div className="mt-16 flex flex-wrap justify-center gap-y-4 gap-x-6">
          <SearchBox />
        </div>
      </div>
      <ResponsiveContainer className="mb-32 max-w-[144rem] @md:grid-cols-1 @lg:grid-cols-2  @3xl:grid-cols-4 @7xl:grid-cols-5">
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
            return <RoomCard key={room.id} room={room} user={session?.user} />;
          })}
        </ErrorBoundaryWithSuspense>
      </ResponsiveContainer>
    </div>
  );
}
