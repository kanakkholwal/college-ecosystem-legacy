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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { DEPARTMENTS_LIST } from "~/constants/departments";
import { authClient } from "~/lib/auth-client";

const ROLES = [
    "student",
    "cr",
    "faculty",
    "hod"
];

const userSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string(),
    role: z.string().default("user"),
    gender: z.string().default("customValue"),
    other_roles: z.array(z.string()).default([]),
    department: z.string(),
});



export default function CreateNewUser() {
    const form = useForm<z.infer<typeof userSchema>>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            gender: "not_specified",
            other_roles: [],
            department: "",
        },
    });

    const handleSubmit = async (data: z.infer<typeof userSchema>) => {
        const newUser = await authClient.admin.createUser({
            name: data.name,
            email: data.email,
            password: data.password,
            role: "user",
            data: {
                gender: data.gender,
                other_roles: data.other_roles,
                username: data.email.split("@")[0],
                department: data.department
            }
        });
        console.log(newUser);
    }


    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 my-5 p-2">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Your Name"
                                        type="text"
                                        autoCapitalize="none"
                                        autoComplete="name"
                                        autoCorrect="off"
                                        {...field}
                                        disabled={form.formState.isSubmitting}
                                    />
                                </FormControl>
                                <FormDescription />
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="rollNo@nith.ac.in"
                                        type="email"
                                        autoCapitalize="none"
                                        autoComplete="email"
                                        autoCorrect="off"
                                        {...field}
                                        disabled={form.formState.isSubmitting}
                                    />
                                </FormControl>
                                <FormDescription />
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="*********"
                                        type="password"
                                        autoCapitalize="none"
                                        autoComplete="password"
                                        autoCorrect="off"
                                        {...field}
                                        disabled={form.formState.isSubmitting}
                                    />
                                </FormControl>
                                <FormDescription />
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="department"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Department</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a department" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {DEPARTMENTS_LIST.map((dept) => {
                                            return (
                                                <SelectItem key={dept.name} value={dept.name}>
                                                    {dept.name}
                                                </SelectItem>
                                            );
                                        })}
                                    </SelectContent>
                                </Select>
                                <FormDescription />
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Gender</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a department" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {["male", "female"].map((gender) => {
                                            return (
                                                <SelectItem key={gender} value={gender}>
                                                    {gender}
                                                </SelectItem>
                                            );
                                        })}
                                    </SelectContent>
                                </Select>
                                <FormDescription />
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex gap-2 items-center flex-wrap w-full">

                    {ROLES.map((item, index) => (
                        <FormField
                            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                            key={`${item}_${index}`}
                            control={form.control}
                            name="other_roles"
                            render={({ field }) => {
                                return (
                                    <FormItem
                                        key={item}
                                        className="flex flex-row items-start space-x-2 space-y-0"
                                    >
                                        <FormControl>
                                            <Switch
                                                checked={field.value?.includes(item)}
                                                onCheckedChange={(checked) => {
                                                    return checked
                                                        ? field.onChange([...field.value, item])
                                                        : field.onChange(
                                                            field.value?.filter(
                                                                (value) => value !== item
                                                            )
                                                        );
                                                }}
                                            />
                                        </FormControl>
                                        <FormLabel className="font-normal cursor-pointer">
                                            {item}
                                        </FormLabel>
                                    </FormItem>
                                );
                            }}
                        />
                    ))}
                    </div>

                    <Button type="submit" disabled={form.formState.isSubmitting}>
                        Create User
                    </Button>
                </form>
            </Form>
        </>
    );
}
