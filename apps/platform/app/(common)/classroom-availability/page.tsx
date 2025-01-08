import RoomCard from "@/components/application/room-card";
import SearchBox from "@/components/application/room-search";
import EmptyArea from "@/components/common/empty-area";
import { Skeleton } from "@/components/ui/skeleton";
import ConditionalRender from "@/components/utils/conditional-render";
import ErrorBanner from "@/components/utils/error";
import { ErrorBoundaryWithSuspense } from "@/components/utils/error-boundary";
import type { Metadata } from "next";
import { listAllRoomsWithHistory } from "~/actions/room";
import { getSession } from "~/lib/auth-server";

type Props = {
  searchParams: Promise<{
    query?: string;
    currentStatus?: string;
  }>;
};

export const metadata: Metadata = {
  title: `Rooms | ${process.env.NEXT_PUBLIC_WEBSITE_NAME}`,
  description: "Search for rooms based on their availability and type.",
};

export default async function RoomsPage(props: Props) {
  const searchParams = await props.searchParams;
  const session= await getSession();

  const rooms = await listAllRoomsWithHistory({
    status: searchParams.currentStatus,
    roomNumber: searchParams.query,
  });

  return (
    <>
      <section
        id="hero"
        className="z-10 w-full max-w-6xl relative flex flex-col items-center justify-center  py-24 max-h-80 text-center"
      >
        <h2
          className="text-2xl lg:text-4xl font-bold text-neutral-900 dark:text-neutral-100 whitespace-nowrap"
          data-aos="fade-up"
        >
          Rooms <span className="text-primary">Search</span>
        </h2>
        <p
          className="mt-4 text-neutral-700 dark:text-neutral-300"
          data-aos="zoom-in"
        >
          Search for rooms based on their availability and type.
        </p>
        <div
          className="mt-16 flex flex-wrap justify-center gap-y-4 gap-x-6 w-full mx-auto max-w-2xl"
          data-aos="fade-up"
          data-aos-anchor-placement="center-bottom"
        >
          <SearchBox />
        </div>
      </section>
      <ErrorBoundaryWithSuspense
        fallback={<ErrorBanner />}
        loadingFallback={
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              <Skeleton className="w-full h-96" key={i} />
            ))}
          </div>
        }
      >
        <ConditionalRender condition={rooms.length === 0}>
          <EmptyArea
            title="No rooms found"
            description="No rooms found based on the search criteria."
            />

        </ConditionalRender>
        <ConditionalRender condition={rooms.length > 0}>
        <div className="max-w-[1440px] mx-auto grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {rooms.map((room, i) => {
            return (
              <RoomCard
                key={room.id}
                room={room}
                user={session?.user}
                style={{
                  animationDelay: `${i * 100}ms`,
                }}
              />
            );
          })}
        </div>

        </ConditionalRender>
      </ErrorBoundaryWithSuspense>
    </>
  );
}
