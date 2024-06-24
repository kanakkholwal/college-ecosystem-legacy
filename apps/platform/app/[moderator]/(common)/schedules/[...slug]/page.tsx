import { GoBackButton } from "@/components/common/go-back";
import { TimeTableEditor } from "@/components/custom/time-table";
import { notFound } from "next/navigation";
import { getTimeTable } from "src/lib/time-table/actions";

interface Props {
  params: {
    slug: string[];
  };
}

export default async function Dashboard({ params }: Props) {
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
        <GoBackButton variant="default_light" size="sm" />
      </div>

      <TimeTableEditor timetableData={timetableData} mode="edit" />
    </>
  );
}
