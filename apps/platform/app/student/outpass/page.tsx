import { HostelDetailsForHosteler } from "@/components/application/hostel/hostel-details";
import OutpassList from "@/components/application/hostel/outpass-list";
import OutpassRender from "@/components/application/hostel/outpass-render";
import EmptyArea from "@/components/common/empty-area";
import { Separator } from "@/components/ui/separator";
import ConditionalRender from "@/components/utils/conditional-render";
import { LuBuilding } from "react-icons/lu";
import { getHostelByUser } from "~/actions/hostel";
import { getOutPassForHosteler } from "~/actions/hostel_outpass";

interface PageProps {
  searchParams: Promise<{
    slug?: string;
  }>;
}

export default async function HostelPage(props: PageProps) {
  const { slug } = await props.searchParams;

  const { success, message, hostel, hosteler } = await getHostelByUser(slug);

  if (!success || !hostel || !hosteler) {
    return (
      <EmptyArea
        icons={[LuBuilding]}
        title="No Hostel Found for this user"
        description={message}
      />
    );
  }

  const outPasses = await getOutPassForHosteler();
  console.dir(outPasses[0], { depth: null });
  return (
    <div className="space-y-5 my-2">
      <HostelDetailsForHosteler hostel={hostel} />
      <Separator />
      <ConditionalRender condition={!hosteler.banned}>
        <OutpassRender outpass={outPasses[0]} />
      </ConditionalRender>
      <ConditionalRender condition={hosteler.banned}>
        <EmptyArea
          icons={[LuBuilding]}
          title="You are banned from requesting outpass for the following reason"
          description={`${hosteler.bannedReason} till ${hosteler.bannedTill ? new Date(hosteler.bannedTill).toLocaleString() : "N/A"}`}
        />
      </ConditionalRender>
      <ConditionalRender condition={outPasses.length > 0}>
        <Separator />
        <OutpassList outPasses={outPasses} />
      </ConditionalRender>
    </div>
  );
}
