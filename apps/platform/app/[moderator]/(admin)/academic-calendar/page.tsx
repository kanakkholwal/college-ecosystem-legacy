"use client";

import { FullScreenCalendar } from "@/components/ui/calendar-full";
import { format } from "date-fns";
// import type { Metadata } from "next";

type Props = {
  params: Promise<{
    moderator: string;
  }>;
  searchParams: Promise<{
    query: string;
  }>;
};

// export const metadata: Metadata = {
//   title: "Academic Calender",
//   description: "Check the academic calender here.",
// };
interface MyEvent {
  id: string;
  title: string;
  time: string; // ISO string or "HH:mm" format
  description: string;
}

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

// Renderer for full event details in the side panel
const renderEventDetails = (event: MyEvent) => (
  <div>
    <h3 className="text-sm font-medium">{event.title}</h3>
    <p className="text-xs text-muted-foreground">
      {format(new Date(event.time), "hh:mm a")}
    </p>
    <p className="text-xs text-muted-foreground mt-1">{event.description}</p>
  </div>
);

export default function AcademicCalenderPage(props: Props) {
  // const params = await props.params;
  // const searchParams = await props.searchParams;

  // const moderator = params.moderator;
  // const session = await getSession();

  return (
    <>
      <FullScreenCalendar
        data={sampleData}
        renderEventDetails={renderEventDetails}
      />
    </>
  );
}
