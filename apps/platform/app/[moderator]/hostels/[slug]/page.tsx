import { ResponsiveContainer } from "@/components/common/container";
import EmptyArea from "@/components/common/empty-area";
import { RouterCard, RouterCardLink } from "@/components/common/router-card";
import { Badge } from "@/components/ui/badge";
import { Paragraph } from "@/components/ui/typography";
import { FolderKanban, HistoryIcon, Tickets } from "lucide-react";
import { LuBuilding } from "react-icons/lu";
import { PiStudentFill } from "react-icons/pi";
import { getHostel } from "~/actions/hostel";

export default async function HostelPage({
  params,
}: {
  params: Promise<{
    moderator: string;
    slug: string;
  }>;
}) {
  const { slug, moderator } = await params;
  const response = await getHostel(slug);
  console.log(response);
  const { success, hostel } = response;

  if (!success || !hostel) {
    return (
      <EmptyArea
        icons={[LuBuilding]}
        title="No Hostel Found"
        description={`Hostel with slug ${slug} not found`}
      />
    );
  }

  return (
    <div className="space-y-5 my-2">
      <div className="bg-card p-4 rounded-lg">
        <div className="flex justify-between w-full">
          <div className="w-1/2">
            <h4 className="text-lg font-semibold">{hostel.name}</h4>
            <Badge className="mt-1" size="sm">
              {hostel.gender === "female" ? "Girls" : hostel.gender === "male" ? "Boys" : hostel.gender}
              {" "}Hostel
            </Badge>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 mt-2">
          <div>
            <h5 className="text-sm font-medium">Warden</h5>
            <Paragraph  className="!mt-0 text-sm text-muted-foreground">
              {hostel.warden.name} ({hostel.warden.email})
            </Paragraph>
          </div>
          <div>
            <h5 className="text-sm font-medium">
              Admin / MMCA ({hostel.administrators.length})
            </h5>
            <ul className="list-disc list-inside">
              {hostel.administrators.map((admin) => (
                <li
                  key={admin.email}
                  className="text-sm font-medium text-muted-foreground"
                >
                  {admin.name} - {admin.email}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <ResponsiveContainer>
        {getRoutes(moderator, slug).map((route) => (
          <RouterCard
            key={route.href}
            Icon={route.Icon}
            title={route.title}
            description={route.description}
            href={route.href}
            disabled={route?.disabled}
          />
        ))}
      </ResponsiveContainer>
    </div>
  );
}

const getRoutes = (moderator: string, slug: string) =>
  [
    {
      title: "Outpass Requests",
      description: "View all outpass requests for this hostel",
      href: `/${moderator}/hostels/${slug}/outpass-requests`,
      Icon: Tickets,
    },
    {
      title: "Outpass Logs (History)",
      description: "View all outpass logs for this hostel",
      href: `/${moderator}/hostels/${slug}/outpass-logs`,
      Icon: HistoryIcon,
    },
    {
      title: "Hostelers",
      description: "View all hostelers in this hostel",
      href: `/${moderator}/hostels/${slug}/students`,
      Icon: PiStudentFill,
    },
    {
      title: "Hostel Rooms",
      description: "View all rooms in this hostel",
      href: `/${moderator}/hostels/${slug}/rooms`,
      Icon: LuBuilding,
    },
    {
      title: "Room Allotment By Cgpi",
      description: "Room allotment feature is under development.",
      // description="Manage room allotment for this hostel"
      Icon: FolderKanban,
      href: `/${moderator}/hostels/${slug}/allotment`,
      disabled: true, // Disable for now, implement later
    },
    {
      title: "Room Allotment By SOE and Excel",
      description: "Room allotment feature is under development.",
      // description="Manage room allotment for this hostel"
      Icon: FolderKanban,
      href: `/${moderator}/hostels/${slug}/allotment-by-excel`,
      // disabled: true, // Disable for now, implement later
    },
  ] as RouterCardLink[];
