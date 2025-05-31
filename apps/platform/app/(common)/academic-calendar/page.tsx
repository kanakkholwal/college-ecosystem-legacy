import { FullScreenCalendar } from "@/components/ui/calendar-full";
import type { Metadata } from "next";

type Props = {
  params: Promise<{
    moderator: string;
  }>;
  searchParams: Promise<{
    query: string;
  }>;
};

export const metadata: Metadata = {
  title: "Academic Calender",
  description: "Check the academic calender here.",
};

// Sample data: an array of { day: Date, events: MyEvent[] }
const sampleData = [
  {
    day: new Date(2025, 4, 5), // May 5, 2025
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
    day: new Date(2025, 4, 12), // May 12, 2025
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-xl font-bold mb-2">Academic Calender</h1>
      <p className="text-sm text-muted-foreground mb-4">
        Check the academic calendar here. This is a sample calendar with events
        for demonstration purposes.
      </p>
      <FullScreenCalendar data={sampleData} />
    </div>
  );
}
