import { z } from "zod";

export const marginHoursSchema = z
  .tuple([
    z.number().nonnegative(), // First element must be >= 0
    z.number().max(24), // Second element must be <= 24
  ])
  .refine(([first, second]) => first < second, {
    message: "First element must be less than the second element",
  });

export type MarginHours = z.infer<typeof marginHoursSchema>;

export type CalendarProps = {
  events: CalendarEvent[];
  setEvents: (events: CalendarEvent[]) => void;
  mode: Mode;
  setMode: (mode: Mode) => void;
  date: Date;
  setDate: (date: Date) => void;
  calendarIconIsToday?: boolean;
  editingEnabled?: boolean;
  // margin hours to show in between hours (default 0-24) and can't exceed 0-24
  margin_hours?: MarginHours;
};

export type CalendarContextType = CalendarProps & {
  newEventDialogOpen: boolean;
  setNewEventDialogOpen: (open: boolean) => void;
  manageEventDialogOpen: boolean;
  setManageEventDialogOpen: (open: boolean) => void;
  selectedEvent: CalendarEvent | null;
  setSelectedEvent: (event: CalendarEvent | null) => void;
};
export type CalendarEvent = {
  id: string;
  title: string;
  color: string;
  start: Date;
  end: Date;
  description: string;
};

export const calendarModes = ["day", "week", "month"] as const;
export type Mode = (typeof calendarModes)[number];
