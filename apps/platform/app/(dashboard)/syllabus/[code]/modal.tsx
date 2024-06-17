"use client"
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
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
import toast from "react-hot-toast";
import * as z from "zod";

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { booksAndRefType, prevPaperType } from "src/models/course";


const yearOptions: readonly string[] = Array.from(
    { length: 6 },
    (_, index) => (new Date().getFullYear() - index).toString()
) as unknown as readonly [string, ...string[]]

const formSchema = z.object({
    exam: z.enum(['midsem', 'endsem', 'others']),
    link: z.string(),
    year: z.string().refine((val) => yearOptions.includes(val))
})



export function AddPrevsModal({
    code,
    addPrevPaper,
}: {
    code: string,
    addPrevPaper: (paper: prevPaperType) => Promise<boolean>
}) {

    const form = useForm<prevPaperType>({
        resolver: zodResolver(formSchema),
    });

    const onSubmit = async (data: prevPaperType) => {
        // Handle form submission
        console.log(data)
        toast.promise(addPrevPaper(data), {
            loading: 'Adding Previous Paper',
            success: 'Previous Paper Added',
            error: 'Failed to add Previous Paper',
        })

    };

    return <Dialog>
        <DialogTrigger asChild>
            <Button>
                Add Previous Paper
            </Button>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>
                    Add Previous Paper for {code}
                </DialogTitle>
                <DialogDescription>
                    Fill the form below to add a previous paper.
                </DialogDescription>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">

                    <FormField
                        control={form.control}
                        name="year"

                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Year</FormLabel>
                                <FormControl>
                                    <Select
                                        required
                                        onValueChange={field.onChange}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Year" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {yearOptions.map((year) => (
                                                <SelectItem key={year} value={year}>
                                                    {year}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormDescription>This is the name of the paper.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="link"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Link</FormLabel>
                                <FormControl>
                                    <Input variant="fluid" type="url" placeholder="Enter Link" required {...field} />
                                </FormControl>
                                <FormDescription>This is the link to the paper.(drive link with public access)</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="exam"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Exam Type</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value} required>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Exam Type" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="midsem">Midterm Exam</SelectItem>
                                        <SelectItem value="endsem">End Semester Exam</SelectItem>
                                        <SelectItem value="others">Others</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormDescription>This is the type of exam.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />


                    <Button type="submit" className="w-full" size="lg">
                        Submit Paper
                    </Button>
                </form>
            </Form>
        </DialogContent>
    </Dialog>

}
const typeOptions = ["book", "reference", "drive", "youtube", "others"] as unknown as readonly [string, ...string[]]
const refFormSchema = z.object({
    type: z.enum(typeOptions),
    link: z.string(),
    name: z.string()
});

export function AddRefsModal({ code, addReference }: {
    code: string,
    addReference: (ref: booksAndRefType) => Promise<boolean>
}) {
    const form = useForm<booksAndRefType>({
        resolver: zodResolver(refFormSchema),
    });

    const onSubmit = async (data: booksAndRefType) => {
        // Handle form submission
        console.log(data)
        toast.promise(addReference(data), {
            loading: 'Adding Reference',
            success: 'Reference Added',
            error: 'Failed to add Reference',
        })

    };


    return <Dialog>
        <DialogTrigger asChild>
            <Button>
                Add new reference
            </Button>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>
                    Add new reference or book for {code}
                </DialogTitle>
                <DialogDescription>
                    Fill the form below to add a new reference.
                </DialogDescription>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">

                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Name
                                </FormLabel>
                                <FormControl>
                                    <Input variant="fluid" type="text" placeholder="Enter Name of the resource" required {...field} />
                                </FormControl>
                                <FormDescription>
                                    This is the name of the resource.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="link"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Link</FormLabel>
                                <FormControl>
                                    <Input variant="fluid" type="url" placeholder="Enter Link" required {...field} />
                                </FormControl>
                                <FormDescription>
                                    This is the link to the reference.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="type"

                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Type</FormLabel>
                                <FormControl>
                                    <Select
                                        required
                                        onValueChange={field.onChange}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select ref type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {typeOptions.map((type) => (
                                                <SelectItem key={type} value={type} className="capitalize">
                                                    {type}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormDescription>
                                    This is the type of reference.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" className="w-full" size="lg">
                        Submit Resources
                    </Button>
                </form>
            </Form>
        </DialogContent>
    </Dialog>

}