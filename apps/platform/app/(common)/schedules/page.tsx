import EmptyArea from "@/components/common/empty-area";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { GrSchedules } from "react-icons/gr";
import { getDepartmentName } from "src/constants/departments";
import { getSession } from "src/lib/auth-server";
import { getAllTimeTables } from "src/lib/time-table/actions";

import ScheduleSearchBox from "@/components/application/schedule-search";
import { ResponsiveContainer } from "@/components/common/container";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Metadata } from "next";
import { NoteSeparator } from "@/components/common/note-seperator";

export const metadata: Metadata = {
  title: `Timetables | ${process.env.NEXT_PUBLIC_WEBSITE_NAME}`,
  description: "Check your schedules here.",
};

export default async function Dashboard() {
  const session = await getSession();
  const timeTables = await getAllTimeTables();

  return (
    <>
      <section
        id="hero"
        className="z-10 w-full max-w-6xl mx-auto relative flex flex-col items-center justify-center pt-20 pb-10 max-h-80 text-center"
      >
        <h2 className="text-2xl font-semibold text-center whitespace-nowrap">
          Timetables for all departments
        </h2>
        <p className="text-base text-muted-foreground max-w-2xl mx-auto text-pretty text-center">
          view your own timetable by selecting your department, year, and
          semester.
        </p>
        <div
          className="mt-5 flex flex-wrap justify-center gap-y-4 px-2 lg:px-4 w-full mx-auto max-w-2xl"
          data-aos="fade-up"
          data-aos-anchor-placement="center-bottom"
        >
          <ScheduleSearchBox branches={[]} years={[]} />
        </div>
      </section>
      <NoteSeparator label={`${timeTables.length} Timetables found`} />


      {timeTables.length === 0 ? (
        <section className="max-w-6xl w-full px-2 xl:px-6 text-center">
          <EmptyArea
            icons={[GrSchedules]}
            title="No Timetables found"
            description="There are no timetables created yet. Please check back later"
          />
        </section>
      ) : (
        <ResponsiveContainer className="px-2 lg:px-6 max-w-(--max-app-width)">
          {timeTables.map((timetable, i) => {
            return (
              <Card
                key={timetable._id}
                className="hover:shadow-lg animate-in popup"
                style={{
                  animationDelay: `${i * 100}ms`,
                }}
              >
                <CardHeader className="p-4">
                  <CardTitle className="text-base">{timetable.sectionName}</CardTitle>
                  {timetable.department_code ? (
                    <Badge size="sm">
                      {getDepartmentName(timetable.department_code as string)}
                    </Badge>
                  ) : null}
                  <CardDescription>
                    <Badge size="sm" className="mr-2">
                      {timetable.year}
                      <sup>
                        {timetable.year === 1 ? "st" : timetable.year === 2 ? "nd" : timetable.year === 3 ? "rd" : "th"}
                      </sup>
                      Year
                    </Badge>
                    <Badge size="sm">
                      {timetable.semester}
                      <sup>
                        {timetable.semester === 1 ? "st" : timetable.semester === 2 ? "nd" : timetable.semester === 3 ? "rd" : "th"}
                      </sup>
                      Semester
                    </Badge>
                  </CardDescription>
                </CardHeader>
                <CardFooter className="justify-end p-4 pt-0">
                  <Button variant="default_light" size="sm" rounded="full" effect="shineHover" asChild>
                    <Link
                      href={`/schedules/${timetable.department_code}/${timetable.year}/${timetable.semester}`}
                    >
                      View Timetable
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </ResponsiveContainer>
      )}
    </>
  );
}
