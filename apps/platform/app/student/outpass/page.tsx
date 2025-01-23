import { HostelDetailsForHosteler } from "@/components/application/hostel/hostel-details";
import EmptyArea from "@/components/common/empty-area";
import { LuBuilding } from "react-icons/lu";
import { getHostelByUser } from "~/actions/hostel";
import type { Session } from "~/lib/auth";
import { getSession } from "~/lib/auth-server";

import {CONSTANTS} from "~/constants/outpass";

interface PageProps {
    searchParams: Promise<{
        slug?: string
    }>;
}

export default async function HostelPage(props: PageProps) {
    const { slug } = await props.searchParams;
    const session = (await getSession()) as Session;
    const { success, message, hostel,hosteler } = await getHostelByUser(slug);

    if (!success || !hostel || !hosteler) {
        return (
            <EmptyArea
                icons={[LuBuilding]}
                title="No Hostel Found for this user"
                description={message}
            />
        );
    }

    console.dir(hosteler,{depth:null})

    return (
        <div className="space-y-5 my-2">
            <HostelDetailsForHosteler hostel={hostel} />
            
            
        </div>
    );
}