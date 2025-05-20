import { HostelDetailsForNonAdmins } from "@/components/application/hostel/hostel-details";
import EmptyArea from "@/components/common/empty-area";
import { Separator } from "@/components/ui/separator";
import { LuBuilding } from "react-icons/lu";
import { getHostelByUser } from "~/actions/hostel";

interface LayoutProps {
  children: React.ReactNode;
}

export default async function HostelPageLayout({
  children,
  ...props
}: LayoutProps) {
  // const searchParams = await props.searchParams;
  // TODO: FIX slug layout props issue
  const { success, message, hostel, hosteler } = await getHostelByUser();

  if (!success || !hostel || !hosteler) {
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
      <HostelDetailsForNonAdmins hostel={hostel} />
      <Separator />
      {children}
    </div>
  );
}
