"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "src/lib/auth-server";
import { db } from "~/db/connect";
import {
  personalAttendanceRecords,
  type PersonalAttendanceRecord,
  type InsertPersonalAttendanceRecord,
} from "~/db/schema/attendance_record"; // Path to your schema file
import { eq } from "drizzle-orm";

export async function createAttendanceRecord(
  attendanceRecordData: Omit<InsertPersonalAttendanceRecord, "id" | "userId" | "createdAt" | "updatedAt">
): Promise<string> {
  const session = await getSession();
  if (!session) {
    return Promise.reject("You need to be logged in to create an attendance record");
  }
  try {
    await db.insert(personalAttendanceRecords).values({
      ...attendanceRecordData,
      userId: session.user.id,
    });
    revalidatePath("/attendance");
    return "Attendance record created successfully";
  } catch (err) {
    console.error(err);
    return Promise.reject("Failed to create attendance record");
  }
}

export async function getAttendanceRecords(): Promise<PersonalAttendanceRecord[]> {
  const session = await getSession();
  if (!session) {
    return Promise.reject("You need to be logged in to fetch attendance records");
  }
  try {
    const attendanceRecords = await db
      .select()
      .from(personalAttendanceRecords)
      .where(eq(personalAttendanceRecords.userId, session.user.id));
    return attendanceRecords;
  } catch (err) {
    console.error(err);
    return Promise.reject("Failed to fetch attendance records");
  }
}

export async function updateAttendanceRecord(
  recordId: string,
  present: boolean
): Promise<string> {
  const session = await getSession();
  if (!session) {
    return Promise.reject("You need to be logged in to update an attendance record");
  }
  try {
    const record = await db
      .select()
      .from(personalAttendanceRecords)
      .where(eq(personalAttendanceRecords.id, recordId))
      .limit(1);

    if (record.length === 0 || record[0].userId !== session.user.id) {
      return Promise.reject("Attendance record not found");
    }

    const updatedAttendance = [...record[0].attendance, { date: new Date(), isPresent: present }];

    await db
      .update(personalAttendanceRecords)
      .set({
        totalClasses: record[0].totalClasses + 1,
        attendance: updatedAttendance,
        updatedAt: new Date(),
      })
      .where(eq(personalAttendanceRecords.id, recordId));

    revalidatePath("/attendance");
    return "Attendance record updated successfully";
  } catch (err) {
    console.error(err);
    return Promise.reject("Failed to update attendance record");
  }
}

export async function deleteAttendanceRecord(recordId: string): Promise<string> {
  const session = await getSession();
  if (!session) {
    return Promise.reject("You need to be logged in to delete an attendance record");
  }
  try {
    const record = await db
      .select()
      .from(personalAttendanceRecords)
      .where(eq(personalAttendanceRecords.id, recordId))
      .limit(1);

    if (record.length === 0 || record[0].userId !== session.user.id) {
      return Promise.reject("Attendance record not found");
    }

    await db.delete(personalAttendanceRecords).where(eq(personalAttendanceRecords.id, recordId));

    revalidatePath("/attendance");
    return "Attendance record deleted successfully";
  } catch (err) {
    console.error(err);
    return Promise.reject("Failed to delete attendance record");
  }
}

export async function forceUpdateAttendanceRecord(
  recordId: string,
  attendanceRecordData: Partial<Omit<InsertPersonalAttendanceRecord, "id" | "userId" | "createdAt">>
): Promise<string> {
  const session = await getSession();
  if (!session) {
    return Promise.reject("You need to be logged in to update an attendance record");
  }
  try {
    const record = await db
      .select()
      .from(personalAttendanceRecords)
      .where(eq(personalAttendanceRecords.id, recordId))
      .limit(1);

    if (record.length === 0 || record[0].userId !== session.user.id) {
      return Promise.reject("Attendance record not found");
    }

    await db
      .update(personalAttendanceRecords)
      .set({ ...attendanceRecordData, updatedAt: new Date() })
      .where(eq(personalAttendanceRecords.id, recordId));

    revalidatePath("/attendance");
    return "Attendance record updated successfully";
  } catch (err) {
    console.error(err);
    return Promise.reject("Failed to update attendance record");
  }
}
