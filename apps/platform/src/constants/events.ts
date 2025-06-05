import { z } from "zod";

export const eventTypes = [
  "registration",
  "exam",
  "holiday",
  "conference",
  "college_fest",
  "sports",
  "cultural",
  "webinar",
  "workshop",
  "social",
  "other",
  "meeting",
] as const;

const eventTypesEnums = z.enum(eventTypes, {
  required_error: "Event type is required",
  invalid_type_error: "Event type must be one of the predefined types",
});

export const rawEventsSchema = z.object({
  title: z
    .string()
    .min(1, "Name is required")
    .min(3, "Name must be at least 3 characters long")
    .max(
      100,
      "Name must be at most 100 characters long (enter description instead)"
    ), // Name of the event
  description: z.string(),
  links: z.array(z.string().url()).default([]), // Array of links related to the event
  time: z.date().refine((date) => new Date(date) > new Date(), {
    message: "Event time must be in the future",
  }),
  endDate: z
    .date()
    .refine((date) => new Date(date) > new Date(), {
      message: "End date must be in the future",
    })
    .optional(), // Optional end date for the event
  eventType: eventTypesEnums, // Type of event (e.g., "meeting", "holiday", etc.)
  location: z.string().optional(), // Optional location for the event
});

export type rawEventsSchemaType = z.infer<typeof rawEventsSchema>;
