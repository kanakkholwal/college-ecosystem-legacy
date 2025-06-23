import { HostelDetailsForNonAdmins } from "@/components/application/hostel/hostel-details";
import EmptyArea from "@/components/common/empty-area";
import { Separator } from "@/components/ui/separator";
import { LuBuilding } from "react-icons/lu";
import { getHostelByUser } from "~/actions/hostel";

export default async function HostelPageLayout(props: {
  children: React.ReactNode;
}) {
  const response = await getHostelByUser();


  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">
          Hostel Outpass Request Portal
        </h2>
        <p className="text-sm text-muted-foreground">
          Here you can view your hostel details and request outpass if you are a hosteler.
        </p>
      </div>
      {!response.success || !response.hostel ? (
        <EmptyArea
          icons={[LuBuilding]}
          title="No Hostel Found for this user"
          description={response.message}
        />
      ) : (
        <HostelDetailsForNonAdmins hostel={response.hostel} />
      )}
      <Separator />
      {props.children}
    </div>
  );
}
