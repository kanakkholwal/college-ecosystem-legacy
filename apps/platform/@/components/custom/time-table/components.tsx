"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import React, { useState } from "react";
import { DEPARTMENTS_LIST } from "src/constants/departments";
import { daysMap, timeMap } from "./constants";
import { FormattedTimetable, useTimeTableStore } from "./store";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { EventTypeWithID, RawEvent } from "src/models/time-table";

export const EditTimetableDialog: React.FC<{
  isEditing: boolean;
}> = ({ isEditing }) => {
  const { timetableData, editingEvent } = useTimeTableStore.getState();

  const [newEvent, setNewEvent] = useState<
    FormattedTimetable["schedule"][number]["timeSlots"][number]["events"][number]
  >({
    title: "",
    description: "",
  });

  const handleSave = () => {
    const updatedTimetableData = {
      ...timetableData,
      schedule: timetableData.schedule.map((daySchedule, dayIndex) => {
        if (dayIndex === editingEvent.dayIndex) {
          return {
            ...daySchedule,
            timeSlots: daySchedule.timeSlots.map((timeSlot, timeSlotIndex) => {
              if (timeSlotIndex === editingEvent.timeSlotIndex) {
                const updatedEvents = [...timeSlot.events];
                if (editingEvent.eventIndex !== -1) {
                  updatedEvents[editingEvent.eventIndex] = newEvent;
                } else {
                  updatedEvents.push(newEvent);
                }
                return { ...timeSlot, events: updatedEvents };
              }
              return timeSlot;
            }),
          };
        }
        return daySchedule;
      }),
    };
    useTimeTableStore.setState({
      timetableData: updatedTimetableData,
      isEditing: false,
      editingEvent: { dayIndex: 0, timeSlotIndex: 0, eventIndex: -1 },
    });
    setNewEvent({ title: "", description: "" });
  };

  const handleCancel = () => {
    useTimeTableStore.setState({
      isEditing: false,
      editingEvent: { dayIndex: 0, timeSlotIndex: 0, eventIndex: -1 },
    });
  };
  const handleDelete = () => {
    const updatedTimetableData = {
      ...timetableData,
      schedule: timetableData.schedule.map((daySchedule, dayIndex) => {
        if (dayIndex === editingEvent.dayIndex) {
          return {
            ...daySchedule,
            timeSlots: daySchedule.timeSlots.map((timeSlot, timeSlotIndex) => {
              if (timeSlotIndex === editingEvent.timeSlotIndex) {
                const updatedEvents = timeSlot.events.filter(
                  (_, index) => index !== editingEvent.eventIndex
                );
                return { ...timeSlot, events: updatedEvents };
              }
              return timeSlot;
            }),
          };
        }
        return daySchedule;
      }),
    };
    useTimeTableStore.setState({
      timetableData: updatedTimetableData,
      isEditing: false,
      editingEvent: { dayIndex: 0, timeSlotIndex: 0, eventIndex: -1 },
    });
    setNewEvent({ title: "", description: "" });
  };

  const handleEventChange = (field: keyof typeof newEvent, value: any) => {
    setNewEvent((prevEvent) => ({ ...prevEvent, [field]: value }));
  };

  return (
    <Sheet
      open={isEditing}
      onOpenChange={(value) => useTimeTableStore.setState({ isEditing: value })}
    >
      <SheetContent className="w-full max-w-lg">
        <SheetHeader>
          <SheetTitle>Edit Event</SheetTitle>
          <SheetDescription className="font-semibold">
            {daysMap.get(editingEvent.dayIndex)} :{" "}
            {timeMap.get(editingEvent.timeSlotIndex)}
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid items-center gap-2">
            <Label htmlFor="event-title">Title</Label>
            <Input
              id="event-title"
              value={newEvent.title}
              className="col-span-3"
              variant="fluid"
              onChange={(e) => handleEventChange("title", e.target.value)}
            />
          </div>
          <div className="grid items-center gap-2">
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
                useTimeTableStore.setState({
                  editingEvent: {
                    ...editingEvent,
                    eventIndex: checked
                      ? timetableData.schedule[editingEvent.dayIndex]
                          ?.timeSlots[editingEvent.timeSlotIndex]?.events.length
                      : 0,
                  },
                });
              }}
            />
          </div>
          <div className="grid grid-cols-2 items-center gap-2">
            <Button onClick={handleSave} variant="dark">
              Save
            </Button>
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleDelete} variant="destructive_light">
              Delete
            </Button>
          </div>
        </div>
        <div className="grid gap-4 py-4">
          {/* map all the events in the same time and day */}
          {timetableData.schedule[editingEvent.dayIndex]?.timeSlots[
            editingEvent.timeSlotIndex
          ]?.events.map((event, eventIndex) => {
            return (
              <div
                key={eventIndex}
                className={cn(
                  "flex items-center justify-between whitespace-nowrap gap-2 border p-2 rounded-lg bg-gray-200",
                  editingEvent.eventIndex === eventIndex ? "bg-primary/10" : ""
                )}
              >
                <span className="font-semibold">{event.title}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    useTimeTableStore.setState({
                      isEditing: true,
                      editingEvent: {
                        dayIndex: editingEvent.dayIndex,
                        timeSlotIndex: editingEvent.timeSlotIndex,
                        eventIndex,
                      },
                    });
                    setNewEvent(event);
                  }}
                >
                  Edit
                </Button>
              </div>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export function TimeTableMetaData({ className }: React.ComponentProps<"form">) {
  const timetableData = useTimeTableStore.getState().timetableData;

  return (
    <ResponsiveDialog
      title="Timetable Metadata"
      description="the metadata of the timetable"
      btnProps={{
        variant: "default_light",
        size: "sm",
        children: "Edit Metadata",
      }}
    >
      <div className={cn("grid items-start gap-4", className)}>
        <div className="grid gap-2">
          <Label htmlFor="department">Department</Label>
          <Select
            value={timetableData.department_code}
            onValueChange={(value) => {
              useTimeTableStore.setState({
                timetableData: { ...timetableData, department_code: value },
              });
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose department" />
            </SelectTrigger>
            <SelectContent>
              {DEPARTMENTS_LIST.map((department) => {
                return (
                  <SelectItem value={department.code} key={department.code}>
                    {department.name}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="sectionName">Section Name</Label>
          <Input
            id="sectionName"
            defaultValue="ECE 3-B"
            value={timetableData.sectionName}
            onChange={(e) =>
              useTimeTableStore.setState({
                timetableData: {
                  ...timetableData,
                  sectionName: e.target.value,
                },
              })
            }
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="year">Year</Label>
          <Input
            id="year"
            type="number"
            defaultValue="3"
            min={1}
            max={5}
            value={timetableData.year}
            onChange={(e) =>
              useTimeTableStore.setState({
                timetableData: {
                  ...timetableData,
                  year: parseInt(e.target.value),
                },
              })
            }
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="semester">Semester</Label>
          <Input
            id="semester"
            type="number"
            defaultValue="1"
            min={1}
            max={10}
            value={timetableData.semester}
            onChange={(e) =>
              useTimeTableStore.setState({
                timetableData: {
                  ...timetableData,
                  semester: parseInt(e.target.value),
                },
              })
            }
          />
        </div>
      </div>
    </ResponsiveDialog>
  );
}

export function Event({ event }: { event: EventTypeWithID | RawEvent }) {
  return (
    <div>
      <HoverCard>
        <HoverCardTrigger asChild>
          <Button variant="link" className="p-4">
            {event.title}
          </Button>
        </HoverCardTrigger>
        <HoverCardContent className="w-80 text-left">
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">{event.title}</h4>
            <p className="text-sm">{event?.description}</p>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}
