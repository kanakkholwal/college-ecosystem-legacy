"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "src/lib/auth";
import dbConnect from "src/lib/dbConnect";
import AttendanceRecord, {
  AttendanceRecordWithId,
  RawAttendanceRecord,
} from "src/models/attendance-record";

export async function createAttendanceRecord(
  attendanceRecordData: RawAttendanceRecord
) {
  const session = await getSession();
  if (!session) {
    return Promise.reject(
      "You need to be logged in to create a attendance record"
    );
  }
  try {
    await dbConnect();
    // Validate the attendance record data
    const attendanceRecord = new AttendanceRecord({
      ...attendanceRecordData,
      userId: session.user._id,
      attendance: [],
    });
    await attendanceRecord.save();
    revalidatePath(`/attendance`, "page");
    return Promise.resolve("Attendance record created successfully");
  } catch (err) {
    console.error(err);
    return Promise.reject("Failed to create attendance record");
  }
}
export async function getAttendanceRecords(): Promise<
  AttendanceRecordWithId[]
> {
  try {
    const session = await getSession();
    if (!session) {
      return Promise.reject(
        "You need to be logged in to fetch attendance records"
      );
    }
    await dbConnect();
    const attendanceRecords = await AttendanceRecord.find({
      userId: session.user._id,
    });
    return Promise.resolve(JSON.parse(JSON.stringify(attendanceRecords)));
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
    return Promise.reject(
      "You need to be logged in to update a attendance record"
    );
  }
  try {
    await dbConnect();
    // Validate the attendance record data
    const attendanceRecord = await AttendanceRecord.findOne({
      _id: recordId,
      userId: session.user._id,
    });
    if (!attendanceRecord) {
      return Promise.reject("Attendance record not found");
    }
    attendanceRecord.totalClasses += 1;
    attendanceRecord.attendance.push({
      date: new Date(),
      isPresent: present,
    });
    await attendanceRecord.save();
    revalidatePath(`/attendance`, "page");
    return Promise.resolve("Attendance record updated successfully");
  } catch (err) {
    console.error(err);
    return Promise.reject("Failed to update attendance record");
  }
}
export async function deleteAttendanceRecord(recordId: string) {
  const session = await getSession();
  if (!session) {
    return Promise.reject(
      "You need to be logged in to delete a attendance record"
    );
  }
  try {
    await dbConnect();
    // Validate the attendance record data
    const attendanceRecord = await AttendanceRecord.findOne({
      _id: recordId,
      userId: session.user._id,
    });
    if (!attendanceRecord) {
      return Promise.reject("Attendance record not found");
    }
    await attendanceRecord.delete();
    revalidatePath(`/attendance`, "page");
    return Promise.resolve("Attendance record deleted successfully");
  } catch (err) {
    console.error(err);
    return Promise.reject("Failed to delete attendance record");
  }
}
export async function forceUpdateAttendanceRecord(
  recordId: string,
  attendanceRecordData: Partial<RawAttendanceRecord>
) {
  const session = await getSession();
  if (!session) {
    return Promise.reject(
      "You need to be logged in to update a attendance record"
    );
  }
  try {
    await dbConnect();
    // Validate the attendance record data
    const attendanceRecord = await AttendanceRecord.findOne({
      _id: recordId,
      userId: session.user._id,
    });
    if (!attendanceRecord) {
      return Promise.reject("Attendance record not found");
    }
    await attendanceRecord.updateOne({
      ...attendanceRecordData,
    });
    revalidatePath(`/attendance`, "page");
    return Promise.resolve("Attendance record updated successfully");
  } catch (err) {
    console.error(err);
    return Promise.reject("Failed to update attendance record");
  }
}
