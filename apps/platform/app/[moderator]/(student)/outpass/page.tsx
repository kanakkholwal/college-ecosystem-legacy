import OutpassList from "@/components/application/hostel/outpass-list";
import OutpassRender from "@/components/application/hostel/outpass-render";
import EmptyArea from "@/components/common/empty-area";
import { Separator } from "@/components/ui/separator";
import ConditionalRender from "@/components/utils/conditional-render";
import { format } from "date-fns";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
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
  if(!hosteler){
    return (
      <EmptyArea
        icons={[LuBuilding]}
        title="No Hosteler Account Found"
        description={message}
      />
    );
  }

  const outPasses = await getOutPassForHosteler();
  console.dir(outPasses[0], { depth: null });

  return (
    <div className="space-y-5">
      <ConditionalRender condition={!!hosteler?.banned}>
        <EmptyArea
          icons={[LuBuilding]}
          title="You are banned from requesting outpass for the following reason"
          description={`${hosteler?.bannedReason} till ${hosteler?.bannedTill ? format(new Date(hosteler.bannedTill), "dd/MM/yyyy HH:mm:ss") : "N/A"}`}
        />
      </ConditionalRender>

      <ConditionalRender condition={!hosteler?.banned}>
        <ConditionalRender condition={outPasses.length > 0}>
          <OutpassRender outpass={outPasses[0]} />
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
              effect: "underline",
              variant: "link",
            }}
          />
        </ConditionalRender>
      </ConditionalRender>

      <ConditionalRender condition={outPasses.length > 0}>
        <Separator />
        <OutpassList outPasses={outPasses} />
      </ConditionalRender>
    </div>
  );
}
