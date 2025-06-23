"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, VercelTabsList } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import React, { useRef } from "react";
import toast from "react-hot-toast";
import { getDepartmentName } from "src/constants/departments";
import { createTimeTable, updateTimeTable } from "src/lib/time-table/actions";
import type { RawTimetable, TimeTableWithID } from "src/models/time-table";
import { EditTimetableDialog, Event, TimeTableMetaData } from "./components";
import { daysMap, rawTimetableData, timeMap } from "./constants";
import { useTimeTableStore } from "./store";

export type TimeTableEditorProps = {
  timetableData?: TimeTableWithID | RawTimetable;
  mode: "create" | "edit";
};

export const TimeTableEditor: React.FC<TimeTableEditorProps> = ({
  timetableData: timetableDataProp,
  mode = "create",
}) => {
  const isInitialized = useRef<boolean>(false);
  const setEditingEvent = useTimeTableStore((state) => state.setEditingEvent);
  const setIsEditing = useTimeTableStore((state) => state.setIsEditing);
  const setDisabled = useTimeTableStore((state) => state.setDisabled);
  const disabled = useTimeTableStore((state) => state.disabled);
  const timetableData = useTimeTableStore((state) => state.timetableData);
  const setTimetableData = useTimeTableStore((state) => state.setTimetableData);

  if (!isInitialized.current) {
    setTimetableData(
      mode === "edit" && !!timetableDataProp
        ? (timetableDataProp as TimeTableWithID)
        : (rawTimetableData as RawTimetable)
    );
    setIsEditing(false);
    setEditingEvent({ dayIndex: 0, timeSlotIndex: 0, eventIndex: -1 });
    setDisabled(false);
    isInitialized.current = true;
    console.log("initialized");
  }

  const handleSaveTimetable = async () => {
    setIsEditing(false);
    setDisabled(true);

    if (mode === "edit") {
      const data = timetableData as TimeTableWithID;
      toast
        .promise(updateTimeTable(data._id, data), {
          loading: "Saving Timetable",
          success: "Timetable saved successfully",
          error: "Failed to save timetable",
        })
        .finally(() => {
          setDisabled(false);
        });
    } else {
      const data = timetableData as RawTimetable;

      toast
        .promise(createTimeTable(data), {
          loading: "Creating Timetable",
          success: "Timetable created successfully",
          error: "Failed to create timetable",
        })
        .finally(() => {
          setDisabled(false);
        });
    }
  };
  const currentDayIndex = new Date().getDay() - 1;

  return (
    <>
      <div className="flex items-center justify-between gap-2 flex-col md:flex-row mx-auto max-w-7xl w-full">
        <div className="p-4 lg:p-6 bg-card rounded-lg shadow w-full relative">
          <div className="space-y-1">
            <h4 className="text-sm leading-none font-medium">{timetableData?.sectionName || "Name Not Provided"}</h4>
            <p className="text-muted-foreground text-sm">
              {getDepartmentName(timetableData?.department_code) || "Unknown Department"}
            </p>
            <div className="absolute top-4 right-4 flex items-center gap-2">

              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  handleSaveTimetable();
                }}
              >
                {mode === "create" ? "Save" : "Update"} TimeTable
              </Button>
            </div>
          </div>
          <Separator className="my-2" />
          <div className="flex items-center space-x-3 h-4 text-sm text-muted-foreground">
            <div>{timetableData?.year} Year</div>
            <Separator orientation="vertical" />
            <div>{timetableData?.semester} Semester</div>
            <Separator orientation="vertical" />
          </div>
          <div className="flex gap-3 items-center mt-4">
          </div>
        </div>
      </div>

      <Tabs defaultValue="metadata" className="w-full">
        <VercelTabsList
          tabs={[
            {
              id: "metadata",
              label: "Metadata",
            },
            {
              id: "timetable",
              label: "Edit Timetable",
            },
          ]}
        />
        <div className="bg-card p-4 mx-auto max-w-7xl w-full mt-5 rounded-lg">

        <TabsContent value="metadata">
          <TimeTableMetaData />

        </TabsContent>
        <TabsContent value="timetable">
          <EditTimetableDialog />
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
            <TableBody className="relative">
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
                      // biome-ignore lint/a11y/useSemanticElements: <explanation>
                      role="button"
                      tabIndex={0}
                      aria-disabled={disabled ? "true" : "false"}
                      onClick={() => {
                        setIsEditing(true);
                        setEditingEvent({
                          dayIndex,
                          timeSlotIndex: index,
                          eventIndex: 0,
                        });
                      }}
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
        </TabsContent>
        </div>

      </Tabs>
    </>
  );
};
