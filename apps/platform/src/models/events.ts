import mongoose, { Schema, type Document } from "mongoose";
import type { rawEventsSchemaType } from "~/constants/events";

interface IEvent extends Document, rawEventsSchemaType { }

export interface ClassRoomTypeJSON extends rawEventsSchemaType {
    _id: string;
    createdAt: Date;
    updatedAt: Date;
}


const eventsSchema = new Schema<IEvent>({
    title: { type: String, required: true, minlength: 3, maxlength: 100 },
    description: { type: String },
    links: { type: [String], default: [] },
    time: {
        type: Date, required: true, validate: {
            validator: (date: Date) => date > new Date(),
            message: "Event time must be in the future"
        },

    },
    endDate: {
        type: Date, required: true, validate: {
            validator: (date: Date) => date > new Date(),
            message: "End date must be in the future"
        }
    },
    eventType: { type: String, required: true },
    location: { type: String, optional: true }
}, {
    timestamps: true
})

export const EventModel =
    mongoose.models?.Event ||
    mongoose.model<IEvent>("Event", eventsSchema);