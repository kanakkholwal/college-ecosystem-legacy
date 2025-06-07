import { FullScreenCalendar } from "@/components/ui/calendar-full";
import { CalendarDays } from "lucide-react";
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
      <div className="bg-card p-4 lg:p-5 rounded-lg">
        <h1 className="text-xl font-semibold mb-2">
          <CalendarDays className="inline-block size-5 mr-2" />
          Academic Calender
        </h1>
        <p className="text-sm text-muted-foreground mb-4 text-pretty">
          Check the events and important dates in the academic calendar. This
          calendar is designed to help students and faculty stay informed about
          key academic events, including semester start and end dates,
          examination periods, holidays, and other important academic
          milestones.
        </p>
      </div>
      <div className="bg-card p-4 lg:p-5 rounded-lg">
        <FullScreenCalendar
          data={groupedEvents}
          onNewEventRedirectPath={session?.user?.role === "admin" ? "/admin/events/new" : undefined}
        />
      </div>
    </div>
  );
}
