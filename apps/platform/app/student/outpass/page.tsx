import { HostelDetailsForHosteler } from "@/components/application/hostel/hostel-details";
import OutpassRender from "@/components/application/hostel/outpass-render";
import EmptyArea from "@/components/common/empty-area";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/typography";
import ConditionalRender from "@/components/utils/conditional-render";
import Link from "next/link";
import { LuBuilding } from "react-icons/lu";
import { getHostelByUser } from "~/actions/hostel";
import { getOutPassForHosteler } from "~/actions/hostel_outpass";

interface PageProps {
    searchParams: Promise<{
        slug?: string
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

    const outPasses = await getOutPassForHosteler()
    console.dir(outPasses[0],{depth:null})
    return (
        <div className="space-y-5 my-2">
            <HostelDetailsForHosteler hostel={hostel} />
            <Separator />
            <ConditionalRender condition={!hosteler.banned}>
                <div className="flex justify-between items-center w-full gap-2">
                    <Heading level={5}>Requested OutPass</Heading>
                    <Button variant="link" effect="underline">
                        <Link href="request">
                            Request Outpass
                        </Link>
                    </Button>
                </div>
                <OutpassRender outpass={outPasses[0]} />
            </ConditionalRender>
            <ConditionalRender condition={hosteler.banned}>
                <EmptyArea icons={[LuBuilding]} title="You are banned from requesting outpass for the following reason"
                    description={`${hosteler.bannedReason} till ${hosteler.bannedTill ? new Date(hosteler.bannedTill).toLocaleString() : 'N/A'}`}
                />
            </ConditionalRender>
            <Separator />

        </div>
    );
}