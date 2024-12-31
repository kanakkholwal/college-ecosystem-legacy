import {
  integer,
  jsonb,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
  boolean,
  customType
} from "drizzle-orm/pg-core";
import type{ InferSelectModel, InferInsertModel } from 'drizzle-orm'

import { users } from "./auth-schema";
// Define a composite type for attendance
const attendanceType = customType<{
  data: { date: Date; isPresent: boolean }[];
  driverData: string;
}>({
  dataType() {
    return "jsonb";
  },
  toDriver(value) {
    // Convert the array of objects to JSON string for storage
    return JSON.stringify(value);
  },
  fromDriver(value) {
    // Parse the JSON string back into an array of objects
    return JSON.parse(value);
  },
});


// Attendance Table Schema
export const personalAttendanceRecords = pgTable("personal_attendance_records", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  subjectCode: text("subject_code").notNull(),
  subjectName: text("subject_name").notNull(),
  totalClasses: integer("total_classes").notNull(),
  attendance: attendanceType("attendance").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export type PersonalAttendanceRecord = InferSelectModel<typeof personalAttendanceRecords>;
export type InsertPersonalAttendanceRecord = InferInsertModel<typeof personalAttendanceRecords>;