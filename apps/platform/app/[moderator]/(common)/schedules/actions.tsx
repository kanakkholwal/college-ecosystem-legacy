"use server";
import { getDepartmentCode } from "src/constants/departments";
import { getSession } from "src/lib/auth-server";
import dbConnect from "src/lib/dbConnect";
import { getStudentInfo } from "src/lib/student/actions";
import Timetable, { type TimeTableWithID } from "src/models/time-table";
import type { studentInfoType } from "src/types/student";

export async function getInfo(): Promise<{
  studentInfo: studentInfoType | null
  timetables: TimeTableWithID[];
}> {
  const session = await getSession()
  if (!session) {
    return Promise.reject("Unauthorized");
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  let query: any = {};

  await dbConnect();

  if (!session.user.other_roles.includes("student")) {
    query = { department_code: getDepartmentCode(session.user.department) };
    const timetables = await Timetable.find(query).lean();

    return Promise.resolve({
      studentInfo: null,
      timetables: JSON.parse(JSON.stringify(timetables)),
    });
  }
  const studentInfo = await getStudentInfo(session.user.username);

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
