import { z } from "zod";

export const roomSchema = z.object({
  roomNumber: z.string().min(1).max(60),
  roomType: z.string(),
  capacity: z.number().nonnegative().default(0),
  currentStatus: z.enum(["available", "occupied"]),
  lastUpdatedTime: z.date(),
})