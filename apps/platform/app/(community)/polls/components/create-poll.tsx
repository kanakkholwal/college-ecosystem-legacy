"use client";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import { Switch } from "@/components/ui/switch";
import { useRefWithFocus } from "@/hooks/useRefWithFocus";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
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
    options: z.array(z.string().min(1, 'Option cannot be empty')).min(2, 'At least two options are required'),
    multipleChoice: z.boolean().default(false),
    votes: z.array(z.string()).default([]),
    closesAt: z.date({
        required_error: "A closing time is required.",
      }).default(() => new Date(Date.now() + 6 * 60 * 60 * 1000)), // Default to 6 hours from now
});



export default function CreatePoll() {


    return <ResponsiveDialog
        title="Create New Poll"
        description="Create a new poll here. Click save when you're done."
        btnProps={{
            variant: "default_light",
            children: "Create New Poll",
            size:"sm",
        }}
        content={<PollForm />}
    />

}



function PollForm({ className }: { className?: string }) {

    const form = useForm<z.infer<typeof rawPollSchema>>({
        resolver: zodResolver(rawPollSchema),
        defaultValues: {
            question: "",
            description: "",
            options: ["", ""],
            multipleChoice: false,
            closesAt: new Date(Date.now() + 6 * 60 * 60 * 1000), // Default to 6 hours from now
        },
    });

    async function onSubmit(values: z.infer<typeof rawPollSchema>) {
        console.log('Form submitted with values:', values);

        toast.promise(createPoll(values), {
            loading: "Creating poll...",
            success: "Poll created successfully",
            error: "Failed to create poll",
        }).finally(() => {
            form.reset();
        })

    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className={cn("grid items-start gap-4", className)}>
                <FormField
                    control={form.control}
                    name="question"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Question</FormLabel>
                            <FormControl>
                                <Input placeholder="Who is most popular person?" disabled={form.formState.isSubmitting} {...field} />
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
                                <Input placeholder="Who will be the winner?" disabled={form.formState.isSubmitting} {...field} />
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
                                <Button size="sm" type="button" variant="default_light" onClick={() => {
                                    form.setValue("options", [...form.getValues("options"), ""])
                                }}>Add Option</Button>
                            </div>
                            <FormDescription>
                                Add the options for the poll
                            </FormDescription>
                            {form.getValues("options").map((item, index) => (
                                <FormField
                                    key={item + "_" + index}
                                    control={form.control}
                                    name={`options.${index}`}
                                    render={({ field }) => {
                                        const inputRef = useRefWithFocus<HTMLInputElement>();
                                        const { ref, ...rest } = field; // Destructure ref from field

                                        useEffect(() => {
                                            inputRef.current?.focus();
                                        }, [item]);
                                        return (
                                            <FormItem
                                                key={item}
                                                className="flex flex-row space-x-3 space-y-0"
                                            >
                                                <FormLabel className="bg-slate-200 rounded-md p-3 inline-flex justify-center items-center mb-0">
                                                    {index + 1}
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        ref={inputRef}
                                                        placeholder={`Enter Option ${index + 1}`}
                                                        {...rest}
                                                        disabled={form.formState.isSubmitting}
                                                        onChange={(event) => {
                                                            const newOptions = [...form.getValues("options")];
                                                            newOptions[index] = event.target.value;
                                                            form.setValue("options", newOptions);
                                                        }}
                                                    />
                                                </FormControl>
                                                <Button type="button" size="icon" variant="default_light" onClick={() => {
                                                    const newOptions = form
                                                        .getValues("options")
                                                        .filter((_, i) => i !== index);
                                                    form.setValue("options", newOptions);
                                                }}>
                                                    -
                                                </Button>
                                                <FormMessage />

                                            </FormItem>
                                        )
                                    }}
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
                                            date < new Date() || date < new Date("1900-01-01") || form.formState.isSubmitting
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
                                <Switch checked={field.value}
                                    onCheckedChange={field.onChange} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" width="full" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? "Creating Poll..." : "Create Poll"}
                </Button>
            </form>
        </Form>
    )
}
