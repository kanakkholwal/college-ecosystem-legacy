import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import type { Metadata, ResolvingMetadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTimeTable } from "~/lib/time-table/actions";

import TimeTableViewer from "@/components/custom/time-table/viewer";

interface Props {
  params: Promise<{
    slug: string[];
  }>;
}


export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const { slug } = await params;
  const [department_code, year, semester] = slug;

  return {
    title: `Semester ${semester} - ${year} | ${department_code} | Timetable`,
    description: `Timetable for ${department_code} department for semester ${semester} of year ${year}`,
  };
}

export default async function Dashboard({ params }: Props) {
  const { slug } = await params;
  const [department_code, year, semester] = slug;

  const timetableData = await getTimeTable(
    department_code,
    Number(year),
    Number(semester)
  );
  if (!timetableData) return notFound();

  return (
    <>
      <div className="flex justify-start gap-2 mr-auto w-full mt-5 p-3">
        <Button variant="default_light" size="sm" asChild>
          <Link href={"/schedules"}>
            <ArrowLeft /> 
            Go Back
          </Link>
        </Button>
      </div>

      <TimeTableViewer timetableData={timetableData} />
    </>
  );
}
