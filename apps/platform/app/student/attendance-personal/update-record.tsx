"use client";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { ChartBar } from "lucide-react";

interface Props {
  updateAttendanceRecord: (present: boolean) => Promise<string>;
  children: React.ReactNode;
}

export default function UpdateAttendanceRecord({
  updateAttendanceRecord,
  children,
}: Props) {
  const [updating, setUpdating] = useState(false);

  const handleUpdate = async (present: boolean) => {
    setUpdating(true);
    try {
      toast.promise(updateAttendanceRecord(present), {
        loading: `Updating ${present ? "Present" : "Absent"} Record`,
        success: `${present ? "Present" : "Absent"} Updated Successfully`,
        error: "Failed to update Attendance Record",
      });
    } catch (error) {
      console.error(error);
    }
    setUpdating(false);
  };

  return (
    <div className="flex gap-2 items-center justify-start mt-4">
      <Button
        variant="success_light"
        disabled={updating}
        size="icon_sm"
        onClick={() => handleUpdate(true)}
      >
        <Check />
      </Button>
      <Button
        variant="destructive_light"
        size="icon_sm"
        disabled={updating}
        onClick={() => handleUpdate(false)}
      >
        <X />
      </Button>
      {children}
    </div>
  );
}
