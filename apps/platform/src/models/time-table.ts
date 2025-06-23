import mongoose, { Document, Schema, Types } from "mongoose";
import { DEPARTMENTS_LIST } from "~/constants/departments";

export type { RawTimetableType } from "~/constants/time-table";


export interface RawEvent {
  title: string;
  description?: string;
  heldBy?: string; // e.g., "Prof. John Doe"
  _id?: string; // Unique identifier for the event
}
export type EventTypeWithID = RawEvent;
export interface IEvent extends Document, Omit<RawEvent, "_id"> {}

export interface rawTimeSlot {
  startTime: number;
  endTime: number;
  events: RawEvent[];
}
export type TimeSlotWithID = rawTimeSlot & { _id: string };
export interface ITimeSlot extends Document, rawTimeSlot {}

export interface rawDaySchedule {
  day: number;
  timeSlots: rawTimeSlot[];
}
export type DayScheduleWithID = rawDaySchedule & { _id: string };
export interface IDaySchedule extends Document, rawDaySchedule {}

export type RawTimetable = {
  department_code: string;
  sectionName: string;
  year: number;
  semester: number;
  schedule: rawDaySchedule[];
};

export interface PublicTimetable extends RawTimetable {
  author: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface TimeTableWithID {
  _id: string;
  department_code: string;
  sectionName: string;
  year: number;
  semester: number;
  schedule: DayScheduleWithID[];
  author: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITimetable extends Document, PublicTimetable {}

const timetableSchema = new Schema<ITimetable>(
  {
    department_code: {
      type: String,
      required: true,
      enum: DEPARTMENTS_LIST.map((dept) => dept.code),
      trim: true,
    },
    sectionName: { type: String, required: true },
    year: { type: Number, required: true, min: 1, max: 5 },
    semester: { type: Number, required: true, min: 1, max: 10 },
    schedule: [
      {
        day: { type: Number, required: true, min: 0, max: 6 },
        timeSlots: [
          {
            startTime: { type: Number, required: true, min: 0, max: 9 },
            endTime: { type: Number, required: true, min: 0, max: 10 },
            events: [
              {
                title: { type: String, required: true },
                description: { type: String },
                heldBy: { type: String },
                _id: { type: String}, // Unique identifier for the event
              },
            ],
          },
        ],
      },
    ],
    author: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

const Timetable =
  mongoose.models?.Timetable ||
  mongoose.model<ITimetable>("Timetable", timetableSchema);

export default Timetable;
