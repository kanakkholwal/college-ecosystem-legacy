import RoomCard from "@/components/application/room-card";
import SearchBox from "@/components/application/room-search";
import { RouterCard } from "@/components/common/router-card";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorBoundaryWithSuspense } from "@/components/utils/error-boundary";
import { BadgePlus } from "lucide-react";
import type { Metadata, ResolvingMetadata } from "next";
import { changeCase } from "src/utils/string";

import { getRoomsInfo, listAllRoomsWithHistory } from "~/actions/room";
import { getSession } from "~/lib/auth-server";

type Props = {
  params: Promise<{
    moderator: string;
  }>;
  searchParams: Promise<{
    query: string;
  }>;
};

export const metadata:Metadata= {
    title:"Academic Calender",
    description:"Check the academic calender here."
}

export default async function AcademicCalenderPage(props: Props) {
  const params = await props.params;
  const searchParams = await props.searchParams;

  const moderator = params.moderator;
  const session = await getSession();

  return (
    <>
      <div>
        <h1 className="text-2xl font-bold mb-4">Rooms Overview</h1>
        <p className="text-xs text-medium font-semibold text-gray-600">
          As of {new Date().toLocaleString()}
        </p>
      </div>
    
    </>
  );
}
