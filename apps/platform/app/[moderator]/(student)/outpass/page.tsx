import OutpassList from "@/components/application/hostel/outpass-list";
import OutpassRender from "@/components/application/hostel/outpass-render";
import EmptyArea from "@/components/common/empty-area";
import { Tabs, VercelTabsList } from "@/components/ui/tabs";
import ConditionalRender from "@/components/utils/conditional-render";
import { TabsContent } from "@radix-ui/react-tabs";
import { format } from "date-fns";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { LuBuilding } from "react-icons/lu";
import { getHostelForStudent } from "~/actions/hostel";
import { getOutPassForHosteler } from "~/actions/hostel_outpass";

interface PageProps {
  searchParams: Promise<{
    slug?: string;
  }>;
}

export default async function HostelPage(props: PageProps) {
  const { slug } = await props.searchParams;

  const response = await getHostelForStudent(slug);
  if (!response.hosteler) {
    console.log("No hosteler account found for this user.", response);
    const { success, message } = response;
    return (
      <EmptyArea
        icons={[LuBuilding]}
        title="No Hosteler Account Found"
        description={message}
      />
    );
  }
  const hosteler = response.hosteler;
  const outPasses = await getOutPassForHosteler();

  return (
    <div className="space-y-5">
      <div className="p-1 mt-3 pb-3 border-b">
        <h3 className="text-base font-semibold">Hostel Outpass</h3>
        <p className="text-muted-foreground text-sm">
          Here you can view your outpass details and request new outpass.
        </p>
      </div>
      <Tabs defaultValue="outpass_list" className="w-full">
        <VercelTabsList tabs={[
          {
            id: "requested_outpass",
            label: "Requested Outpass",
          },
          {
            id: "outpass_list",
            label: "Outpass List",
          },
        ]}
        />
        <div className="mt-4">
          <TabsContent value="requested_outpass">
            <ConditionalRender condition={!!hosteler?.banned}>
              <EmptyArea
                icons={[LuBuilding]}
                title="You are banned from requesting outpass for the following reason"
                description={`${hosteler?.bannedReason} till ${hosteler?.bannedTill ? format(new Date(hosteler.bannedTill), "dd/MM/yyyy HH:mm:ss") : "N/A"}`}
              />
            </ConditionalRender>

            {/* <ConditionalRender condition={!hosteler?.banned}> */}
              <ConditionalRender condition={outPasses.length > 0}>
                <OutpassRender outpass={outPasses[0]} />
              </ConditionalRender>
            {/* </ConditionalRender> */}
          </TabsContent>
          <TabsContent value="outpass_list">
            <ConditionalRender condition={outPasses.length > 0}>
              <OutpassList outPasses={outPasses} />
            </ConditionalRender>
            <ConditionalRender condition={outPasses.length === 0}>
              <EmptyArea
                icons={[LuBuilding]}
                title="No Outpass Found"
                description="No outpass have been requested yet"
                actionProps={{
                  asChild: true,
                  children: (
                    <Link href="outpass/request">
                      Request Outpass <ArrowRight />
                    </Link>
                  ),
                  variant: "light",
                }}
              />
            </ConditionalRender>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
