import { DonutChart } from '@tremor/react';
import { updateAttendanceRecord } from "src/lib/attendance/personal.actions";
import { AttendanceRecordWithId } from 'src/models/attendance-record';
import UpdateAttendanceRecord from "./update-record";
interface AttendanceRecordProps {
  record: AttendanceRecordWithId,
  style?: React.CSSProperties
}
const ATTENDANCE_CRITERIA = 75;

export default function AttendanceRecord({ record, style }: AttendanceRecordProps) {

  const attendance = [
    {
      name: "Present",
      value: record.attendance.filter((a) => a.isPresent).length
    },
    {
      name: "Absent",
      value: record.attendance.filter((a) => !a.isPresent).length
    }
  ]
  return (
    <div className="flex flex-col p-3 gap-2 rounded-lg border-b border-border hover:bg-white/30 animate-in popup" style={style}>

      <div className="flex items-center gap-2 w-full justify-between flex-wrap">
        <div className="flex items-start flex-col">
          <h4 className="text-sm tracking-wide font-semibold text-gray-900 dark:text-white">
            {record.subjectName.replaceAll("&amp;", "&")}
          </h4>
          <p className="text-xs text-gray-600">{record.subjectCode}</p>
        </div>
        <div>
          <DonutChart
            data={attendance}
            category="value"
            index="name"
            colors={['emerald', 'amber']}
            className="w-16 h-16"

          />
        </div>
      </div>
      <p>
        Attendance: {record.attendance.filter((a) => a.isPresent).length}/{record.totalClasses}
      </p>
      <div className="flex item-baseline w-full gap-2 justify-between">
        <p className="text-sm font-semibold text-slate-700">
          {getAttendanceStatus(record)}
        </p>
        <UpdateAttendanceRecord updateAttendanceRecord={updateAttendanceRecord.bind(null, record._id)} />
      </div>
    </div>
  )


}

const attendancePercentage = (record: AttendanceRecordWithId) => {
  return ((record.attendance.filter((a) => a.isPresent).length / record.totalClasses) * 100)
};


const getAttendanceStatus = (record: AttendanceRecordWithId) => {
  const classesAttended = record.attendance.filter((a) => a.isPresent).length;
  const totalClasses = record.totalClasses;
  const requiredPercentage = ATTENDANCE_CRITERIA / 100;

  if (totalClasses === 0) {
    return "Start attending classes to get status";
  }

  const targetClasses = Math.ceil(totalClasses * requiredPercentage);
  const attendanceShortfall = targetClasses - classesAttended;
  const possibleFutureClasses = Math.ceil(attendanceShortfall / (1 - requiredPercentage));
  const currentPercentage = attendancePercentage(record);

  if (currentPercentage >= ATTENDANCE_CRITERIA) {
    if (attendanceShortfall <= 0) {
      return `On Track, You can't miss the next class.`;
    } else if (attendanceShortfall === 1) {
      return `On Track, You may leave the next class.`;
    } else {
      return `On Track, You may leave the next ${attendanceShortfall} classes.`;
    }
  } else {
    if (possibleFutureClasses === 1) {
      return "Attend next class to get back on track.";
    } else {
      return `Attend the next ${possibleFutureClasses} classes to get back on track.`;
    }
  }
};