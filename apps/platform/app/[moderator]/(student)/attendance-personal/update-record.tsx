"use client";
import { Button } from "@/components/ui/button";
import { Check, X,Trash2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

interface Props {
  updateAttendanceRecord: (present: boolean) => Promise<string>;
  deleteAttendanceRecord: () => Promise<string>;
  children: React.ReactNode;
}

export default function UpdateAttendanceRecord({
  updateAttendanceRecord,
  deleteAttendanceRecord,
  children,
}: Props) {
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

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

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this record?"))
      return;

    setDeleting(true);
    try {
      toast.promise(deleteAttendanceRecord(), {
        loading: "Deleting Record",
        success: "Record Deleted Successfully",
        error: "Failed to delete Record",
      });
    } catch (error) {
      console.error(error);
    }
    setDeleting(false);
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
      <Button
        variant="destructive_light"
        size="icon_sm"
        disabled={updating}
        onClick={() => handleDelete()}
        className="absolute right-2 top-2 left-auto bg-transparent"
      >
        <Trash2 />
      </Button>
      {children}
    </div>
  );
}
