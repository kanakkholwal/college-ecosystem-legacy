"use client";
import { OutpassWithActions } from "@/components/application/hostel/outpass";
import EmptyArea from "@/components/common/empty-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heading, Paragraph } from "@/components/ui/typography";
import ConditionalRender from "@/components/utils/conditional-render";
import { LuBuilding } from "react-icons/lu";
import useSWR, { type Fetcher } from 'swr';
import type { OutPassType } from "~/models/hostel_n_outpass";

interface OutpassResponse {
  totalPages: number,
  currentPage: number,
  totalCount: number,
  groupedOutPasses: Record<OutPassType["status"], OutPassType[]>
}
const fetcher: Fetcher<OutpassResponse, string> = async (url: string) => {
  const res = await fetch(url)

  // If the status code is not in the range 200-299,
  // we still try to parse and throw it.
  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.')
    // Attach extra info to the error object.
    error.cause = await res.json()
    error.stack = res.status.toString()
    throw error
  }

  return res.json()
}

export default function OutPassRequestsPage() {
  const { data, error, isLoading } = useSWR<OutpassResponse>('/api/outpass/list', fetcher)
  console.log(data, error, isLoading)

  return (
    <div className="space-y-5">
      <div>
        <Heading level={4}>Outpass Requests</Heading>
        <Paragraph className="mt-3">
          Check outpass requests here.
        </Paragraph>
      </div>

      <ConditionalRender condition={!!error}>
        <EmptyArea
          icons={[LuBuilding]}
          title="Error fetching outpass requests"
          description={error?.cause || "An error occurred while fetching outpass requests."}
        />
      </ConditionalRender>
      <ConditionalRender condition={isLoading}>
        <EmptyArea
          icons={[LuBuilding]}
          title="Loading outpass requests"
          description="Loading outpass requests..."
        />
      </ConditionalRender>
      <ConditionalRender condition={!!data}>
        <ConditionalRender condition={Object.keys(data?.groupedOutPasses ?? {}).length === 0}>
          <EmptyArea
            icons={[LuBuilding]}
            title="No outpass requests found"
            description="No outpass requests found."
          />
        </ConditionalRender>
        <ConditionalRender condition={Object.keys(data?.groupedOutPasses ?? {}).length > 0}>
          <Tabs defaultValue={Object.keys(data?.groupedOutPasses ?? {})[0]}>
            <TabsList>
              {Object.keys(data?.groupedOutPasses ??{}).map((status) => {
                return <TabsTrigger key={status} value={status} className="capitalize">{status}</TabsTrigger>
              })}
            </TabsList>
            {Object.entries(data?.groupedOutPasses??{}).map(([status,data]) => {
              return <TabsContent key={status} value={status}>
                {data.map((outpass) => {
                  return <OutpassWithActions key={outpass._id} outpass={outpass} />
                })}
              </TabsContent>
            })}
          </Tabs>
        </ConditionalRender>
      </ConditionalRender>
    </div>
  );
}
