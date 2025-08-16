import { ResponsiveContainer } from "@/components/common/container";
import EmptyArea from "@/components/common/empty-area";
import { HeaderBar } from "@/components/common/header-bar";
import { RouterCard } from "@/components/common/router-card";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/utils/link";
import { CalendarDays, Plus } from "lucide-react";
import { getAllTimeTables } from "~//actions/common.time-table";

export default async function Schedules(props: {
  params: Promise<{
    moderator: string;
  }>;
}) {
  const timetables = await getAllTimeTables();
  const params = await props.params;

  return (
    <>
      <HeaderBar
        Icon={CalendarDays}
        titleNode={
          <>
            Manage Timetables <Badge size="sm">{timetables.length} found</Badge>
          </>
        }
        descriptionNode={
          <>Here you can create new timetables or view existing ones.</>
        }
        actionNode={
          <ButtonLink
            variant="dark"
            size="sm"
            effect="shineHover"
            href={`/${params.moderator}/schedules/create`}
          >
            <Plus />
            New Timetable
          </ButtonLink>
        }
      />
      {timetables.length === 0 ? (
        <EmptyArea
          title="No Timetables Found"
          description="You can create a new timetable by clicking the button above."
          icons={[CalendarDays, Plus]}
        />
      ) : (
        <ResponsiveContainer>
          {timetables.map((timetable, i) => (
            <RouterCard
              key={timetable._id}
              href={`/${params.moderator}/schedules/${timetable.department_code}/${timetable.year}/${timetable.semester}`}
              title={timetable.sectionName || "Untitled Timetable"}
              description={`Department: ${timetable.department_code}, Year: ${timetable.year}, Semester: ${timetable.semester}`}
              Icon={CalendarDays}
              style={{
                animationDelay: `${i * 500}ms`,
              }}
            />
          ))}
        </ResponsiveContainer>
      )}
    </>
  );
}
