"use client";
import { Button } from "@/components/ui/button";
import { Check, X } from 'lucide-react';
import { useState } from "react";
import toast from "react-hot-toast";

interface Props {
    updateAttendanceRecord: (present: boolean) => Promise<string>;
}

export default function UpdateAttendanceRecord({ updateAttendanceRecord }: Props) {

    const [updating, setUpdating] = useState(false);

    const handleUpdate = async (present: boolean) => {
        setUpdating(true);
        try {
            toast.promise(updateAttendanceRecord(present), {
                loading: `Updating ${present ? "Present" : "Absent"} Record`,
                success: `${present ? "Present" : "Absent"} Updated Successfully`,
                error: 'Failed to update Attendance Record'
            })
        } catch (error) {
            console.error(error);
        }
        setUpdating(false);
    }

    return (<div className="flex gap-2 items-center justify-end">
        <Button variant="success_light" size="icon_sm" onClick={() => handleUpdate(true)}><Check /></Button>
        <Button variant="destructive_light" size="icon_sm" onClick={() => handleUpdate(false)}><X /></Button>
    </div>)
}