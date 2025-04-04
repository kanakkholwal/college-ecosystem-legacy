"use client";


import * as React from "react"
import type { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import toast from "react-hot-toast";
import { updateAllotmentProcess,distributeSlots } from "~/actions/allotment-process";

const statusSchema = ["open", "closed", "paused", "waiting","completed"] as const;
export type StatusType = typeof statusSchema[number]

export function ChangeAllotmentProcessStatusButton({currentStatus,hostelId}: {currentStatus: string,hostelId: string}) {

    

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
            Change Status
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Status</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {statusSchema.map((status:StatusType) => {
            return (
                <DropdownMenuCheckboxItem
                key={status}
                checked={currentStatus === status}
                onCheckedChange={(checked) => {
                    toast.promise(updateAllotmentProcess(hostelId, { status ,hostelId}), {
                        loading: "Updating status...",
                        success: `Status updated to ${status}`,
                        error: `Error updating status to ${status}`,
                    })
                }}

                >
                {status}
                </DropdownMenuCheckboxItem>
            )
        })}
        
      </DropdownMenuContent>
    </DropdownMenu>
  )
}


export function DistributeSlotsButton({hostelId}: {hostelId: string}) {

    return (<Button 
        size="sm"
        variant="outline"
        onClick={() => {
          toast.promise(distributeSlots(hostelId), {
            loading: "Distributing slots...",
            success: "Slots distributed successfully",
            error: "Error distributing slots",
          })
          
        }}

    >
        Create Allotment Slots
    </Button>)
}