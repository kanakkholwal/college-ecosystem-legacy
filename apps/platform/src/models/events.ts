import mongoose, { Schema, type Document } from "mongoose";
import type { rawEventsSchemaType } from "~/constants/events";

interface IEvent extends Document, rawEventsSchemaType {}

export interface EventJSONType extends rawEventsSchemaType {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

const eventsSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true, minlength: 3 },
    description: { type: String },
    links: { type: [String], default: [] },
    time: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      validate: {
        validator: function (value: Date) {
          // Ensure endDate is after time if both are provided
          if (this.time && value) {
            return new Date(value) > new Date(this.time);
          }
          return true;
        },
        message: "End date must be after the event time",
      },
      optional: true,
      default: null,
    },
    eventType: { type: String, required: true },
    location: { type: String, optional: true },
  },
  {
    timestamps: true,
  }
);

export const EventModel =
  mongoose.models?.Event || mongoose.model<IEvent>("Event", eventsSchema);
