"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { getDepartmentName } from "src/constants/departments";
import { RawTimetable, TimeTableWithID } from "src/models/time-table";
import { daysMap, timeMap } from "./time-table-constants";
import EditTimetableDialog, { TimeTableMetaData } from "./time-table-editor";
import { useTimetableStore } from "./time-table-store";

export type FormattedTimetable = TimeTableWithID | RawTimetable;

export type TimetableProps = {
    // timetableData: FormattedTimetable;
    mode?: "view" | "edit";
    saveTimetable?: (timetableData: TimeTableWithID | RawTimetable) => Promise<string>;
}



export function TimeTable({ mode = "view", saveTimetable }: TimetableProps) {

    const { timetableData: stateTimetableData, isEditing } = useTimetableStore((state) => ({ timetableData: state.timetableData, isEditing: state.isEditing }));

    const handleSaveTimetable = async () => {
        if (mode === "edit" && stateTimetableData) {
            if (saveTimetable && typeof saveTimetable === "function") {
                useTimetableStore.setState({ isEditing: false });
                toast.promise(saveTimetable(
                    mode === "edit" ? stateTimetableData as TimeTableWithID : stateTimetableData as RawTimetable
                ), {
                    loading: "Saving Timetable",
                    success: "Timetable saved successfully",
                    error: "Failed to save timetable"
                }).finally(() => useTimetableStore.setState({ isEditing: true }));
            }
        }
    }



    return (<>

        <div className="flex items-center justify-between gap-2 flex-col md:flex-row mx-auto max-w-7xl w-full mt-20">
            <div>
                <h3 className="text-lg font-semibold">{stateTimetableData.sectionName} - {getDepartmentName(stateTimetableData.department_code)}</h3>
                <p className="text-sm text-gray-700">{stateTimetableData.year} Year, {stateTimetableData.semester} Semester</p>
            </div>
            {mode === "edit" && (<div className="flex gap-3 items-center">
                <TimeTableMetaData />
                <Button size="sm" onClick={() => handleSaveTimetable()}>Save TimeTable</Button>
            </div>)}
        </div>
        <Table className="mx-auto max-w-7xl bg-white/20 backdrop-blur-2xl rounded-lg overflow-hidden">
            <TableHeader>
                <TableRow>
                    <TableHead className={cn("sticky top-0 z-10 border-x text-center text-gray-700 min-w-40 whitespace-nowrap")}>
                        Time \ Day
                    </TableHead>
                    {Array.from(daysMap.entries()).map(([index, day]) => {
                        return (
                            <TableHead
                                key={index}
                                className={cn(
                                    "sticky top-0 z-10 border-x text-center ",
                                    new Date().getDay() === index ? "text-primary bg-primary/10" : " text-gray-700"
                                )}
                            >
                                {day}
                                {new Date().getDay() === index && <span className="text-primary text-xs italic">(Today)</span>}
                            </TableHead>
                        );
                    })}
                </TableRow>
            </TableHeader>
            <TableBody>
                {Array.from(timeMap.entries()).map(([index, time]) => (
                    <TableRow key={index}>
                        <TableCell className="sticky left-0 z-10 border-x text-center text-semibold whitespace-nowrap">{time}</TableCell>
                        {Array.from(daysMap.entries()).map((_, dayIndex) => (
                            <TableCell
                                key={`${index}-${dayIndex}`}
                                className={cn(
                                    "border-x text-center ",
                                    new Date().getDay() === dayIndex ? "text-primary bg-primary/10" : ""
                                )}
                                {...(mode === "edit" && {
                                    role: "button",
                                    tabIndex: 0,
                                    "aria-disabled": isEditing ? "true" : "false",
                                    onClick: () => useTimetableStore.setState({ isEditing: true, editingEvent: { dayIndex, timeSlotIndex: index, eventIndex: 0 } }),
                                })}
                            >
                                {stateTimetableData.schedule[dayIndex]?.timeSlots[index]?.events.map((event, eventIndex) => (
                                    <Event event={event} key={`${index}-${dayIndex}-event-${eventIndex}`} />
                                ))}
                                {stateTimetableData.schedule[dayIndex]?.timeSlots[index]?.events.length === 0 && (<Badge className="text-xs" variant="success" size="sm">Free Time</Badge>)}
                            </TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
        {mode === "edit" && (<EditTimetableDialog />)}

    </>);
}
function Event({ event }: { event: FormattedTimetable["schedule"][0]["timeSlots"][0]["events"][0] }) {
    return (
        <div>
            <HoverCard>
                <HoverCardTrigger asChild>
                    <Button variant="link" className="p-4">{event.title}</Button>
                </HoverCardTrigger>
                <HoverCardContent className="w-80 text-left">
                    <div className="space-y-1">
                        <h4 className="text-sm font-semibold">{event.title}</h4>
                        <p className="text-sm">
                            {event?.description}
                        </p>
                    </div>
                </HoverCardContent>
            </HoverCard>
        </div>
    );
}
