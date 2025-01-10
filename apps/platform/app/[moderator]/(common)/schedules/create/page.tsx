"use client"
import { DatePicker } from "@/components/extended/date-n-time/date-picker";
import Scheduler from "@/components/extended/scheduler";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { TransitionPanel } from '@/components/ui/transition-panel';
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { modeEnums, scheduleAccessTypeEnums, scheduleSchema } from "~/constants/schedule";

type CreateSchedulePayload = z.infer<typeof scheduleSchema>


export default function CreateSchedulePage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const form = useForm<z.infer<typeof scheduleSchema>>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      events: [],
      mode: "day",
      title: "",
      description: "",
      startTime: new Date(),
      endTime: new Date(),
      access: []
    },
  })

  const [date, setDate] = useState(new Date());

  const handleSubmission = async (payload: CreateSchedulePayload) => {
    console.log(payload);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmission)} className="space-y-8">

        <div className='flex space-x-2'>
          <Button
            type="button"
            size="sm"
            variant={activeIndex === 0 ? 'default_light' : 'slate'}
            onClick={() => setActiveIndex(0)}
          >
            Schedule Details
          </Button>
          <Button
            type="button"
            size="sm"
            variant={activeIndex === 1 ? 'default_light' : 'slate'}
            onClick={() => setActiveIndex(1)}
          >
            Schedule Events
          </Button>
        </div>

        <div className='overflow-hidden border-t border-zinc-200 dark:border-zinc-700'>
          <TransitionPanel
            activeIndex={activeIndex}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            variants={{
              enter: { opacity: 0, y: -50, filter: 'blur(4px)' },
              center: { opacity: 1, y: 0, filter: 'blur(0px)' },
              exit: { opacity: 0, y: 50, filter: 'blur(4px)' },
            }}
          >
            <div className='py-2' id="schedule-details">
              <h3 className='mb-2 font-semibold text-gray-800 dark:text-gray-100'>
                Schedule Details
              </h3>
              <p className='text-gray-600 dark:text-gray-400'>
                Fill in the details of the schedule.
              </p>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mt-5">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Schedule title." {...field} />
                      </FormControl>
                      <FormDescription>
                        A title for the schedule
                        <span className='text-gray-500 dark:text-gray-400'> (e.g: Academic Calender,ECE-2B)</span>
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input placeholder="Schedule description" {...field} />
                      </FormControl>
                      <FormDescription />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="startTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Time</FormLabel>
                        <FormControl>
                          <DatePicker value={field.value} onChange={field.onChange} disabled={(date) => date < new Date()} />
                        </FormControl>
                        <FormDescription />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="endTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Time</FormLabel>
                        <FormControl>
                          <DatePicker value={field.value} onChange={field.onChange}
                            disabled={(date) => date < new Date()}
                          />
                        </FormControl>
                        <FormDescription />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                </div>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="mode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mode</FormLabel>
                        <FormControl>
                          <ToggleGroup type="single"
                            onValueChange={(value) => {
                              field.onChange({
                                target: {
                                  value: value,
                                  name: field.name,
                                },
                              })
                            }}
                          >

                            {modeEnums.map((mode) => {
                              return (
                                <ToggleGroupItem value={mode} key={mode}>{mode}</ToggleGroupItem>
                              )
                            })}
                          </ToggleGroup>

                        </FormControl>
                        <FormDescription />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="access"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Access</FormLabel>
                      <FormControl>
                        <ToggleGroup type="single"
                          onValueChange={(value) => {
                            field.onChange({
                              target: {
                                value: value,
                                name: field.name,
                              },
                            })
                          }}
                        >

                          {scheduleAccessTypeEnums.map((mode) => {
                            return (
                              <ToggleGroupItem value={mode} key={mode}>{mode}</ToggleGroupItem>
                            )
                          })}
                        </ToggleGroup>

                      </FormControl>
                      <FormDescription />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className='py-2' id="schedule-events">
              <h3 className='mb-2 font-semibold text-gray-800 dark:text-gray-100'>
                Schedule Events
              </h3>
              <p className='text-gray-600 dark:text-gray-400'>
                Add events to the schedule
              </p>
              <FormField
                control={form.control}
                name="events"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Events
                    </FormLabel>
                    <FormControl>
                      <Scheduler
                        events={field.value}
                        setEvents={(events) => {
                          field.onChange({
                            target: {
                              value: events,
                              name: field.name,
                            },
                          })
                        }}
                        mode={form.getValues('mode')}
                        setMode={(mode) => {
                          return
                          // form.setValue('mode', mode)
                        }}
                        date={date}
                        setDate={(date) => setDate(date)}
                        editingEnabled={true}
                        margin_hours={[8,18]}
                      />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </TransitionPanel>
        </div>
      </form>
    </Form>
  );
}



