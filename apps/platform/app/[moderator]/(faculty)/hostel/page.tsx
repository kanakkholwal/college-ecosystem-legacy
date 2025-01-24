import { HostelDetail } from "@/components/application/hostel/hostel-details";
import EmptyArea from "@/components/common/empty-area";
import { LuBuilding } from "react-icons/lu";
// import { IN_CHARGES_EMAILS } from "~/constants/hostel_n_outpass"
import { getHostelByUser } from "~/actions/hostel";
import type { Session } from "~/lib/auth";
import { getSession } from "~/lib/auth-server";

interface PageProps {
  searchParams: Promise<{
    slug?: string;
  }>;
}

export default async function HostelPage(props: PageProps) {
  const { slug } = await props.searchParams;
  const session = (await getSession()) as Session;
  const { success, message, hostel } = await getHostelByUser(slug);

  if (!success || !hostel) {
    return (
      <EmptyArea
        icons={[LuBuilding]}
        title="No Hostel Found for this user"
        description={message}
      />
    );
  }

  return (
    <div className="space-y-5 my-2">
      <HostelDetail hostel={hostel} />
    </div>
  );
}
