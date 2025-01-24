"use client";
import { DateTimePicker } from "@/components/extended/date-n-time/date-time-picker";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import type z from "zod";
import { REASONS, requestOutPassSchema } from "~/constants/outpass";
import type { HostelStudentType } from "~/models/hostel_n_outpass";



interface RequestOutPassFormProps<T> {
    onSubmit: (data: z.infer<typeof requestOutPassSchema>) => Promise<T>;
    student: HostelStudentType;
}
export default function RequestOutPassForm<T>({ onSubmit, student }: RequestOutPassFormProps<T>) {
    const form = useForm<z.infer<typeof requestOutPassSchema>>({
        resolver: zodResolver(requestOutPassSchema),
        defaultValues: {
            roomNumber: student.roomNumber || "",
            reason: undefined,
            address: "",
            expectedOutTime: "",
            expectedInTime: "",
        },
    });
    const handleSubmit = async (data: z.infer<typeof requestOutPassSchema>) => {
        try {
            console.log(data)
            toast.promise(onSubmit(data), {
                loading: "Requesting outpass",
                success: "Outpass requested successfully",
                error: "Failed to request outpass",
            });
        } catch (error) {
            toast.error("Failed to request outpass");
        }
    };
    console.log(form.formState)

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-6 my-5 p-2"
            >
                <div className="grid grid-cols-1 gap-4">
                    <div className="grid grid-cols-1 @lg:grid-cols-2 gap-3">
                        <FormField
                            control={form.control}
                            name="roomNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Room Number
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="room Number"
                                            type="text"
                                            autoCapitalize="none"
                                            autoComplete="name"
                                            autoCorrect="off"
                                            {...field}
                                            disabled={field.disabled || student.roomNumber !== "UNKNOWN"}
                                        />
                                    </FormControl>
                                    <FormDescription >
                                        {student.roomNumber === "UNKNOWN" && "Please update your room number in profile"}
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        <FormField
                            control={form.control}
                            name="reason"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Reason / Purpose</FormLabel>
                                    <Select onValueChange={(value) => {
                                        field.onChange(value)
                                        if (value === "outing" || value === "market") {
                                            // expectedOutTime and expectedInTime day must be today 
                                            const today = new Date()
                                            const expectedOutTime = new Date(today)
                                            expectedOutTime.setHours(10)
                                            expectedOutTime.setMinutes(0)
                                            const expectedInTime = new Date(today)
                                            expectedInTime.setHours(18)
                                            expectedInTime.setMinutes(0)
                                            form.setValue("expectedOutTime", expectedOutTime.toISOString())
                                            form.setValue("expectedInTime", expectedInTime.toISOString())
                                        }
                                    }} defaultValue={field.value} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a purpose for outpass issue" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {REASONS.map((reason) => {
                                                return (
                                                    <SelectItem key={reason} value={reason}>
                                                        {reason}
                                                    </SelectItem>
                                                );
                                            })} </SelectContent>
                                    </Select>
                                    <FormDescription />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Address</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Address"
                                        type="text"
                                        autoCapitalize="none"
                                        autoComplete="name"
                                        autoCorrect="off"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription >
                                    Address where you are going
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="grid grid-cols-1 @lg:grid-cols-2 gap-3">

                        <FormField
                            control={form.control}
                            name="expectedOutTime"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Expected Out Time</FormLabel>
                                    <FormControl>
                                        <DateTimePicker  {...field} />
                                    </FormControl>
                                    <FormDescription >
                                        Expected time to leave the hostel
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="expectedInTime"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Expected In Time</FormLabel>
                                    <FormControl>
                                        <DateTimePicker  {...field} />

                                    </FormControl>
                                    <FormDescription >
                                        Expected time to return to the hostel
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
                <p className="text-sm text-red-500">
                    {form.formState.errors.root?.message}
                </p>
                <div className="flex flex-wrap gap-2">
                    <Button type="submit"
                        disabled={!form.formState.isValid}
                    >Request Outpass</Button>
                    <Button type="reset"
                        variant="destructive_light"
                        onClick={() => form.reset()}
                    >
                        Reset
                    </Button>
                </div>
            </form>
        </Form>
    )

}