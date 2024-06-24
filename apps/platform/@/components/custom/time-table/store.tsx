import { RawTimetable, TimeTableWithID } from "src/models/time-table";
import { createStore } from "zustand";
import { daysMap, timeMap } from "./constants";

export type FormattedTimetable = TimeTableWithID | RawTimetable;

export interface TimeTableState {
  timetableData: FormattedTimetable;
  editingEvent: {
    dayIndex: number;
    timeSlotIndex: number;
    eventIndex: number;
  };
  isEditing: boolean;
  disabled?: boolean;
}

export const useTimeTableStore = createStore<TimeTableState>((set) => ({
  timetableData: {
    department_code: "",
    sectionName: "",
    year: 1,
    semester: 1,
    schedule: Array.from(daysMap.entries()).map((_, dayIndex) => ({
      day: dayIndex,
      timeSlots: Array.from(timeMap.entries()).map((_, timeSlotIndex) => ({
        startTime: timeSlotIndex,
        endTime: timeSlotIndex + 1,
        events:
          [] as FormattedTimetable["schedule"][0]["timeSlots"][0]["events"],
      })),
    })),
  },
  editingEvent: {
    dayIndex: 0,
    timeSlotIndex: 0,
    eventIndex: 0,
  },
  isEditing: false,
  disabled: false,
}));
