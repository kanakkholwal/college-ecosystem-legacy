"use server";
import { getDepartmentCode } from "src/constants/departments";
import { getSession } from "src/lib/auth";
import dbConnect from "src/lib/dbConnect";
import { getStudentInfo } from "src/lib/student/actions";
import Timetable, { TimeTableWithID } from "src/models/time-table";
import { sessionType } from "src/types/session";
import { studentInfoType } from "src/types/student";

export async function getInfo(): Promise<{
  studentInfo: studentInfoType | null;
  timetables: TimeTableWithID[];
}> {
  const session = (await getSession()) as sessionType;

  let query: any = {};

  await dbConnect();

  if (!session.user.roles.includes("student")) {
    query = { department_code: getDepartmentCode(session.user.department) };
    const timetables = await Timetable.find(query).lean();

    return Promise.resolve({
      studentInfo: null,
      timetables: JSON.parse(JSON.stringify(timetables)),
    });
  }
  const studentInfo = await getStudentInfo(session.user.rollNo!);

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
