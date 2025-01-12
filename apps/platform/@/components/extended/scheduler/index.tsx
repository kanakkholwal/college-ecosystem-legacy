"use client";

import CalendarBody from "./body/calendar-body";
import CalendarProvider from "./calendar-provider";
import type { CalendarProps } from "./calendar-types";
import { marginHoursSchema } from "./calendar-types";
import CalendarHeaderActions from "./header/actions/calendar-header-actions";
import CalendarHeaderActionsAdd from "./header/actions/calendar-header-actions-add";
import CalendarHeaderActionsMode from "./header/actions/calendar-header-actions-mode";
import CalendarHeader from "./header/calendar-header";
import CalendarHeaderDate from "./header/date/calendar-header-date";

export default function Scheduler({
  events,
  setEvents,
  mode,
  setMode,
  date,
  setDate,
  calendarIconIsToday = true,
  editingEnabled = false,
  margin_hours = [0, 24],
}: CalendarProps) {
  const response = marginHoursSchema.safeParse(margin_hours);
  if (!response.success) {
    throw new Error(response.error.errors[0].message);
  }

  return (
    <CalendarProvider
      events={events}
      setEvents={setEvents}
      mode={mode}
      setMode={setMode}
      date={date}
      setDate={setDate}
      calendarIconIsToday={calendarIconIsToday}
      editingEnabled={editingEnabled}
      margin_hours={margin_hours}
    >
      <CalendarHeader>
        <CalendarHeaderDate />
        {editingEnabled && (
          <CalendarHeaderActions>
            <CalendarHeaderActionsMode />
            <CalendarHeaderActionsAdd />
          </CalendarHeaderActions>
        )}
      </CalendarHeader>
      <CalendarBody />
    </CalendarProvider>
  );
}
