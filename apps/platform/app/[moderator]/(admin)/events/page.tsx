import { ResponsiveContainer } from "@/components/common/container";
import EmptyArea from "@/components/common/empty-area";
import { HeaderBar } from "@/components/common/header-bar";
import { NoteSeparator } from "@/components/common/note-separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/utils/link";
import { format } from "date-fns";
import { ArrowUpRight, CalendarDays, Plus } from "lucide-react";
import Link from "next/link";
import { getEvents } from "~/actions/common.events";

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
    to: searchParams.to
      ? new Date(searchParams.to)
      : new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
  });
  console.log("Events fetched for admin:", groupedEvents);

  return (
    <>
      <HeaderBar
        Icon={CalendarDays}
        titleNode={
          <>
            Manage Events{" "}
            <Badge size="sm">
              {groupedEvents.flatMap((group) => group.events).length} found
            </Badge>
          </>
        }
        descriptionNode="Here you can create new events or view existing ones."
        actionNode={
          <>
            <ButtonLink
              variant="dark"
              size="sm"
              effect="shineHover"
              href={`/admin/events/new`}
            >
              <Plus />
              New Event
            </ButtonLink>
            <ButtonLink
              variant="light"
              size="sm"
              effect="shineHover"
              href="/academic-calendar"
              target="_blank"
            >
              View Calendar
              <ArrowUpRight />
            </ButtonLink>
          </>
        }
      />

      <div className="px-3">
        {groupedEvents.length > 0 ? (
          <>
            <h4 className="text-base font-medium">Upcoming Events</h4>
            <div className="grid grid-cols-1 gap-4">
              {groupedEvents.map((group, idx) => {
                return (
                  <div key={`day-group-${idx.toString()}`} className="p-2">
                    <NoteSeparator
                      label={`${format(group.day, "dd MMMM yyyy")}`}
                      labelClassName="p-2 text-sm font-medium"
                    />
                    <ResponsiveContainer>
                      {group.events.map((event) => (
                        <div key={event.id} className="bg-card rounded-lg p-3">
                          <h3 className="text-base font-medium">
                            {event.title}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(event.time), "hh:mm a")}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {event.description}
                          </p>
                          <p className="text-right mt-1">
                            <Button variant="default_light" size="xs" asChild>
                              <Link href={`/admin/events/${event.id}`}>
                                View Details
                              </Link>
                            </Button>
                          </p>
                        </div>
                      ))}
                    </ResponsiveContainer>
                  </div>
                );
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
