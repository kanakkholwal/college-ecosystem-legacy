"use client";
import { Button } from '@/components/ui/button';

import { Badge } from "@/components/ui/badge";
import type { OutPassType } from "~/models/hostel_n_outpass";

interface OutpassDetailsProps {
    outpass: OutPassType;
}

const classNames = {
    item: "flex items-center justify-between p-4 mb-3 bg-white border border-gray-200 rounded-lg shadow-sm last:mb-0",
    details: "flex flex-col",
    studentInfo: "font-medium text-gray-800",
    outpassInfo: "text-sm text-gray-600",
};

export function OutpassDetails({ outpass }: OutpassDetailsProps) {
    return (<div className={classNames.item}>
        {/* Outpass Details */}
        <div className={classNames.details}>
            <span className={classNames.studentInfo}>{outpass.student.name} | {outpass.student.rollNumber}</span>
            <span className={classNames.outpassInfo}>
                {outpass.hostel.name} | Room No: {outpass.roomNumber}
            </span>
            <span className={classNames.outpassInfo}>
                Reason: {outpass.reason} | Status:{" "}
                <Badge
                    size="sm"
                    variant={
                        outpass.status === "approved"
                            ? "success_light"
                            : outpass.status === "pending"
                                ? "warning_light"
                                : "destructive_light"
                    }
                >
                    {outpass.status}
                </Badge>
            </span>
            <span className={classNames.outpassInfo}>
                {outpass.actualInTime ? <>
                    {new Date(outpass.actualOutTime || "").toLocaleString("en-US")} - {new Date(outpass.actualInTime || "").toLocaleString("en-US")}
                </> : <>
                    {new Date(outpass.expectedOutTime || "").toLocaleString("en-US")} - {new Date(outpass.expectedInTime || "").toLocaleString("en-US")}
                </>}

            </span>

        </div>


    </div>);
}


export function OutpassWithActions({ outpass }: OutpassDetailsProps) {
    return (<div className={classNames.item}>
        {/* Outpass Details */}
        <div className={classNames.details}>
            <span className={classNames.studentInfo}>{outpass.student.name} | {outpass.student.rollNumber}</span>
            <span className={classNames.outpassInfo}>
                {outpass.hostel.name} | Room No: {outpass.roomNumber}
            </span>
            <span className={classNames.outpassInfo}>
                Reason: {outpass.reason} | Status:{" "}
                <Badge
                    size="sm"
                    variant={
                        outpass.status === "approved"
                            ? "success_light"
                            : outpass.status === "pending"
                                ? "warning_light"
                                : "destructive_light"
                    }
                >
                    {outpass.status}
                </Badge>
            </span>
            <span className={classNames.outpassInfo}>
                {outpass.actualInTime ? <>
                    {new Date(outpass.actualOutTime || "").toLocaleString("en-US")} - {new Date(outpass.actualInTime || "").toLocaleString("en-US")}
                </> : <>
                    {new Date(outpass.expectedOutTime || "").toLocaleString("en-US")} - {new Date(outpass.expectedInTime || "").toLocaleString("en-US")}
                </>}
            </span>
            <Button size="sm" variant="default_light" className="mt-2">Approve</Button>
            <Button size="sm" variant="destructive_light" className="mt-2">Reject</Button>


        </div>


    </div>);
}