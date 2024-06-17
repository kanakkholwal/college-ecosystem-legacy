import mongoose, { Document, Schema, Types } from 'mongoose';
import { DEPARTMENTS_LIST } from 'src/constants/departments';

import * as z from 'zod';

export const rawTimetableSchema = z.object({
    department_code: z.string().refine(val => DEPARTMENTS_LIST.map(dept => dept.code).includes(val), { message: 'Invalid department code' }),
    sectionName: z.string(),
    year: z.number().int().min(1, 'Year should be greater than 0'),
    semester: z.number().int().min(1, 'Semester should be greater than 0'),
    schedule: z.array(z.object({
        day: z.number().int().min(0).max(6),
        timeSlots: z.array(z.object({
            startTime: z.number().int().min(0).max(9),
            endTime: z.number().int().min(0).max(10),
            events: z.array(z.object({
                title: z.string(),
                description: z.string().optional()
            }))
        }))
    }))
});

export type RawTimetableType = z.infer<typeof rawTimetableSchema>;


export interface RawEvent {
    title: string;
    description?: string;
}
export interface IEvent extends Document, RawEvent { }

export interface rawTimeSlot {
    startTime: number;
    endTime: number;
    events: RawEvent[];
}
export interface ITimeSlot extends Document, rawTimeSlot { }

export interface rawDaySchedule {
    day: number;
    timeSlots: rawTimeSlot[];
}
export interface IDaySchedule extends Document, rawDaySchedule { }


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
export interface TimeTableWithID extends PublicTimetable {
    _id: string,
    createdAt?: Date;
    updatedAt?: Date;
}
export interface ITimetable extends Document, PublicTimetable {
    bookmarks: Types.ObjectId[];
    views: number;
}




const timetableSchema = new Schema<ITimetable>({
    department_code: { type: String, required: true, enum: DEPARTMENTS_LIST.map(dept => dept.code), trim: true },
    sectionName: { type: String, required: true },
    year: { type: Number, required: true, min: 1, max: 5 },
    semester: { type: Number, required: true, min: 1, max: 10 },
    schedule: [{
        day: { type: Number, required: true, min: 0, max: 6 },
        timeSlots: [{
            startTime: { type: Number, required: true, min: 0, max: 9 },
            endTime: { type: Number, required: true, min: 0, max: 10 },
            events: [{
                title: { type: String, required: true },
                description: { type: String }
            }]
        }]
    }],
    author: { type: Schema.Types.ObjectId, ref: 'User' },
}, {
    timestamps: true
});



const Timetable = mongoose.models.Timetable || mongoose.model<ITimetable>('Timetable', timetableSchema);

export default Timetable;

