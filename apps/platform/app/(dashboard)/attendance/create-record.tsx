"use client";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { createAttendanceRecord } from "src/lib/attendance/personal.actions";
import { rawAttendanceRecordSchema } from "src/models/attendance-record";
import * as z from "zod";

export default function CreateAttendanceRecord() {
  const form = useForm<z.infer<typeof rawAttendanceRecordSchema>>({
    resolver: zodResolver(rawAttendanceRecordSchema),
    defaultValues: {
      subjectCode: "",
      subjectName: "",
      totalClasses: 0,
    },
  });

  function onSubmit(values: z.infer<typeof rawAttendanceRecordSchema>) {
    console.log(values);
    toast.promise(createAttendanceRecord(values), {
      loading: "Creating Attendance Record",
      success: "Attendance Record Created",
      error: "Failed to create Attendance Record",
    });
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid gap-4 w-full"
      >
        <FormField
          control={form.control}
          name="subjectCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject Code</FormLabel>
              <FormControl>
                <Input
                  placeholder="subjectCode"
                  {...field}
                  disabled={form.formState.isSubmitting}
                />
              </FormControl>
              <FormDescription>Enter the subject code.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="subjectName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="subjectName"
                  {...field}
                  disabled={form.formState.isSubmitting}
                />
              </FormControl>
              <FormDescription>Enter the subject name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* <FormField
                    control={form.control}
                    name="totalClasses"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Total Classes</FormLabel>
                            <FormControl>
                                <Input placeholder="totalClasses" {...field} disabled={form.formState.isSubmitting} />
                            </FormControl>
                            <FormDescription>
                                Enter the total number of classes.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )} /> */}
        <Button
          type="submit"
          width="full"
          disabled={form.formState.isSubmitting}
          className="mx-auto"
        >
          {form.formState.isSubmitting
            ? "Creating..."
            : "Create Attendance Record"}
        </Button>
      </form>
    </Form>
  );
}
