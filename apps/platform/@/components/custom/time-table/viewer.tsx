import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { getDepartmentName } from "src/constants/departments";
import type { TimeTableWithID } from "src/models/time-table";
import { Event } from "./components";
import { daysMap, timeMap } from "./constants";

interface TimetableProps {
  timetableData: TimeTableWithID;
}

export default async function TimeTableViewer({
  timetableData,
}: TimetableProps) {
  const currentDayIndex = new Date().getDay() - 1;

  return (
    <>
      <div className="flex items-center justify-between gap-2 flex-col md:flex-row mx-auto w-full p-3">
        <div>
          <h4 className="text-lg font-semibold">
            {timetableData?.sectionName} {" | "}
            {getDepartmentName(timetableData?.department_code)}
          </h4>
          <div className="flex h-5 items-center space-x-4 text-sm text-muted-foreground">
            <div>{timetableData?.year} Year</div>
            <Separator orientation="vertical"/>
            <div>{timetableData?.semester} Semester</div>
          </div>
        </div>
      </div>
      <Table className="bg-card backdrop-blur-2xl rounded-lg overflow-hidden">
        <TableHeader>
          <TableRow>
            <TableHead
              className={cn(
                "sticky top-0 z-10 border-x h-10 text-center text-muted-foreground min-w-40 whitespace-nowrap p-2"
              )}
            >
              Time \ Day
            </TableHead>
            {Array.from(daysMap.entries()).map(([index, day]) => {
              return (
                <TableHead
                  key={index}
                  className={cn(
                    "sticky top-0 z-10 border-x h-10 text-center p-2",
                    currentDayIndex === index
                      ? "text-primary bg-primary/5"
                      : " text-muted-foreground"
                  )}
                >
                  {day}
                  {currentDayIndex === index && (
                    <span className="text-primary text-xs italic">(Today)</span>
                  )}
                </TableHead>
              );
            })}
          </TableRow>
        </TableHeader>
        <TableBody className="relative isolate">
          {Array.from(timeMap.entries()).map(([index, time]) => (
            <TableRow key={index}>
              <TableCell className="sticky left-0 z-10 border-x text-center text-xs text-semibold whitespace-nowrap p-2">
                {time}
              </TableCell>
              {Array.from(daysMap.entries()).map((_, dayIndex) => (
                <TableCell
                  key={`${index}-${
                    // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                    dayIndex
                  }`}
                  className={cn(
                    "border-x text-center p-2",
                    currentDayIndex === dayIndex
                      ? "text-primary bg-primary/5"
                      : ""
                  )}
                >
                  {timetableData.schedule[dayIndex]?.timeSlots[
                    index
                  ]?.events.map((event, eventIndex) => (
                    <Event
                      event={event}
                      key={`${index}-${dayIndex}-event-${
                        // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                        eventIndex
                      }`}
                    />
                  ))}
                  {timetableData.schedule[dayIndex]?.timeSlots[index]?.events
                    .length === 0 && (
                    <Badge className="text-xs" variant="success" size="sm">
                      Free Time
                    </Badge>
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
