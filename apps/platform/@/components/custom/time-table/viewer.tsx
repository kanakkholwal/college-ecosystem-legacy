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
    <div className="flex flex-col items-center justify-center gap-4 ml-3 mr-4">
      <div className="p-4 lg:p-6 bg-card rounded-lg shadow w-full">
        <div className="space-y-1">
          <h4 className="text-sm leading-none font-medium">{timetableData?.sectionName}</h4>
          <p className="text-muted-foreground text-sm">
            {getDepartmentName(timetableData?.department_code)}
          </p>
        </div>
        <Separator className="my-2" />
        <div className="flex items-center space-x-3 h-4 text-sm text-muted-foreground">
          <div>{timetableData?.year} Year</div>
          <Separator orientation="vertical" />
          <div>{timetableData?.semester} Semester</div>
        </div>
      </div>
      <Table className="bg-card border shadow-2xl rounded-lg overflow-hidden">
        <TableHeader>
          <TableRow>
            <TableHead
              className={cn(
                "bg-muted text-center text-muted-foreground min-w-12 whitespace-nowrap p-2"
              )}
            >
              Time \ Day
            </TableHead>
            {Array.from(daysMap.entries()).map(([index, day]) => {
              return (
                <TableHead
                  key={index}
                  className={cn(
                    "bg-muted text-center text-muted-foreground p-2",
                    "border-b",
                    currentDayIndex === index
                      ? "text-primary border-primary"
                      : " text-muted-foreground"
                  )}
                >
                  <p className="text-sm font-medium">
                    {day}
                  </p>
                  {currentDayIndex === index && (
                    <p className="text-primary text-xs italic">(Today)</p>
                  )}
                </TableHead>
              );
            })}
          </TableRow>
        </TableHeader>
        <TableBody className="relative isolate">
          {Array.from(timeMap.entries()).map(([index, time]) => (
            <TableRow key={index}>
              <TableCell className="bg-muted text-center text-muted-foreground min-w-12 text-xs text-medium whitespace-nowrap p-2">
                {time}
              </TableCell>
              {Array.from(daysMap.entries()).map((_, dayIndex) => (
                <TableCell
                  key={`day-${dayIndex}-${index}`}
                  id={`day-${dayIndex}-${index}`}
                  className={cn(
                    "border-x text-center p-2",
                    currentDayIndex === dayIndex 
                    ? "bg-primary/2"
                    : "",
            
                  )}
                >
                  {timetableData.schedule[dayIndex]?.timeSlots[
                    index
                  ]?.events.map((event, eventIndex) => (
                    <Event
                      event={event}
                      key={`${index}-${dayIndex}-event-${eventIndex}`}
                    />
                  ))}
                  {timetableData.schedule[dayIndex]?.timeSlots[index]?.events
                    .length === 0 && (
                      <Badge variant="default" size="sm">
                        Free Time
                      </Badge>
                    )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
