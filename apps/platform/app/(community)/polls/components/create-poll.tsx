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
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Control, useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { createPoll } from "src/lib/poll/actions";
import * as z from "zod";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export const rawPollSchema = z.object({
  question: z.string(),
  description: z.string().optional(),
  options: z.array(z.object({
    id: z.string(),
    value: z.string(),
  }))
    .min(2, "At least two options are required.")
    .default(() => [
      { id: String(Date.now()), value: "" },
      { id: String(Date.now() + 1), value: "" },
    ]),
  multipleChoice: z.boolean().default(false),
  votes: z.array(z.string()).default([]),
  closesAt: z.date({
    required_error: "A closing time is required.",
  }).default(() => new Date(Date.now() + 6 * 60 * 60 * 1000)),
});
export default function CreatePoll() {
  return (
    <ResponsiveDialog
      title="Create New Poll"
      description="Create a new poll here. Click save when you're done."
      btnProps={{
        variant: "default_light",
        children: "Create New Poll",
        size: "sm",
      }}
    >
      <PollForm />
    </ResponsiveDialog>
  );
}
type PollFormData = z.infer<typeof rawPollSchema>;

function PollForm({ className }: { className?: string }) {
  const router = useRouter();
  const form = useForm<PollFormData>({
    resolver: zodResolver(rawPollSchema),
    defaultValues: {
      question: "",
      description: "",
      options: [{
        id: String(Date.now()),
        value: "",
      }],
      multipleChoice: false,
      closesAt: new Date(Date.now() + 6 * 60 * 60 * 1000), // Default to 6 hours from now
    },
  });
  const { fields, append, remove } = useFieldArray<PollFormData>({
    control: form.control as Control<PollFormData>,
    name: "options",
  });
  
  async function onSubmit(values: z.infer<typeof rawPollSchema>) {
    console.log("Form submitted with values:", values);

    toast
      .promise(createPoll({
        ...values,
        options: values.options.map((option) => option.value),
      }), {
        loading: "Creating poll...",
        success: "Poll created successfully",
        error: "Failed to create poll",
      })
      .finally(() => {
        form.reset();
        router.refresh();
      });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("grid items-start gap-4", className)}
      >
        <FormField
          control={form.control}
          name="question"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Question</FormLabel>
              <FormControl>
                <Input
                  placeholder="Who is most popular person?"
                  disabled={form.formState.isSubmitting}
                  {...field}
                />
              </FormControl>
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
                <Input
                  placeholder="Who will be the winner?"
                  disabled={form.formState.isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="options"
          render={() => (
            <FormItem>
              <div className="flex items-center space-x-2 justify-between">
                <FormLabel className="mb-0">Options</FormLabel>
                <Button
                  size="sm"
                  type="button"
                  variant="default_light"
                  onClick={() => append({
                    id: String(Date.now()),
                    value: ""
                  })}
                >
                  Add Option
                </Button>
              </div>
              <FormDescription>Add the options for the poll</FormDescription>
              {fields.map((field, index) => (
                <FormField
                  key={field.id}
                  control={form.control}
                  name={`options.${index}`}
                  render={({ field }) => (
                    <FormItem className="flex flex-row space-x-3 space-y-0">
                      <FormLabel className="bg-slate-200 rounded-md p-3 inline-flex justify-center items-center mb-0">
                        {index + 1}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={`Enter Option ${index + 1}`}
                          id={`options.${index}.id`}
                          {...form.register(`options.${index}.value`)} 
                          disabled={form.formState.isSubmitting}
                        />
                      </FormControl>
                      <Button
                        type="button"
                        size="icon"
                        variant="default_light"
                        onClick={() => remove(index)}
                      >
                        -
                      </Button>
                    </FormItem>
                  )}
                />
              ))}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="closesAt"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Closes At</FormLabel>
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
        <FormField
          control={form.control}
          name="multipleChoice"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-2 justify-between">
              <FormLabel className="mb-0">Multiple Choice</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          width="full"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Creating Poll..." : "Create Poll"}
        </Button>
      </form>
    </Form>
  );
}
