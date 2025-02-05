"use client";
import { OutpassDetails } from "@/components/application/hostel/outpass";
import { ResponsiveContainer } from "@/components/common/container";
import EmptyArea from "@/components/common/empty-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heading, Paragraph } from "@/components/ui/typography";
import ConditionalRender from "@/components/utils/conditional-render";
import { SkeletonCardArea } from "@/components/utils/skeleton-cards";
import { LuBuilding } from "react-icons/lu";
import useSWR, { type Fetcher } from "swr";
import { OUTPASS_STATUS } from "~/constants/outpass";
import type { OutPassType } from "~/models/hostel_n_outpass";
import useSWRMutation from 'swr/mutation'

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
  const { data, error, isLoading } = useSWR<OutpassResponse>(
    "/api/outpass/list",
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
        <Heading level={4}>Outpass Requests</Heading>
        <Paragraph className="!mt-3">Check outpass requests here.</Paragraph>
      </div>

      <ConditionalRender condition={!!error}>
        <EmptyArea
          icons={[LuBuilding]}
          title="Error fetching outpass requests"
          className="border-red-600 bg-red-200/30 text-red-600"
          description={
            error?.cause || "An error occurred while fetching outpass requests."
          }
        />
      </ConditionalRender>
      <ConditionalRender condition={isLoading}>
        <SkeletonCardArea className="mx-auto" skeletonClassName="bg-gray-200" count={8} />
      </ConditionalRender>
      <ConditionalRender condition={!!data}>
        <Tabs defaultValue={OUTPASS_STATUS[0]}>
          <TabsList>
            {OUTPASS_STATUS.map((status) => {
              return (
                <TabsTrigger
                  key={status}
                  value={status}
                  className="capitalize"
                >
                  {status}
                </TabsTrigger>
              );
            })}
          </TabsList>
          {OUTPASS_STATUS.map(
            (status, index) => {
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
                    condition={data?.groupedOutPasses[status] === undefined || data?.groupedOutPasses[status]?.length === 0}
                  >
                    <EmptyArea
                      icons={[LuBuilding]}
                      title="No outpass requests found"
                      description={`No outpass requests found for ${status} status.`}
                    />
                  </ConditionalRender>
                </TabsContent>
              );
            }
          )}
        </Tabs>
      </ConditionalRender>
    </div>
  );
}
