"use client";

import { OutpassActionFooter } from "@/components/application/hostel/outpass-actions";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import type { OutPassType } from "~/models/hostel_n_outpass";

interface OutpassDetailsProps {
  outpass: OutPassType;
  actionEnabled?: boolean;
}

const classNames = {
  item: "flex items-center justify-between p-4 mb-3 bg-card border border-border rounded-lg shadow-sm last:mb-0 relative",
  details: "flex flex-col",
  studentInfo: "font-medium text-sm",
  outpassInfo: "text-xs text-muted-foreground",
};

export function OutpassDetails({
  outpass,
  actionEnabled = false,
}: OutpassDetailsProps) {
  return (
    <div className={classNames.item}>
      {/* Outpass Details */}
      <div className={classNames.details}>
        <span className={classNames.studentInfo}>
          {outpass.student?.name} | {outpass.student?.rollNumber}
        </span>
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
        <span className={cn(classNames.outpassInfo, "mt-1 text-xs")}>
          {format(
            new Date(outpass.expectedOutTime || ""),
            "dd/MM/yyyy hh:mm a"
          )}
          {" -  "}
          {format(new Date(outpass.expectedInTime || ""), "dd/MM/yyyy hh:mm a")}
        </span>
        {actionEnabled && outpass.status === "pending" && (
          <OutpassActionFooter outpassId={outpass?._id} />
        )}
      </div>
      {actionEnabled && (
        <div className="absolute right-2 top-2 left-auto bg-transparent">
          <Checkbox checked={outpass.status === "approved"} />
        </div>
      )}
    </div>
  );
}
