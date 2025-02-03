import EmptyArea from "@/components/common/empty-area";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import { BookUser } from "lucide-react";
import type { Metadata } from "next";
import { Suspense } from "react";
import { getAttendanceRecords } from "~/actions/record.personal";
import AttendanceAnalytics from "./attendance-analytics";
import CreateAttendanceRecord from "./create-record";
import AttendanceRecord from "./record";

export const metadata: Metadata = {
  title: `Attendance | ${process.env.NEXT_PUBLIC_WEBSITE_NAME}`,
  description: "Manage your attendance records here.",
};

export default async function PersonalAttendanceManager() {
  const attendance_records = await getAttendanceRecords();

  return (
    <div className="z-10 w-full max-w-7xl relative p-4 space-y-10 @container/attendance">
      {/* Analytics Section */}
      <AttendanceAnalytics records={attendance_records} />
      {/* Header Section */}
      <div className="w-full flex justify-between items-center whitespace-nowrap gap-2">
        <h3 className="text-xl font-semibold">
          Attendance Records ({attendance_records.length})
        </h3>
        <CreateAttendanceRecordButton />
      </div>

      {/* Empty State */}
      {attendance_records.length === 0 && (
        <EmptyArea
          icons={[BookUser]}
          title="No attendance records"
          description="There are no attendance records at the moment."
          actionProps={{
            asChild: true,
            variant: "default_light",
            size: "sm",
            children: <CreateAttendanceRecordButton />,
          }}
        />
      )}

      {/* Attendance Records */}
      <Suspense fallback={<div>Loading...</div>}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {attendance_records.map((record, index) => (
            <AttendanceRecord
              record={record}
              style={{ animationDelay: `${index * 50}ms` }}
              key={record.id}
              className="animate-in popup"
            />
          ))}
        </div>
      </Suspense>
    </div>
  );
}

function CreateAttendanceRecordButton() {
  return (
    <ResponsiveDialog
      title="Create Attendance Record"
      description="Create a new attendance record for a subject."
      btnProps={{
        variant: "default_light",
        size: "sm",
        children: "Create Record",
      }}
    >
      <CreateAttendanceRecord />
    </ResponsiveDialog>
  );
}
