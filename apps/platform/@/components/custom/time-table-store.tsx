

import { create } from 'zustand';
import { FormattedTimetable } from './time-table';
import { daysMap, timeMap } from "./time-table-constants";


export type TimeTableState = {
    timetableData: FormattedTimetable
    isEditing: boolean;
    editingEvent: {
        dayIndex: number;
        timeSlotIndex: number;
        eventIndex: number;
    };
};


export const useTimetableStore = create<TimeTableState>((set) => ({
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
                events: [] as FormattedTimetable['schedule'][0]['timeSlots'][0]['events']
            }))
        }))
    },
    isEditing: false,
    editingEvent: {
        dayIndex: 0,
        timeSlotIndex: 0,
        eventIndex: 0
    },
}))
