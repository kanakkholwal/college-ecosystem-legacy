"use client";
import { OutpassDetails } from "@/components/application/hostel/outpass";
import { ResponsiveContainer } from "@/components/common/container";
import EmptyArea from "@/components/common/empty-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ConditionalRender from "@/components/utils/conditional-render";
import { SkeletonCardArea } from "@/components/utils/skeleton-cards";
import { LoaderCircle } from "lucide-react";
import { useParams } from "next/navigation";
import { LuBuilding } from "react-icons/lu";
import useSWR, { type Fetcher } from "swr";
import { OUTPASS_STATUS } from "~/constants/hostel.outpass";
import type { OutPassType } from "~/models/hostel_n_outpass";
import { changeCase } from "~/utils/string";

interface OutpassResponse {
  totalPages: number;
  currentPage: number;
  totalCount: number;
  groupedOutPasses: Record<OutPassType["status"], OutPassType[]>;
}
const fetcher: Fetcher<OutpassResponse, string> = async (url: string) => {
  const res = await fetch(url);

  // If the status code is not in the range 200-299,
  // we still try to parse and throw it.
  if (!res.ok) {
    const error = new Error("An error occurred while fetching the data.");
    // Attach extra info to the error object.
    error.cause = await res.json();
    error.stack = res.status.toString();
    throw error;
  }

  return res.json();
};

export default function OutPassRequestsPage() {
  const { slug } = useParams();
  const { data, error, isLoading } = useSWR<OutpassResponse>(
    "/api/outpass/list?slug=" + slug,
    fetcher,
    {
      revalidateOnMount: true,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      refreshInterval: 1000 * 60,
    }
  );
  console.log(data, error, isLoading);

  return (
    <div className="space-y-5">
      <div>
        <h4 className="text-lg font-semibold">Outpass Requests</h4>
        <p className="text-sm text-muted-foreground">
          Check outpass requests here.
        </p>
      </div>

      <Tabs defaultValue={OUTPASS_STATUS[0]}>
        <TabsList>
          {isLoading && (
            <div className="flex items-center justify-center px-2">
              <LoaderCircle className="animate-spin text-primary size-4" />
            </div>
          )}
          {OUTPASS_STATUS.map((status) => {
            return (
              <TabsTrigger key={status} value={status} className="capitalize">
                {changeCase(status, "title")}
              </TabsTrigger>
            );
          })}
        </TabsList>
        <div className="p-3" aria-label="outpass requests">
          <ConditionalRender condition={isLoading}>
            <SkeletonCardArea
              className="mx-auto"
              skeletonClassName="bg-gray-200"
              count={8}
            />
          </ConditionalRender>
          <ConditionalRender condition={!!error}>
            <EmptyArea
              icons={[LuBuilding]}
              title="Error fetching outpass requests"
              className="border-destructive bg-destructive/10 text-destructive hover:bg-destructive/20 hover:border-destructive hover:text-destructive"
              description={
                error?.toString() ||
                "An error occurred while fetching outpass requests."
              }
            />
          </ConditionalRender>
          <ConditionalRender condition={!!data}>
            {OUTPASS_STATUS.map((status, index) => {
              return (
                <TabsContent key={status + index.toString()} value={status}>
                  <ResponsiveContainer>
                    {data?.groupedOutPasses[status]?.map((outpass) => {
                      return (
                        <OutpassDetails
                          key={outpass._id}
                          outpass={outpass}
                          actionEnabled={status === "pending"}
                        />
                      );
                    })}
                  </ResponsiveContainer>
                  <ConditionalRender
                    condition={
                      data?.groupedOutPasses[status] === undefined ||
                      data?.groupedOutPasses[status]?.length === 0
                    }
                  >
                    <EmptyArea
                      icons={[LuBuilding]}
                      title={`No ${changeCase(status, "title")} Outpass Requests Found`}
                      description={`No outpass requests found for ${status} status.`}
                    />
                  </ConditionalRender>
                </TabsContent>
              );
            })}
          </ConditionalRender>
        </div>
      </Tabs>
    </div>
  );
}
