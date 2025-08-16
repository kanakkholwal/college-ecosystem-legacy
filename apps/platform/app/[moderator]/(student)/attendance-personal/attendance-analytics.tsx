import { NumberTicker } from "@/components/animation/number-ticker";
import { cn } from "@/lib/utils";
import type React from "react";
import type { PersonalAttendanceWithRecords } from "~/db/schema/attendance_record";

interface AttendanceAnalyticsProps {
  records: PersonalAttendanceWithRecords[];
}

const AttendanceAnalytics: React.FC<AttendanceAnalyticsProps> = ({
  records,
}) => {
  const totalClasses = records.reduce(
    (acc, record) => acc + record.records.length,
    0
  );
  const presentClasses = records.reduce((acc, record) => {
    return acc + record.records.filter((a) => a.isPresent).length;
  }, 0);
  const absentClasses = totalClasses - presentClasses;
  const attendancePercentage =
    totalClasses > 0
      ? ((presentClasses / totalClasses) * 100).toFixed(2)
      : "0.00";

  return (
    <div className="p-4 rounded-md bg-card ">
      <h4 className="text-lg font-medium mb-4">
        Attendance Analytics ({records.length} Subjects)
      </h4>
      <div className="grid grid-cols-1 @sm/attendance:grid-cols-2 @2xl/attendance:grid-cols-4 gap-4">
        <div className="p-3 rounded-md border">
          <h5 className="text-sm font-medium">Total Classes</h5>
          <p className="text-xl font-semibold">
            <NumberTicker value={totalClasses} />
          </p>
        </div>
        <div className="p-3 rounded-md border">
          <h5 className="text-sm font-medium">Classes Attended</h5>
          <p className="text-xl font-semibold">
            <NumberTicker value={presentClasses} className="text-green-500" />
          </p>
        </div>
        <div className="p-3 rounded-md border">
          <h5 className="text-sm font-medium">Classes Missed</h5>
          <p className="text-xl font-semibold">
            <NumberTicker value={absentClasses} className="text-red-500" />
          </p>
        </div>
        <div className="p-3 rounded-md border">
          <h5 className="text-sm font-medium whitespace-nowrap">
            Attendance Percentage
          </h5>
          <p className={cn("text-xl font-semibold")}>
            <NumberTicker
              value={parseFloat(attendancePercentage)}
              suffix="%"
              className={cn({
                "text-red-500": parseFloat(attendancePercentage) < 50,
                "text-yellow-500": parseFloat(attendancePercentage) < 75,
                "text-green-500": parseFloat(attendancePercentage) >= 75,
              })}
            />
          </p>
        </div>
      </div>
    </div>
  );
};

export default AttendanceAnalytics;
