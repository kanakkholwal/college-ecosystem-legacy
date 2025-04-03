import { useCalendarContext } from "../calendar-context";
import CalendarBodyDay from "./day/calendar-body-day";
import CalendarBodyMonth from "./month/calendar-body-month";
import CalendarBodyWeek from "./week/calendar-body-week";

export default function CalendarBody() {
  const { mode } = useCalendarContext();

  return (
    <>
      {mode === "day" && <CalendarBodyDay />}
      {mode === "week" && <CalendarBodyWeek />}
      {mode === "month" && <CalendarBodyMonth />}
    </>
  );
}
