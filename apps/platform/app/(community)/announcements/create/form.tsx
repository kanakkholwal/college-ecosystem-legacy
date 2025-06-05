"use client";
import NexoMdxEditor from "nexo-mdx";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { VscSend } from "react-icons/vsc";
import type { z } from "zod";
import { createAnnouncement } from "~/lib/announcement/actions";
import {
  RELATED_FOR_TYPES,
  rawAnnouncementSchema,
} from "~/models/announcement";

export default function CreateAnnouncement() {
  const form = useForm<z.infer<typeof rawAnnouncementSchema>>({
    resolver: zodResolver(rawAnnouncementSchema as any),
    defaultValues: {
      title: "",
      content: "",
      relatedFor: RELATED_FOR_TYPES[0],
      // after 2 days from now
      // This is just a default value, it will be overridden by the user.
      expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof rawAnnouncementSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    toast.promise(createAnnouncement(values), {
      loading: "Creating Announcement",
      success: () => {
        form.reset();
        return "Announcement Created Successfully!";
      },
      error: "Failed to create Announcement",
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pb-10">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="A short title for the announcement."
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>The content of the announcement.</FormLabel>
              <FormControl>
                <NexoMdxEditor
                  rows={10}
                  placeholder="Write the announcement content here..."
                  {...field}
                  disabled={form.formState.isSubmitting}
                  // renderHtml={(md) => <article className='prose prose-sm dark:prose-invert max-w-full'>
                  //   <MDXRemote source={md} parseFrontmatter />
                  // </article>}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="relatedFor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>The type of announcement.</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={form.formState.isSubmitting}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a related category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {RELATED_FOR_TYPES.map((type) => {
                      return (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="expiresAt"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>
                  The date at which the announcement will expire.
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                        disabled={form.formState.isSubmitting}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date() ||
                        date < new Date("1900-01-01") ||
                        form.formState.isSubmitting
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          type="submit"
          className="ml-4"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <span className="animate-pulse">Publishing...</span>
          ) : (
            <span>Publish Announcement</span>
          )}
          <VscSend />
        </Button>
      </form>
    </Form>
  );
}
