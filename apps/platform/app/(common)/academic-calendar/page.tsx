import { FullScreenCalendar } from "@/components/ui/calendar-full";
import { CalendarDays } from "lucide-react";
import type { Metadata } from "next";

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

// Sample data: an array of { day: Date, events: MyEvent[] }
const sampleData = [
  {
    day: new Date(2025, 5, 5), // May 5, 2025
    events: [
      {
        id: "1",
        title: "Team Standup",
        time: "2025-05-05T09:00:00",
        description: "Daily sync with engineering team",
      },
      {
        id: "2",
        title: "Project Kickoff",
        time: "2025-05-05T14:30:00",
        description: "Kickoff meeting for the new feature",
      },
    ],
  },
  {
    day: new Date(2025, 5, 12), // May 12, 2025
    events: [
      {
        id: "3",
        title: "Design Review",
        time: "2025-05-12T11:00:00",
        description: "Review UI mockups with design team",
      },
    ],
  },
];

export default function AcademicCalenderPage(props: Props) {
  // const params = await props.params;
  // const searchParams = await props.searchParams;

  // const moderator = params.moderator;
  // const session = await getSession();
  // const events = await getEvents({
  //   moderator,
  //   query: searchParams.query,
  //   from: searchParams.from,
  //   to: searchParams.to,
  // });

  return (
    <div className="max-w-6xl mx-auto px-4 pt-10 space-y-6 pb-5">
      <div className="bg-card p-4 lg:p-5 rounded-lg">
        <h1 className="text-xl font-semibold mb-2">
          <CalendarDays className="inline-block size-5 mr-2" />
          Academic Calender
        </h1>
        <p className="text-sm text-muted-foreground mb-4 text-pretty">
          Check the events and important dates in the academic calendar.
          This calendar is designed to help students and faculty stay informed
          about key academic events, including semester start and end dates,
          examination periods, holidays, and other important academic milestones.
        </p>
      </div>
      <div className="bg-card p-4 lg:p-5 rounded-lg">
        <FullScreenCalendar data={sampleData} />
      </div>
    </div>
  );
}
