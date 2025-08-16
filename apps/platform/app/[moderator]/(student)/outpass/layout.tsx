import { HostelDetailsForNonAdmins } from "@/components/application/hostel/hostel-details";
import EmptyArea from "@/components/common/empty-area";
import { LuBuilding } from "react-icons/lu";
import { getHostelForStudent } from "~/actions/hostel.core";

export default async function HostelPageLayout(props: {
  children: React.ReactNode;
}) {
  const response = await getHostelForStudent();

  return (
    <div className="space-y-5">
      {!response.success || !response.hostel ? (
        <>
          <div className="space-y-1 border-b pb-4">
            <h2 className="text-lg font-semibold">
              Hostel Outpass Request Portal
            </h2>
            <p className="text-sm text-muted-foreground">
              Here you can view your hostel details and request outpass if you
              are a hosteler.
            </p>
          </div>
          <EmptyArea
            icons={[LuBuilding]}
            title="No Hostel Found for this user"
            description={
              "Please contact the administration to assign a hostel."
            }
          />
        </>
      ) : (
        <>
          <HostelDetailsForNonAdmins hostel={response.hostel} />
          {props.children}
        </>
      )}
    </div>
  );
}
