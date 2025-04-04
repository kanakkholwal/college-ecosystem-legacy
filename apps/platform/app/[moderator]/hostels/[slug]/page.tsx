import { ResponsiveContainer } from "@/components/common/container";
import EmptyArea from "@/components/common/empty-area";
import { RouterCard } from "@/components/common/router-card";
import { Heading, Paragraph } from "@/components/ui/typography";
import { LuBuilding } from "react-icons/lu";
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
      <div className="flex justify-between w-full">
        <div className="w-1/2">
          <Heading level={4}>{hostel.name}</Heading>
          <Paragraph className="capitalize !mt-0">
            {hostel.gender} Hostel
          </Paragraph>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3">
        <div>
          <Heading level={5}>Warden</Heading>
          <Paragraph className="!mt-0">
            {hostel.warden.name} ({hostel.warden.email})
          </Paragraph>
        </div>
        <div>
          <Heading level={5}>
            Admin / MMCA ({hostel.administrators.length})
          </Heading>
          <ul className="list-disc list-inside">
            {hostel.administrators.map((admin) => (
              <li key={admin.email}>
                {admin.name} - {admin.email}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <ResponsiveContainer>
        <RouterCard
          Icon={LuBuilding}
          title="Room Allotment"
          description="Manage room allotment for this hostel"
          href={`/${moderator}/hostels/${slug}/allotment`}
        />
        <RouterCard
          Icon={LuBuilding}
          title="Hostel Student"
          description="View all students in this hostel"
          href={`${moderator}/hostels/${slug}/students`}
        />
        <RouterCard
          Icon={LuBuilding}
          title="Hostel Rooms"
          description="View all rooms in this hostel"
          href={`/${moderator}/hostels/${slug}/rooms`}
        />
      </ResponsiveContainer>
    </div>
  );
}
