"use client";

import type React from "react";
import { useCallback } from "react";
import type { EventTypeWithID } from "src/models/time-table";
import type { RawEvent } from "~/constants/common.time-table";
import { DEPARTMENTS_LIST } from "~/constants/core.departments";
import { FormattedTimetable, } from "./store";

import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioStyle } from "@/components/ui/radio-group";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Trash } from "lucide-react";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import { daysMap, timeMap } from "./constants";
import { useTimeTableStore } from "./store";

export const EditTimetableDialog: React.FC = () => {
  const {
    timetableData,
    editingEvent,
    isEditing,
    setIsEditing,
    setEditingEvent,
    updateEvent,
    deleteEvent,
  } = useTimeTableStore();

  const [newEvent, setNewEvent] = useState<FormattedTimetable["schedule"][number]["timeSlots"][number]["events"][number]
  >({
    _id: nanoid(),
    title: "",
    description: "",
  });

  useEffect(() => {
    if (isEditing && editingEvent.eventIndex !== -1) {
      const event =
        timetableData.schedule[editingEvent.dayIndex]?.timeSlots[
          editingEvent.timeSlotIndex
        ]?.events[editingEvent.eventIndex];
      if (event) setNewEvent(event);
    } else {
      setNewEvent({ title: "", description: "", _id: nanoid() });
    }
  }, [isEditing, editingEvent]);

  const handleEventChange = (field: keyof typeof newEvent, value: any) => {
    setNewEvent((prevEvent) => ({ ...prevEvent, [field]: value }));
  };

  return (
    <Sheet open={isEditing} onOpenChange={setIsEditing}>
      <SheetContent className="w-full max-w-lg">
        <SheetHeader>
          <SheetTitle>Edit Event</SheetTitle>
          <SheetDescription className="text-sm text-muted-foreground">
            {daysMap.get(editingEvent.dayIndex)} :{" "}
            {timeMap.get(editingEvent.timeSlotIndex)}
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid items-center">
            <Label htmlFor="event-title">Title</Label>
            <Input
              id="event-title"
              value={newEvent.title}
              className="col-span-3"
              variant="outline"
              onChange={(e) => handleEventChange("title", e.target.value)}
            />
          </div>
          <div className="grid items-center">
            <Label htmlFor="event-description">Description</Label>
            <Textarea
              id="event-description"
              value={newEvent.description}
              className="col-span-3"
              onChange={(e) => handleEventChange("description", e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2 justify-between">
            <Label htmlFor="is-new" className="mb-0">
              New Event
            </Label>
            <Switch
              id="is-new"
              checked={
                editingEvent.eventIndex ===
                timetableData.schedule[editingEvent.dayIndex]?.timeSlots[
                  editingEvent.timeSlotIndex
                ]?.events.length
              }
              onCheckedChange={(checked) => {
                setEditingEvent({
                  ...editingEvent,
                  eventIndex: checked
                    ? timetableData.schedule[editingEvent.dayIndex]?.timeSlots[
                      editingEvent.timeSlotIndex
                    ]?.events.length
                    : 0,
                });
              }}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => {
                updateEvent(newEvent);
                setNewEvent({ title: "", description: "", _id: nanoid() });
                setIsEditing(false);
              }}
              size="sm"
              width="sm"
              variant="dark"
            >
              Save
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                deleteEvent();
                setIsEditing(false);
              }}
              size="icon_sm"
              variant="destructive_light"
            >
              <Trash />
            </Button>
          </div>
        </div>
        <div className="grid gap-4 py-4">
          <h6 className="text-sm font-medium text-muted-foreground">
            Events in{" "}
            {daysMap.get(editingEvent.dayIndex)} :{" "}
            {timeMap.get(editingEvent.timeSlotIndex)}
          </h6>
          {timetableData.schedule[editingEvent.dayIndex]?.timeSlots[
            editingEvent.timeSlotIndex
          ]?.events.map((event, eventIndex) => (
            <div
              key={event.title}
              className={cn(
                "flex items-center justify-between whitespace-nowrap gap-2 border p-2 rounded-lg bg-muted",
                editingEvent.eventIndex === eventIndex ? "border-primary" : ""
              )}
            >
              <span className="font-medium text-sm">{event.title}</span>
              <Button
                variant="outline"
                size="xs"
                onClick={() => {
                  setIsEditing(true);
                  setEditingEvent({
                    ...editingEvent,
                    eventIndex,
                  });
                  setNewEvent(event);
                }}
              >
                Edit
              </Button>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};



export const TimeTableMetaData = ({ className }: React.ComponentProps<"form">) => {
  const timetableData = useTimeTableStore((state) => state.timetableData);
  const setTimetableData = useTimeTableStore((state) => state.setTimetableData);

  // Memoize the change handler to prevent unnecessary re-renders
  const handleChange = useCallback(
    <T extends keyof typeof timetableData>(
      field: T,
      value: typeof timetableData[T]
    ) => {
      setTimetableData({
        ...timetableData,
        [field]: value,
      });
    },
    [timetableData, setTimetableData]
  );

  // Memoize department radio change handler
  const handleDepartmentChange = useCallback(
    (code: string) => {
      setTimetableData({
        ...timetableData,
        department_code: code,
      });
    },
    [timetableData, setTimetableData]
  );

  return (
    <div className={cn("grid items-start gap-4", className)}>
      <h4 className="text-base font-semibold">Edit Time Table Metadata</h4>

      <div className="flex gap-2 flex-wrap w-full">
        <div className="grid grow">
          <Label htmlFor="sectionName">Section Name</Label>
          <Input
            id="sectionName"
            placeholder="ECE 3-B"
            value={timetableData.sectionName}
            onChange={(e) => handleChange("sectionName", e.target.value)}
          />
        </div>

        <div className="grid grow">
          <Label htmlFor="year">Year</Label>
          <Input
            id="year"
            type="number"
            placeholder="3"
            min={1}
            max={5}
            value={timetableData.year}
            onChange={(e) => handleChange("year", Number(e.target.value))}
          />
        </div>

        <div className="grid grow">
          <Label htmlFor="semester">Semester</Label>
          <Input
            id="semester"
            type="number"
            placeholder="1"
            min={1}
            max={10}
            value={timetableData.semester}
            onChange={(e) => handleChange("semester", Number(e.target.value))}
          />
        </div>
      </div>

      <div className="grid gap-2 grow">
        <Label htmlFor="department">Department</Label>
        <div className="grid gap-4 w-full grid-cols-1 @md:grid-cols-2 @4xl:grid-cols-4">
          {DEPARTMENTS_LIST.map((department) => (
            <label key={department.code} className={RadioStyle.label}>
              {department.name}
              <input
                type="radio"
                required
                checked={department.code === timetableData.department_code}
                onChange={() => handleDepartmentChange(department.code)}
                name="department"
                value={department.code}
                className={RadioStyle.input}
              />
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};
export function Event({ event }: { event: EventTypeWithID | RawEvent }) {
  return (
    <div>
      <HoverCard closeDelay={100}>
        <HoverCardTrigger asChild>
          <Button variant="outline" size="sm" className="whitespace-normal">
            {event.title}
          </Button>
        </HoverCardTrigger>
        <HoverCardContent className="max-w-80 text-left">
          <div className="space-y-1">
            <h4 className="text-sm font-medium">{event.title}</h4>
            <p className="text-xs text-muted-foreground">{event?.description}</p>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}
