import {
  integer,
  jsonb,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import type{ InferSelectModel, InferInsertModel } from 'drizzle-orm'

import { users } from "./auth-schema";
// Attendance Table Schema
export const personalAttendanceRecords = pgTable(
  "personal_attendance_records",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("userId")
      .notNull()
      .references(() => users.id),
    subjectCode: text("subject_code").notNull(),
    subjectName: text("subject_name").notNull(),
    totalClasses: integer("total_classes").notNull(),
    attendance: jsonb("attendance")
      .array() // Assuming attendance will be stored as an array of objects in JSON format
      .notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  }
);

export type PersonalAttendanceRecord = InferSelectModel<typeof personalAttendanceRecords>;
export type InsertPersonalAttendanceRecord = InferInsertModel<typeof personalAttendanceRecords>;
