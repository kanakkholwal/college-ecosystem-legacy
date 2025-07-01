import { HostelDetailsForNonAdmins } from "@/components/application/hostel/hostel-details";
import { ResponsiveContainer } from "@/components/common/container";
import EmptyArea from "@/components/common/empty-area";
import { NoteSeparator } from "@/components/common/note-separator";
import { RouterCard, RouterCardLink } from "@/components/common/router-card";
import { FolderKanban, HistoryIcon, Tickets } from "lucide-react";
import { LuBuilding } from "react-icons/lu";
import { PiStudentFill } from "react-icons/pi";
import { getHostelByUser } from "~/actions/hostel";


export default async function WardenDashboard({ role }: { role: string }) {
  const { success, message, hostel, hosteler } = await getHostelByUser();

  if (!success || !hostel || !hosteler) {
    return (
      <EmptyArea
        icons={[LuBuilding]}
        title="No Hostel assigned for this user"
        description={message}
      />
    );
  }

  return (
    <div className="space-y-5 my-2">
      <HostelDetailsForNonAdmins hostel={hostel} />
      <NoteSeparator
        label={"Actions for " + role}
        className="p-0"
      />
      <ResponsiveContainer>
        {routes.map((route) => (
          <RouterCard
            key={route.href}
            Icon={route.Icon}
            title={route.title}
            description={route.description}
            href={role + "/" + route.href + "?hostel_slug=" + hostel.slug}
            disabled={route?.disabled}
          />
        ))}
      </ResponsiveContainer>
    </div>
  );
}
const routes = [
  {
    title: "Outpass Requests",
    description: "View all outpass requests for this hostel",
    href: `outpass-requests`,
    Icon: Tickets,
  },
  {
    title: "Outpass Logs (History)",
    description: "View all outpass logs for this hostel",
    href: `outpass-logs`,
    Icon: HistoryIcon,
  },
  {
    title: "Hostelers",
    description: "View all hostelers in this hostel",
    href: `students`,
    Icon: PiStudentFill,
  },
  {
    title: "Hostel Rooms",
    description: "View all rooms in this hostel",
    href: `rooms`,
    Icon: LuBuilding,
  },
  {
    title: "Room Allotment By Cgpi",
    description: "Room allotment feature is under development.",
    // description="Manage room allotment for this hostel"
    Icon: FolderKanban,
    href: `allotment`,
    disabled: true, // Disable for now, implement later
  },
  {
    title: "Room Allotment By SOE and Excel",
    description: "Room allotment feature is under development.",
    // description="Manage room allotment for this hostel"
    Icon: FolderKanban,
    href: `allotment-by-excel`,
    // disabled: true, // Disable for now, implement later
  },
] as RouterCardLink[];
