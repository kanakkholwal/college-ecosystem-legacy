import { atom } from "jotai";
import type { RawTimetable, TimeTableWithID } from "src/models/time-table";
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

const initialTimetableData: FormattedTimetable = {
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
        [] as FormattedTimetable["schedule"][number]["timeSlots"][number]["events"],
    })),
  })),
};

export const timetableDataAtom = atom<FormattedTimetable>(initialTimetableData);
export const editingEventAtom = atom({
  dayIndex: 0,
  timeSlotIndex: 0,
  eventIndex: 0,
});
export const isEditingAtom = atom(false);
export const disabledAtom = atom(false);
