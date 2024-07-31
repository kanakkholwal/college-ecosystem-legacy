"use client";
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
import { useAtom } from "jotai";
import { Trash } from "lucide-react";
import React, { useState } from "react";
import { DEPARTMENTS_LIST } from "src/constants/departments";
import { EventTypeWithID, RawEvent } from "src/models/time-table";
import { daysMap, timeMap } from "./constants";
import {
  editingEventAtom,
  FormattedTimetable,
  isEditingAtom,
  timetableDataAtom,
} from "./store";

export const EditTimetableDialog: React.FC<{}> = ({}) => {
  const [timetableData, setTimetableData] = useAtom(timetableDataAtom);
  const [editingEvent, setEditingEvent] = useAtom(editingEventAtom);
  const [isEditing, setIsEditing] = useAtom(isEditingAtom);

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
    setTimetableData(updatedTimetableData);
    setIsEditing(false);
    setEditingEvent({ dayIndex: 0, timeSlotIndex: 0, eventIndex: -1 });

    setNewEvent({ title: "", description: "" });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingEvent({ dayIndex: 0, timeSlotIndex: 0, eventIndex: -1 });
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
    setTimetableData(updatedTimetableData);
    setIsEditing(false);
    setEditingEvent({ dayIndex: 0, timeSlotIndex: 0, eventIndex: -1 });
    setNewEvent({ title: "", description: "" });
  };

  const handleEventChange = (field: keyof typeof newEvent, value: any) => {
    setNewEvent((prevEvent) => ({ ...prevEvent, [field]: value }));
  };

  return (
    <Sheet open={isEditing} onOpenChange={(value) => setIsEditing(value)}>
      <SheetContent className="w-full max-w-lg">
        <SheetHeader>
          <SheetTitle>Edit Event</SheetTitle>
          <SheetDescription className="font-semibold">
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
              variant="fluid"
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
            <Button onClick={handleSave} size="sm" width="sm" variant="dark">
              Save
            </Button>
            <Button variant="outline" size="sm" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              size="icon_sm"
              variant="destructive_light"
            >
              <Trash />
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
                    setIsEditing(true);
                    setEditingEvent({
                      dayIndex: editingEvent.dayIndex,
                      timeSlotIndex: editingEvent.timeSlotIndex,
                      eventIndex,
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
  const [timetableData, setTimetableData] = useAtom(timetableDataAtom);

  return (
    <>
      <div
        className={cn(
          "grid items-start gap-4 mx-auto max-w-7xl py-10",
          className
        )}
      >
        <div className="flex gap-2 flex-wrap w-full">
          <div className="grid grow">
            <Label htmlFor="sectionName">Section Name</Label>
            <Input
              id="sectionName"
              placeholder="ECE 3-B"
              value={timetableData?.sectionName}
              onChange={(e) => {
                setTimetableData({
                  ...timetableData,
                  sectionName: e.target.value,
                });
              }}
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
              onChange={(e) => {
                setTimetableData({
                  ...timetableData,
                  year: parseInt(e.target.value),
                });
              }}
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
              onChange={(e) => {
                setTimetableData({
                  ...timetableData,
                  semester: parseInt(e.target.value),
                });
              }}
            />
          </div>
        </div>
        <div className="grid gap-2 grow">
          <Label htmlFor="department">Department</Label>
          <div className="grid gap-4 w-full grid-cols-1 @md:grid-cols-2 @4xl:grid-cols-4">
            {DEPARTMENTS_LIST.map((department, index) => {
              return (
                <label key={index} className={RadioStyle.label}>
                  {department.name}
                  <input
                    type="radio"
                    required
                    checked={department.code === timetableData.department_code}
                    onChange={(e) => {
                      setTimetableData({
                        ...timetableData,
                        department_code: department.code,
                      });
                    }}
                    name="department"
                    value={department.code}
                    className={RadioStyle.input}
                  />
                </label>
              );
            })}
          </div>
        </div>
      </div>
    </>
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
