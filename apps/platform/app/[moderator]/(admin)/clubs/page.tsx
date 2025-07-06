import { ClubCardEdit } from "@/components/clubs/card";
import EmptyArea from "@/components/common/empty-area";
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
            prefetch={true}
          >
            Create New Club
          </ButtonLink>
        }
      />
      {clubs.length > 0 ? (
        <div className="mt-4">
          {clubs.map((club) => (
            <ClubCardEdit key={club._id} club={club} />
          ))}
        </div>
      ) : (
        <EmptyArea
          title="No Clubs Found"
          description="It seems there are no clubs available at the moment. You can create a new club using the button above."
          
        />
      )}
    </>
  );
}