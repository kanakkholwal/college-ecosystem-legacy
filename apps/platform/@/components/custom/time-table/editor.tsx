"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import React, { useRef } from "react";
import toast from "react-hot-toast";
import { getDepartmentName } from "src/constants/departments";
import { createTimeTable, updateTimeTable } from "src/lib/time-table/actions";
import { RawTimetable, TimeTableWithID } from "src/models/time-table";
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
  if (!isInitialized.current) {
    useTimeTableStore.setState({
      timetableData:
        mode === "edit" && !!timetableDataProp
          ? (timetableDataProp as TimeTableWithID)
          : (rawTimetableData as RawTimetable),
      isEditing: false,
      editingEvent: { dayIndex: 0, timeSlotIndex: 0, eventIndex: -1 },
      disabled: false,
    });
    isInitialized.current = true;
    console.log("initialized");
  }
  const { timetableData, isEditing, disabled } = useTimeTableStore.getState();

  // console.log(timetableData);

  const handleSaveTimetable = async () => {
    useTimeTableStore.setState({ isEditing: false, disabled: true });

    if (mode === "edit") {
      const data = timetableData as TimeTableWithID;
      toast
        .promise(updateTimeTable(data._id!, data), {
          loading: "Saving Timetable",
          success: "Timetable saved successfully",
          error: "Failed to save timetable",
        })
        .finally(() => {
          useTimeTableStore.setState({ disabled: false });
        });
    } else {
      const data = timetableData as RawTimetable;

      toast
        .promise(createTimeTable(timetableData), {
          loading: "Creating Timetable",
          success: "Timetable created successfully",
          error: "Failed to create timetable",
        })
        .finally(() => {
          useTimeTableStore.setState({ disabled: false });
        });
    }
  };

  return (
    <>
      <div className="flex items-center justify-between gap-2 flex-col md:flex-row mx-auto max-w-7xl w-full mt-20">
        <div>
          <h3 className="text-lg font-semibold">
            {timetableData?.sectionName} {" |  "}
            {getDepartmentName(timetableData?.department_code)}
          </h3>
          <p className="text-sm text-gray-700">
            {timetableData?.year} Year | {timetableData?.semester} Semester
          </p>
        </div>
        <div className="flex gap-3 items-center">
          <TimeTableMetaData />
          <Button
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              handleSaveTimetable();
            }}
          >
            {mode === "create" ? "Save" : "Edit"} TimeTable
          </Button>
        </div>
      </div>
      <Table className="mx-auto max-w-7xl bg-white/20 backdrop-blur-2xl rounded-lg overflow-hidden">
        <TableHeader>
          <TableRow>
            <TableHead
              className={cn(
                "sticky top-0 z-10 border-x text-center text-gray-700 min-w-40 whitespace-nowrap"
              )}
            >
              Time \ Day
            </TableHead>
            {Array.from(daysMap.entries()).map(([index, day]) => {
              return (
                <TableHead
                  key={index}
                  className={cn(
                    "sticky top-0 z-10 border-x text-center ",
                    new Date().getDay() === index
                      ? "text-primary bg-primary/10"
                      : " text-gray-700"
                  )}
                >
                  {day}
                  {new Date().getDay() === index && (
                    <span className="text-primary text-xs italic">(Today)</span>
                  )}
                </TableHead>
              );
            })}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from(timeMap.entries()).map(([index, time]) => (
            <TableRow key={index}>
              <TableCell className="sticky left-0 z-10 border-x text-center text-semibold whitespace-nowrap">
                {time}
              </TableCell>
              {Array.from(daysMap.entries()).map((_, dayIndex) => (
                <TableCell
                  key={`${index}-${dayIndex}`}
                  className={cn(
                    "border-x text-center ",
                    new Date().getDay() === dayIndex
                      ? "text-primary bg-primary/10"
                      : ""
                  )}
                  role="button"
                  tabIndex={0}
                  aria-disabled={disabled ? "true" : "false"}
                  onClick={() => {
                    useTimeTableStore.setState({
                      isEditing: true,
                      editingEvent: {
                        dayIndex,
                        timeSlotIndex: index,
                        eventIndex: 0,
                      },
                    });
                  }}
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
      <EditTimetableDialog isEditing={isEditing} />
    </>
  );
};
