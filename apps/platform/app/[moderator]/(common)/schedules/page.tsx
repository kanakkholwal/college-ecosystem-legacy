import { RouterCard, RouterCardLink } from "@/components/common/router-card";
import { CalendarDays, CalendarPlus } from "lucide-react";
import { getInfo } from "./actions";

export default async function Schedules({
  params,
}: {
  params: {
    moderator: string;
  };
}) {
  const data = await getInfo();

  const routes = formatRoutes(params.moderator, data);

  return (
    <>
      <div className="grid grid-cols-1 @md:grid-cols-2 @4xl:grid-cols-4 text-left gap-4">
        {routes.map((link, i) => (
          <RouterCard
            key={i}
            {...link}
            style={{
              animationDelay: `${i * 500}ms`,
            }}
          />
        ))}
      </div>
    </>
  );
}

const formatRoutes = (
  moderator: string,
  data: Awaited<ReturnType<typeof getInfo>>
): RouterCardLink[] => {
  const { studentInfo, timetables } = data;

  if (studentInfo !== null) {
    const filteredTimetables = timetables.filter((timetable) => {
      return (
        timetable.department_code === studentInfo.departmentCode &&
        timetable.year === studentInfo.currentYear &&
        timetable.semester === studentInfo.currentSemester
      );
    });
    return [
      {
        href: `/${moderator}/schedules/create`,
        title: "New Time Table",
        description: "Create new timetable here.",
        Icon: CalendarPlus,
      },
      ...filteredTimetables.map((timetable) => ({
        href: `/${moderator}/schedules/${timetable.department_code}/${timetable.year}/${timetable.semester}`,
        title: timetable.sectionName,
        description: "View your timetable here.",
        Icon: CalendarDays,
      })),
    ];
  }

  const quick_links: RouterCardLink[] = [
    {
      href: `/${moderator}/schedules/create`,
      title: "New Time Table",
      description: "Create new timetable here.",
      Icon: CalendarPlus,
    },
    ...timetables.map((timetable) => ({
      href: `/${moderator}/schedules/${timetable.department_code}/${timetable.year}/${timetable.semester}`,
      title: timetable.sectionName,
      description: "View your timetable here.",
      Icon: CalendarDays,
    })),
  ];
  return quick_links;
};
