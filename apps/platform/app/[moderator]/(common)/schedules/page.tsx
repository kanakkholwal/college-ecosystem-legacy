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
  const { studentInfo, timetables } = await getInfo();

  const quick_links: RouterCardLink[] = [
    {
      href: `/${params.moderator}/schedules/create`,
      title: "New Time Table",
      description: "Create new timetable here.",
      Icon: CalendarPlus,
    },
    ...timetables.map((timetable) => ({
      href: `/${params.moderator}/schedules/${timetable.department_code}/${timetable.year}/${timetable.semester}`,
      title: timetable.sectionName,
      description: "View your timetable here.",
      Icon: CalendarDays,
    })),
  ];
  return (
    <>
      <div className="grid grid-cols-1 @md:grid-cols-2 @4xl:grid-cols-4 text-left gap-4">
        {quick_links.map((link, i) => (
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
