"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import React, { useState } from 'react';
import { create } from 'zustand';
import { shallow } from 'zustand/shallow';
import { FormattedTimetable } from './time-table';
import { daysMap, timeMap } from "./time-table-constants";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { DEPARTMENTS_LIST } from "src/constants/departments";
import { useMediaQuery } from 'usehooks-ts';
import { useRef } from "react";

import { TimeTableState, useTimetableStore } from "./time-table-store";

export function StoreInitializer({ timetableData, isEditing }: {
    timetableData: TimeTableState["timetableData"],
    isEditing: TimeTableState["isEditing"]
}) {
    const initialized = useRef(false);
    if (!initialized.current) {
        useTimetableStore.setState({
            timetableData: timetableData,
            isEditing: false,
            editingEvent: {
                dayIndex: 0,
                timeSlotIndex: 0,
                eventIndex: 0
            }
        });
        initialized.current = true;
    }
    return null;
}




const EditTimetableDialog: React.FC = () => {
    const { timetableData, isEditing, editingEvent } = useTimetableStore(
        (state) => ({
            timetableData: state.timetableData,
            isEditing: state.isEditing,
            editingEvent: state.editingEvent,
        }),
        shallow
    );

    const [newEvent, setNewEvent] = useState<FormattedTimetable['schedule'][0]['timeSlots'][0]['events'][0]>({
        title: '',
        description: '',
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
        useTimetableStore.setState({ timetableData: updatedTimetableData, isEditing: false, editingEvent: { dayIndex: 0, timeSlotIndex: 0, eventIndex: -1 } });
        setNewEvent({ title: '', description: '' });
    };

    const handleCancel = () => {
        useTimetableStore.setState({ isEditing: false, editingEvent: { dayIndex: 0, timeSlotIndex: 0, eventIndex: -1 } });
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
                                const updatedEvents = timeSlot.events.filter((_, index) => index !== editingEvent.eventIndex);
                                return { ...timeSlot, events: updatedEvents };
                            }
                            return timeSlot;
                        }),
                    };
                }
                return daySchedule;
            }),
        };
        useTimetableStore.setState({ timetableData: updatedTimetableData, isEditing: false, editingEvent: { dayIndex: 0, timeSlotIndex: 0, eventIndex: -1 } });
        setNewEvent({ title: '', description: '' });
    }

    const handleEventChange = (field: keyof typeof newEvent, value: any) => {
        setNewEvent((prevEvent) => ({ ...prevEvent, [field]: value }));
    };

    return (
        <Sheet open={isEditing} onOpenChange={(value) => useTimetableStore.setState({ isEditing: value })}>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Edit Event</SheetTitle>
                    <SheetDescription className="font-semibold">
                        {daysMap.get(editingEvent.dayIndex)} : {timeMap.get(editingEvent.timeSlotIndex)}
                    </SheetDescription>
                </SheetHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid items-center gap-2">
                        <Label htmlFor="event-title">
                            Title
                        </Label>
                        <Input
                            id="event-title"
                            value={newEvent.title}
                            className="col-span-3"
                            variant="fluid"
                            onChange={(e) => handleEventChange('title', e.target.value)}
                        />
                    </div>
                    <div className="grid items-center gap-2">
                        <Label htmlFor="event-description">
                            Description
                        </Label>
                        <Textarea
                            id="event-description"
                            value={newEvent.description}
                            className="col-span-3"
                            onChange={(e) => handleEventChange('description', e.target.value)}
                        />
                    </div>
                    <div className="flex items-center space-x-2 justify-between">
                        <Label htmlFor="is-new" className="mb-0">New Event</Label>
                        <Switch id="is-new"
                            checked={editingEvent.eventIndex === timetableData.schedule[editingEvent.dayIndex]?.timeSlots[editingEvent.timeSlotIndex]?.events.length}
                            onCheckedChange={(checked) => {
                                useTimetableStore.setState({
                                    editingEvent: {
                                        ...editingEvent,
                                        eventIndex: checked ? timetableData.schedule[editingEvent.dayIndex]?.timeSlots[editingEvent.timeSlotIndex]?.events.length : 0
                                    }
                                });
                            }}
                        />
                    </div>
                    <div className="grid grid-cols-2 items-center gap-2">
                        <Button onClick={handleSave}>Save</Button>
                        <Button variant="outline" onClick={handleCancel}>
                            Cancel
                        </Button>
                        <Button  onClick={handleDelete}>
                            Delete
                        </Button>
                    </div>
                </div>
                <div className="grid gap-4 py-4">
                    {/* map all the events in the same time and day */}
                    {timetableData.schedule[editingEvent.dayIndex]?.timeSlots[editingEvent.timeSlotIndex]?.events.map((event, eventIndex) => {
                        return (
                            <div key={eventIndex} className={cn("flex items-center justify-between whitespace-nowrap gap-2 border p-2 rounded-lg bg-gray-200", editingEvent.eventIndex === eventIndex ? "bg-primary/10" : "")}>
                                <span className="font-semibold">{event.title}</span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        useTimetableStore.setState({
                                            isEditing: true,
                                            editingEvent: { dayIndex: editingEvent.dayIndex, timeSlotIndex: editingEvent.timeSlotIndex, eventIndex },
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
export function TimeTableMetaData() {
    const [open, setOpen] = React.useState(false)
    const isDesktop = useMediaQuery("(min-width: 768px)")

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant="default_light" size="sm">Edit Metadata</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit Metadata</DialogTitle>
                        <DialogDescription>
                            Edit the metadata of the timetable
                        </DialogDescription>
                    </DialogHeader>
                    <MetaDataForm />
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button variant="default_light" size="sm">Edit Metadata</Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className="text-left">
                    <DrawerTitle>Edit Metadata</DrawerTitle>
                    <DrawerDescription>
                        Edit the metadata of the timetable
                    </DrawerDescription>
                </DrawerHeader>
                <MetaDataForm className="px-4" />
                <DrawerFooter className="pt-2">
                    <DrawerClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}

function MetaDataForm({ className }: React.ComponentProps<"form">) {
    const { timetableData } = useTimetableStore(
        (state) => ({
            timetableData: state.timetableData
        }),
        shallow
    );
    return (
        <div className={cn("grid items-start gap-4", className)}>
            <div className="grid gap-2">
                <Label htmlFor="department">Department</Label>
                <Select
                value={timetableData.department_code}
                onValueChange={(value) => useTimetableStore.setState({ timetableData: { ...timetableData, department_code: value } })}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Choose department" />
                    </SelectTrigger>
                    <SelectContent>
                        {DEPARTMENTS_LIST.map((department) => {
                            return (<SelectItem value={department.code} key={department.code}>{department.name}</SelectItem>);
                        })}
                    </SelectContent>
                </Select>
            </div>
            <div className="grid gap-2">
                <Label htmlFor="sectionName">Section Name</Label>
                <Input id="sectionName" defaultValue="ECE 3-B"
                    value={timetableData.sectionName}
                    onChange={(e) => useTimetableStore.setState({ timetableData: { ...timetableData, sectionName: e.target.value } })}
                />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="year">Year</Label>
                <Input id="year" type="number" defaultValue="3" min={1} max={5}
                    value={timetableData.year}
                    onChange={(e) => useTimetableStore.setState({ timetableData: { ...timetableData, year: parseInt(e.target.value) } })}
                />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="semester">Semester</Label>
                <Input id="semester" type="number" defaultValue="1" min={1} max={10}
                    value={timetableData.semester}
                    onChange={(e) => useTimetableStore.setState({ timetableData: { ...timetableData, semester: parseInt(e.target.value) } })}
                />
            </div>
        </div>
    )
}
export default EditTimetableDialog;