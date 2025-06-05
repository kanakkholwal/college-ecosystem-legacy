import { HostelDetailsForNonAdmins } from "@/components/application/hostel/hostel-details";
import EmptyArea from "@/components/common/empty-area";
import { Separator } from "@/components/ui/separator";
import { LuBuilding } from "react-icons/lu";
import { getHostelByUser } from "~/actions/hostel";

export default async function HostelPageLayout(props: {
  children: React.ReactNode;
}) {
  const response = await getHostelByUser();

  if (!response.success || !response.hostel) {
    return (
      <EmptyArea
        icons={[LuBuilding]}
        title="No Hostel Found for this user"
        description={response.message}
      />
    );
  }

  return (
    <div className="space-y-5">
      <HostelDetailsForNonAdmins hostel={response.hostel} />
      <Separator />
      {props.children}
    </div>
  );
}
