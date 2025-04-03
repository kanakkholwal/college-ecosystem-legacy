"use client";

import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const DateTimePickerSchema = z.string().datetime();

type DateTimePickerType = z.infer<typeof DateTimePickerSchema>;

interface DateTimePickerProps {
  value: DateTimePickerType;
  onChange: (value: DateTimePickerType) => void;
  // schema?:typeof  z.Schema;
}

export function DateTimePicker(field: DateTimePickerProps) {
  function handleDateSelect(date: Date | undefined) {
    if (date) {
      field.onChange(date.toISOString());
    }
  }

  function handleTimeChange(type: "hour" | "minute" | "am_pm", value: string) {
    const currentDate = field.value || new Date();
    const newDate = new Date(currentDate);

    if (type === "hour") {
      const hour = Number.parseInt(value, 10);
      newDate.setHours(newDate.getHours() >= 12 ? hour + 12 : hour);
    } else if (type === "minute") {
      newDate.setMinutes(Number.parseInt(value, 10));
    } else if (type === "am_pm") {
      const hours = newDate.getHours();
      if (value === "AM" && hours >= 12) {
        newDate.setHours(hours - 12);
      } else if (value === "PM" && hours < 12) {
        newDate.setHours(hours + 12);
      }
    }

    field.onChange(newDate.toISOString());
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full pl-3 text-left font-normal",
            !field.value && "text-muted-foreground"
          )}
        >
          {field.value ? (
            format(field.value, "MM/dd/yyyy hh:mm aa")
          ) : (
            <span>MM/DD/YYYY hh:mm aa</span>
          )}
          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <div className="sm:flex">
          <Calendar
            mode="single"
            selected={new Date(field.value)}
            onSelect={handleDateSelect}
            autoFocus
          />
          <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
            <ScrollArea className="w-64 sm:w-auto">
              <div className="flex sm:flex-col p-2">
                {Array.from({ length: 12 }, (_, i) => i + 1)
                  .reverse()
                  .map((hour) => (
                    <Button
                      key={hour}
                      size="icon_sm"
                      variant={
                        field.value &&
                        new Date(field.value).getHours() % 12 === hour % 12
                          ? "default_light"
                          : "ghost"
                      }
                      className="sm:w-full shrink-0 aspect-square"
                      onClick={() => handleTimeChange("hour", hour.toString())}
                    >
                      {hour}
                    </Button>
                  ))}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>
            <ScrollArea className="w-64 sm:w-auto">
              <div className="flex sm:flex-col p-2">
                {Array.from({ length: 12 }, (_, i) => i * 5).map((minute) => (
                  <Button
                    key={minute}
                    size="icon_sm"
                    variant={
                      field.value &&
                      new Date(field.value).getMinutes() === minute
                        ? "default_light"
                        : "ghost"
                    }
                    className="sm:w-full shrink-0 aspect-square"
                    onClick={() =>
                      handleTimeChange("minute", minute.toString())
                    }
                  >
                    {minute.toString().padStart(2, "0")}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>
            <ScrollArea className="">
              <div className="flex sm:flex-col p-2 gap-2">
                {["AM", "PM"].map((am_pm) => (
                  <Button
                    key={am_pm}
                    size="icon_sm"
                    variant={
                      field.value &&
                      ((am_pm === "AM" &&
                        new Date(field.value).getHours() < 12) ||
                        (am_pm === "PM" &&
                          new Date(field.value).getHours() >= 12))
                        ? "default_light"
                        : "secondary"
                    }
                    className="sm:w-full shrink-0 aspect-square"
                    onClick={() => handleTimeChange("am_pm", am_pm)}
                  >
                    {am_pm}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
