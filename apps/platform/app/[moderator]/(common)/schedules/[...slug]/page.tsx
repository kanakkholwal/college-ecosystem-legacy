import { GoBackButton } from "@/components/common/go-back";
import { TimeTableEditor } from "@/components/custom/time-table";
import { notFound } from "next/navigation";
import { getDepartmentName } from "src/constants/departments";
import { getSession } from "src/lib/auth";
import { getTimeTable } from "src/lib/time-table/actions";
import { sessionType } from "src/types/session";

interface Props {
  params: {
    slug: string[];
  };
}
const super_access = ["admin", "moderator"];

export default async function Dashboard({ params }: Props) {
  const [department_code, year, semester] = params.slug as [
    string,
    string,
    string,
  ];

  const session = (await getSession()) as sessionType;

  const timetableData = await getTimeTable(
    department_code,
    Number(year),
    Number(semester)
  );
  if (!timetableData) return notFound();

  if (
    super_access.some((role) => session.user.roles.includes(role)) === false
  ) {
    if (getDepartmentName(department_code) !== session.user.department) {
      console.log("Department code mismatch");
      return notFound();
    }
  }

  return (
    <>
      <div className="flex items-center justify-between gap-2 mx-auto max-w-7xl w-full mt-20">
        <GoBackButton variant="default_light" size="sm" />
      </div>

      <TimeTableEditor timetableData={timetableData} mode="edit" />
    </>
  );
}
