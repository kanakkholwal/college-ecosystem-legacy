"use client"

import { ChevronLeft, ChevronRight } from "lucide-react";
import type * as React from "react";
import { DayPicker } from "react-day-picker";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        row: "flex flex-col space-y-4 sm:space-y-0 flex w-full mt-2",
        months: "flex flex-col space-y-4 sm:space-y-0 relative",

        nav: "space-x-1 flex items-center",
        
        //  (single mode)
        button_previous: cn("size-6 bg-slate-200 hover:bg-primary/30 rounded-lg inline-flex justify-center items-center cursor-pointer","absolute top-1 left-3"),
        button_next: cn("size-6 bg-slate-200 hover:bg-primary/30 rounded-lg inline-flex justify-center items-center cursor-pointer","absolute top-1 right-3"),

        // header (single mode)
        caption: "flex justify-center pt-1 relative items-center h-8",
        caption_label: "text-sm font-medium",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
        cell: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected].day-range-end)]:rounded-r-md",
          "hover:border-primary/30",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
            : "[&:has([aria-selected])]:rounded-md"
        ),
        // months (single mode)
        month_grid: "w-full border-collapse space-y-1",
        month_caption: "flex justify-center pt-1 relative items-center",
        month:"space-y-4",
        // weeks  (single mode)
        weeks: "flex flex-col space-y-1",
        week: "flex w-full space-x-1",
        weekdays: "flex w-full space-x-1",
        weekday: "text-muted-foreground rounded-md w-8 font-medium text-[0.8rem]",
        // days
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-8 w-8 p-0 font-normal aria-selected:opacity-100 aria-selected:border-primary/50"
        ),
        day_range_start: "day-range-start",
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground opacity-50  aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        today:"bg-primary/30 text-primary hover:text-primary hover:bg-primary/30",
        selected: "text-primary border-primary/50 font-semibold hover:text-primary hover:border-primary/50",
        ...classNames,
      }}
      components={{
        PreviousMonthButton: ({ className, ...props }) => (
          <button {...props} className={cn(className)}>
            <ChevronLeft className="size-4"/>
          </button>),
        NextMonthButton: ({ className, ...props }) => (
          <button {...props} className={cn(className)}>
            <ChevronRight className="size-4"/>
          </button>
        ),
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar };

