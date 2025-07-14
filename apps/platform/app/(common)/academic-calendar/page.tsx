import { EventCard } from "@/components/application/event-card";
import { ResponsiveContainer } from "@/components/common/container";
import EmptyArea from "@/components/common/empty-area";
import { StaticStep } from "@/components/common/step";
import { FullScreenCalendar } from "@/components/ui/calendar-full";
import { Tabs, TabsContent, VercelTabsList } from "@/components/ui/tabs";
import ConditionalRender from "@/components/utils/conditional-render";
import { ButtonLink } from "@/components/utils/link";
import { format } from "date-fns";
import { ArrowUpRight, CalendarDays } from "lucide-react";
import type { Metadata } from "next";
import { getEvents } from "~/actions/events";
import { getSession } from "~/lib/auth-server";

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

export const metadata: Metadata = {
  title: "Academic Calender",
  description: "Check the academic calender here.",
  alternates: {
    canonical: '/academic-calendar',
  },
  keywords: [
    "NITH",
    "Academic Calender",
    "NITH Academic Calender",
    "NITH Events",
    "NITH Important Dates",
    "NITH Calendar",
    "Academic Events",
    "College Events",
    "NITH College Events",
  ]
};

export default async function AcademicCalenderPage(props: Props) {
  const searchParams = await props.searchParams;

  // const session = await getSession();
  const groupedEvents = await getEvents({
    query: searchParams.query || "",
    from: searchParams.from ? new Date(searchParams.from) : "",
    to: searchParams.to ? new Date(searchParams.to) : "",
  });

  const session = await getSession();
  if (session?.user?.role === "admin") {
    console.log("Events fetched for admin:", groupedEvents);
  }

  return (
    <div className="max-w-6xl mx-auto px-4 pt-10 space-y-6 pb-5">
      {/* schema event */}
      <div className="bg-card p-4 lg:p-5 rounded-lg">
        <h1 className="text-xl font-semibold mb-2">
          <CalendarDays className="inline-block size-5 mr-2" />
          Academic Calender
        </h1>
        <p className="text-sm text-muted-foreground mb-4 text-pretty line-clamp-3">
          Check the events and important dates in the academic calendar. This
          calendar is designed to help students and faculty stay informed about
          key academic events, including semester start and end dates,
          examination periods, holidays, and other important academic
          milestones.
        </p>
        <ButtonLink
          href="https://nith.ac.in/uploads/topics/17244223408638.pdf"
          size="sm"
          variant="dark"
          target="_blank"
          effect="shine"

          >
          <CalendarDays  />
          View Official Calendar
          <ArrowUpRight />
        </ButtonLink>
      </div>
      <Tabs defaultValue="calendar" className="bg-card p-4 lg:p-5 rounded-lg">
        <VercelTabsList
          className="mb-4 mx-auto"
          tabs={[
            {
              label: "Calendar View",
              id: "calendar",
            },
            {
              label: "List View",
              id: "list",
            },
          ]}
          onTabChangeQuery="view_mode"
        />
        <TabsContent value="calendar">
          <FullScreenCalendar
            data={groupedEvents}
            onNewEventRedirectPath={session?.user?.role === "admin" ? "/admin/events/new" : undefined}
          />
        </TabsContent>
        <TabsContent value="list">
          <ConditionalRender condition={groupedEvents.length === 0}>
            <EmptyArea
              title="No Events Found"
              description="There are no events available in the academic calendar at the moment. Please check back later or contact the administration for more information."
              icons={[CalendarDays]}
            />
          </ConditionalRender>
          {groupedEvents.map((group, idx) => {
            return <StaticStep
              key={group.day.toString()}
              step={idx + 1}
              title={format(group.day, "EEEE, MMMM dd, yyyy")}
            >
              <ResponsiveContainer>
                {group.events.map((event) => {
                  return <EventCard
                    key={event.id}
                    event={event}
                  />;
                })}

              </ResponsiveContainer>
            </StaticStep>;
          })}
        </TabsContent>
      </Tabs>
    </div>
  );
}
