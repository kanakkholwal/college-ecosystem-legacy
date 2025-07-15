"use server";
import dbConnect from "src/lib/dbConnect";
import { getStudentInfo } from "src/lib/student/actions";
import Timetable, { type TimeTableWithID } from "src/models/time-table";
import type { studentInfoType } from "src/types/student";
import { getSession } from "~/auth/server";

export async function getInfo(): Promise<{
  studentInfo: studentInfoType;
  timetables: TimeTableWithID[];
}> {
  const session = await getSession();

  if (!session?.user.other_roles.includes("cr")) {
    throw new Error("You are not authorized to perform this action");
  }

  await dbConnect();
  const studentInfo = await getStudentInfo(session?.user.username);

  const timetables = await Timetable.find({
    department_code: studentInfo.departmentCode,
    year: studentInfo.currentYear,
    semester: studentInfo.currentSemester,
  }).lean();

  return Promise.resolve({
    studentInfo,
    timetables: JSON.parse(JSON.stringify(timetables)),
  });
}

export async function getCrInfo() {
  const session = await getSession();

  if (!session?.user.other_roles.includes("cr")) {
    throw new Error("You are not authorized to perform this action");
  }

  await dbConnect();
  const studentInfo = await getStudentInfo(session?.user.username);
}
