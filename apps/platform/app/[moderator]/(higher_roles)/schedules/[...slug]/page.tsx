import { TimeTableEditor } from "@/components/custom/time-table";
import { PreviousPageLink } from "@/components/utils/link";
import { notFound } from "next/navigation";
import { getTimeTable } from "src/lib/time-table/actions";

interface Props {
  params: Promise<{
    slug: string[];
  }>;
}

export default async function Dashboard(props: Props) {
  const params = await props.params;
  const [department_code, year, semester] = params.slug as [
    string,
    string,
    string,
  ];

  const timetableData = await getTimeTable(
    department_code,
    Number(year),
    Number(semester)
  );
  if (!timetableData) return notFound();

  return (
    <>
      <div className="flex items-center justify-between gap-2 mx-auto max-w-7xl w-full mt-20">
        <PreviousPageLink variant="default_light" size="sm" />
      </div>

      <TimeTableEditor timetableData={timetableData} mode="edit" />
    </>
  );
}
