import { addHours } from "date-fns";
import { FullCalendar } from "./full-calendar";

export default function AcademicCalendarPage() {
  return (
    <div className="max-w-7xl mx-auto px-4">
      <h1>Academic Calendar</h1>
      <p>Welcome to the Academic Calendar page!</p>

      <FullCalendar
        events={[
          {
            id: "1",
            start: new Date(),
            end: addHours(new Date(), 2),
            title: "event A",
            color: "pink",
          },
          {
            id: "2",
            start: addHours(new Date(), 1.5),
            end: addHours(new Date(), 3),
            title: "event B",
            color: "blue",
          },
        ]}
      />
    </div>
  );
}
