import { RouterCard, RouterCardLink } from "@/components/common/router-card";
import { CalendarDays, CalendarPlus } from "lucide-react";
import { getInfo } from "./cr.actions";

export default async function CRDashboard() {
  const { studentInfo, timetables } = await getInfo();

  const quick_links: RouterCardLink[] = [
    {
      href: "/cr/schedules/create",
      title: "New Time Table",
      description: "View your timetable here.",
      Icon: CalendarPlus,
    },
    ...timetables.map((timetable) => ({
      href: `/cr/schedules/${timetable.department_code}/${timetable.year}/${timetable.semester}`,
      title: timetable.sectionName,
      description: "View your timetable here.",
      Icon: CalendarDays,
    })),
  ];
  return (
    <>
      <div className="mb-32 grid  lg:mb-0 lg:w-full mx-auto @5xl:max-w-6xl grid-cols-1 @md:grid-cols-2 @4xl:grid-cols-4 text-left gap-4">
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
