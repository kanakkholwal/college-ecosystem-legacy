import type { PersonalAttendanceRecord } from "~/db/schema/attendance_record";

interface WeeklyTrend {
  weekStart: Date;
  percentage: number;
  growth: -1 | 0 | 1;
}

export function calculateWeeklyTrend(
  attendanceRecords: PersonalAttendanceRecord[]
): WeeklyTrend[] {
  // Flatten all attendance records into a single array
  const allAttendance = attendanceRecords.flatMap((record) =>
    record.attendance.map((a) => ({
      date: new Date(a.date),
      isPresent: a.isPresent,
    }))
  );

  // Sort attendance by date
  allAttendance.sort((a, b) => a.date.getTime() - b.date.getTime());

  const weeklyStats: {
    [weekStart: string]: { present: number; total: number };
  } = {};

  // Group attendance by week
  for (const record of allAttendance) {
    const { date, isPresent } = record;
    const weekStart = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() - date.getDay()
    );
    const weekKey = weekStart.toISOString();

    if (!weeklyStats[weekKey]) {
      weeklyStats[weekKey] = { present: 0, total: 0 };
    }

    weeklyStats[weekKey].total++;
    if (isPresent) {
      weeklyStats[weekKey].present++;
    }
  }

  // Calculate weekly percentages and growth
  const weeklyTrend: WeeklyTrend[] = Object.entries(weeklyStats).map(
    ([weekStart, stats], index, array) => {
      const percentage = (stats.present / stats.total) * 100;
      let growth: -1 | 0 | 1 = 0;

      if (index > 0) {
        const prevWeek = array[index - 1][1];
        const prevPercentage = (prevWeek.present / prevWeek.total) * 100;
        growth =
          percentage > prevPercentage
            ? 1
            : percentage < prevPercentage
              ? -1
              : 0;
      }

      return {
        weekStart: new Date(weekStart),
        percentage,
        growth,
      };
    }
  );

  return weeklyTrend;
}

interface SubjectAttendance {
  subjectName: string;
  totalClasses: number;
  attendedClasses: number;
}

export function formatAttendanceForSubjects(
  attendanceRecords: PersonalAttendanceRecord[]
): SubjectAttendance[] {
  return attendanceRecords.map((record) => {
    const attendedClasses = record.attendance.filter((a) => a.isPresent).length;
    return {
      subjectName: record.subjectName,
      totalClasses: record.totalClasses,
      attendedClasses: attendedClasses,
    };
  });
}

export const getMonthlyAttendanceData = (
  attendanceRecords: PersonalAttendanceRecord[]
) => {
  const monthlyData: {
    [key: string]: { month: string; attended: number; absent: number };
  } = {};

  for (const record of attendanceRecords) {
    for (const { date, isPresent } of record.attendance) {
      const month = new Date(date).toLocaleString("default", {
        month: "long",
        year: "numeric",
      });

      if (!monthlyData[month]) {
        monthlyData[month] = { month, attended: 0, absent: 0 };
      }

      if (isPresent) {
        monthlyData[month].attended += 1;
      } else {
        monthlyData[month].absent += 1;
      }
    }
  }


  return Object.values(monthlyData);
};

export function getSafeAttendance(attendanceRecords: PersonalAttendanceRecord[]) {
  const atRiskSubjects = attendanceRecords
    .map((record) => {
      const totalClasses = record.totalClasses || 0;
      const attendedClasses = record.attendance.filter((a) => a.isPresent).length;

      // Avoid dividing by zero
      const attendanceRate = totalClasses > 0 ? attendedClasses / totalClasses : 1;

      return {
        subject: record.subjectName,
        totalClasses,
        attendedClasses,
        attendanceRate,
      };
    })
    .filter((data) => data.attendanceRate < 0.75);

  if (atRiskSubjects.length === 0) {
    return {
      className: "text-green-500 bg-green-500/10",
      message: "You are doing great! Keep it up.",
    };
  }

  if (atRiskSubjects.length === 1) {
    return {
      className: "text-orange-500 bg-orange-500/10",
      message: `You are missing classes for ${atRiskSubjects[0].subject}.`,
    };
  }

  return {
    className: "text-red-500 bg-red-500/10",
    message: `You are missing classes for ${atRiskSubjects.length} subjects.`,
  };
}
