"use client";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/extended/collapsible";
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
import { useAtom } from "jotai";
import React, { useRef } from "react";
import toast from "react-hot-toast";
import { getDepartmentName } from "src/constants/departments";
import { createTimeTable, updateTimeTable } from "src/lib/time-table/actions";
import type { RawTimetable, TimeTableWithID } from "src/models/time-table";
import { EditTimetableDialog, Event, TimeTableMetaData } from "./components";
import { daysMap, rawTimetableData, timeMap } from "./constants";
import {
  disabledAtom,
  editingEventAtom,
  isEditingAtom,
  timetableDataAtom,
} from "./store";

export type TimeTableEditorProps = {
  timetableData?: TimeTableWithID | RawTimetable;
  mode: "create" | "edit";
};

export const TimeTableEditor: React.FC<TimeTableEditorProps> = ({
  timetableData: timetableDataProp,
  mode = "create",
}) => {
  const isInitialized = useRef<boolean>(false);
  const [isMetaOpen, setIsMetaOpen] = React.useState(false);
  const [timetableData, setTimetableData] = useAtom(timetableDataAtom);
  const [, setEditingEvent] = useAtom(editingEventAtom);
  const [isEditing, setIsEditing] = useAtom(isEditingAtom);
  const [disabled, setDisabled] = useAtom(disabledAtom);

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

  return (
    <>
      <Collapsible open={isMetaOpen} onOpenChange={setIsMetaOpen}>
        <div className="flex items-center justify-between gap-2 flex-col md:flex-row mx-auto max-w-7xl w-full mt-20">
          <div>
            <h3 className="text-lg font-semibold">
              {timetableData?.sectionName || "Section"}
              {" |  "}
              {getDepartmentName(timetableData?.department_code) ||
                "Department"}
            </h3>
            <p className="text-sm text-gray-700">
              {timetableData?.year || "2"} Year |{" "}
              {timetableData?.semester || "3"} Semester
            </p>
          </div>
          <div className="flex gap-3 items-center">
            <CollapsibleTrigger asChild>
              <Button
                {...{
                  variant: "default_light",
                  size: "sm",
                  children: "Edit Metadata",
                }}
              />
            </CollapsibleTrigger>
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
        <CollapsibleContent>
          <TimeTableMetaData />
        </CollapsibleContent>
      </Collapsible>
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
                  key={`${index}-${
                    // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                    dayIndex
                  }`}
                  className={cn(
                    "border-x text-center",
                    "focus-within:border focus-within:border-primary",
                    new Date().getDay() === dayIndex
                      ? "text-primary bg-primary/10"
                      : ""
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
      <EditTimetableDialog />
    </>
  );
};
