import { HeaderBar } from "@/components/common/header-bar";
import { ButtonLink } from "@/components/utils/link";
import { CalendarDays } from "lucide-react";
import { getAllClubs } from "~/actions/clubs";

export default async function AllClubsPage() {
  const clubs = await getAllClubs();

  return (
    <>
      <HeaderBar
        Icon={CalendarDays}
        titleNode="Manage Clubs"
        descriptionNode="Here you can create new clubs or view existing ones."
        actionNode={
          <ButtonLink
            href="clubs/new"
            size="sm"
            variant="dark"
          >
            Create New Club
          </ButtonLink>
        }
      />
      {clubs.length > 0 ? (
        <div className="mt-4">
          {clubs.map((club) => (
            <div key={club.id} className="border-b py-4">
              <h2 className="text-xl font-semibold">{club.name}</h2>
              <p className="text-gray-600">{club.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-gray-600">No clubs found.</p>
      )}
    </>
  );
}