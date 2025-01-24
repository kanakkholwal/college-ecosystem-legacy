import EmptyArea from "@/components/common/empty-area";
import { LuBuilding } from "react-icons/lu";
import { getHostelByUser } from "~/actions/hostel";
import type { Session } from "~/lib/auth";
import { getSession } from "~/lib/auth-server";
import RequestOutPassForm from "@/components/application/hostel/outpass-request-form";
import { CONSTANTS } from "~/constants/outpass";
import { createOutPass } from "~/actions/hostel_outpass";
import ConditionalRender from "@/components/utils/conditional-render";
import type { Metadata } from "next";

interface PageProps {
    searchParams: Promise<{
        slug?: string
    }>;
}

export const metadata:Metadata = {
    title: 'Request Outpass',
    description: 'Request Outpass'
}

export default async function RequestOutPassPage(props: PageProps) {
    const { slug } = await props.searchParams;
    const session = (await getSession()) as Session;
    const { success, message, hostel, hosteler } = await getHostelByUser(slug);

    if (!success || !hosteler) {
        return (
            <EmptyArea
                icons={[LuBuilding]}
                title="No Hostel Found for this user"
                description={message}
            />
        );
    }

    console.dir(hosteler, { depth: null })

    return (
        <div className="space-y-5 my-2">
            <ConditionalRender condition={!hosteler.banned}>
                <RequestOutPassForm student={hosteler} onSubmit={createOutPass} />
            </ConditionalRender>
            <ConditionalRender condition={hosteler.banned}>
                <EmptyArea  icons={[LuBuilding]} title="You are banned from requesting outpass for the following reason"
                    description={`${hosteler.bannedReason} till ${hosteler.bannedTill ? new Date(hosteler.bannedTill).toLocaleString() : 'N/A'}`}
                />
            </ConditionalRender>


        </div>
    );
}