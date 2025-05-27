import { z } from "zod";

export const roomTypes = ["classroom", "conference", "office", "lab"] as const;

export const roomSchema = z.object({
  roomNumber: z.string().min(1).max(60),
  roomType: z.enum(roomTypes).default("classroom"),
  capacity: z.number().nonnegative().gte(1).default(0),
  currentStatus: z.enum(["available", "occupied"]).default("available"),
  lastUpdatedTime: z.date(),
});
