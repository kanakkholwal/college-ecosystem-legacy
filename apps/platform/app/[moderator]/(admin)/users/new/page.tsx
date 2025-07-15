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
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from "@/components/ui/multi-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import z from "zod";
import { authClient } from "~/auth/client";
import { ROLES } from "~/constants";
import { DEPARTMENTS_LIST } from "~/constants/core.departments";
import { orgConfig } from "~/project.config";

const userSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  role: z.string().default("user"),
  gender: z.string().default("not_specified"),
  other_roles: z.array(z.string()).default([]),
  other_emails: z.array(z.string().email()).default([]),
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
    toast.promise(
      authClient.admin.createUser({
        name: data.name,
        email: data.email,
        password: data.password,
        role: "user",
        data: {
          gender: data.gender,
          other_roles: data.other_roles,
          other_emails: data.other_emails,
          username: data.email.split("@")[0],
          department: data.department,
        },
      }),
      {
        loading: "Creating User...",
        success: "User Created Successfully",
        error: "Failed to create user",
      }
    );
  };

  return (
    <div className="w-full">
      <h1 className="text-xl font-semibold">Create New User</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-6 my-5 p-4 bg-card"
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
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
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={`Email (e.g. user${orgConfig.mailSuffix})`}
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
                      type="text"
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
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <FormControl>
                    <ToggleGroup
                      defaultValue={"not_specified"}
                      value={field.value}
                      onValueChange={(value) => field.onChange(value)}
                      className="justify-start"
                      type="single"
                    >
                      {["male", "female", "not_specified"].map((item) => (
                        <ToggleGroupItem
                          value={item}
                          key={item}
                          size="sm"
                          className="capitalize"
                        >
                          {item.replace("_", " ")}
                        </ToggleGroupItem>
                      ))}
                    </ToggleGroup>
                  </FormControl>

                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="other_roles"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Roles</FormLabel>
                  <FormControl>
                    <MultiSelector
                      values={field.value}
                      onValuesChange={field.onChange}
                      loop
                      className="max-w-xs"
                    >
                      <MultiSelectorTrigger>
                        <MultiSelectorInput placeholder="Select Roles" />
                      </MultiSelectorTrigger>
                      <MultiSelectorContent>
                        <MultiSelectorList>
                          {ROLES.map((role) => {
                            return (
                              <MultiSelectorItem
                                key={role}
                                value={role}
                                className="capitalize"
                              >
                                {role.replace("_", " ")}
                              </MultiSelectorItem>
                            );
                          })}
                        </MultiSelectorList>
                      </MultiSelectorContent>
                    </MultiSelector>
                  </FormControl>

                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" disabled={form.formState.isSubmitting}>
            Create User
          </Button>
        </form>
      </Form>
    </div>
  );
}
