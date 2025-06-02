

import { ResponsiveContainer } from "@/components/common/container";
import EmptyArea from "@/components/common/empty-area";
import { NoteSeparator } from "@/components/common/note-seperator";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { CalendarDays } from "lucide-react";
import Link from "next/link";
import { getEvents } from "~/actions/events";

type Props = {
  params: Promise<{
    moderator: string;
  }>;
  searchParams: Promise<{
    query?: string;
    from?: string;
    to?: string;
  }>;
};



export default async function ManageEventsPage(props: Props) {

  const searchParams = await props.searchParams;

  // const session = await getSession();
  const groupedEvents = await getEvents({
    query: searchParams.query || "",
    from: searchParams.from ? new Date(searchParams.from) : new Date(),
    to: searchParams.to ? new Date(searchParams.to) : new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
  });
  console.log("Events fetched for admin:", groupedEvents);

  return (
    <>
      <div className="flex flex-wrap justify-between gap-3">
        <div>

          <h2 className="text-xl font-semibold mb-2">Events</h2>
          <p className="text-sm text-muted-foreground">
            Manage your events here. You can add, edit, or delete events as needed.
          </p>
        </div>
        <div>
          <Button
            variant="default_light"
            size="sm"
            asChild>
            <Link href="/admin/events/new">
              <CalendarDays />
              Add New Event
            </Link>
          </Button>
        </div>

      </div>
      <div>
        {groupedEvents.length > 0 ? (
          <>
            <h4 className="text-base font-medium">
              Upcoming Events
            </h4>
            <div className="grid grid-cols-1 gap-4">
            {groupedEvents.map((group, idx) => {
              return <div key={`day-group-${idx.toString()}`} className="p-2">
                <NoteSeparator
                  label={`${format(group.day, "dd MMMM yyyy")}`}
                  labelClassName="p-2 text-sm font-medium"
                />
                <ResponsiveContainer>
                  {group.events.map((event) => (
                    <div key={event.id} className="bg-card rounded-lg p-3">
                      <h3 className="text-base font-medium">{event.title}</h3>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(event.time), "hh:mm a")}
                      </p>
                      <p className="text-xs text-muted-foreground">{event.description}</p>
                    </div>
                  ))}
                </ResponsiveContainer>
              </div>;
            })}
            </div>
          </>
        ) : (
          <EmptyArea
            title="No Events Found"
            description="There are no events matching your criteria."
            icons={[CalendarDays]}
          />
        )}
      </div>

    </>
  );
}
