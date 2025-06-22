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
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ErrorBoundaryWithSuspense } from "@/components/utils/error-boundary";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatDistance } from "date-fns";
import type { InferSelectModel } from "drizzle-orm";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { DEPARTMENTS_LIST } from "src/constants/departments";
import * as z from "zod";
import { updateUser } from "~/actions/dashboard.admin";
import { deleteUserResourcesById } from "~/actions/user";
import { IN_CHARGES_EMAILS } from "~/constants/hostel_n_outpass";
import { ROLES, emailSchema, genderSchema } from "~/constants/user";
import type { users } from "~/db/schema";
import { authClient } from "~/lib/auth-client";
import type { HostelType } from "~/models/hostel_n_outpass";
type UserType = InferSelectModel<typeof users>;

interface Props {
  currentUser: UserType;
}

const formSchema = z.object({
  gender: genderSchema,
  department: z.string(),
  other_roles: z.array(z.string()),
  hostelId: z.string().default("not_specified"),
  other_emails: z.array(emailSchema).optional(),
});

export function UserUpdate({
  currentUser,
  hostels,
}: Props & { hostels: HostelType[] }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      department: currentUser.department,
      other_roles: currentUser.other_roles,
      gender: currentUser.gender,
      hostelId: currentUser.hostelId || "not_specified",
      other_emails: currentUser.other_emails || [],
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log(data);
    toast.promise(
      updateUser(currentUser.id, {
        ...data,
      }),
      {
        loading: "Updating user...",
        success: "User updated successfully",
        error: "Failed to update user",
      }
    );
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <FormControl>
                  <ToggleGroup
                    defaultValue={currentUser.gender}
                    value={field.value}
                    onValueChange={(value) => field.onChange(value)}
                    className="justify-start"
                    type="single"
                    size="sm"
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
                            <MultiSelectorItem key={role} value={role}>
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
          <FormField
            control={form.control}
            name="other_emails"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Other Emails</FormLabel>
                <FormControl>
                  <MultiSelector
                    values={(field.value || []) as string[]}
                    onValuesChange={field.onChange}
                    loop
                    className="max-w-xs"
                  >
                    <MultiSelectorTrigger>
                      <MultiSelectorInput placeholder="Select emails" />
                    </MultiSelectorTrigger>
                    <MultiSelectorContent>
                      <MultiSelectorList>
                        {IN_CHARGES_EMAILS.map((in_charge) => {
                          return (
                            <MultiSelectorItem
                              key={in_charge.slug}
                              value={in_charge.email}
                            >
                              {in_charge.email}
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
                    <SelectTrigger className="ml-2">
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
            name="hostelId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hostel</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value || "not_specified"}
                  disabled={hostels.length === 0}
                >
                  <FormControl>
                    <SelectTrigger className="ml-2">
                      <SelectValue placeholder="Select a hostel" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {hostels.map((hostel) => {
                      return (
                        <SelectItem key={hostel._id} value={hostel._id}>
                          {hostel.name}
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
          <Button type="submit" disabled={form.formState.isSubmitting}>
            Submit
          </Button>
        </form>
      </Form>
    </>
  );
}

type SessionType = Awaited<
  ReturnType<typeof authClient.admin.listUsers>
>["data"]["sessions"][number];

export function UserSessions({ currentUser }: Props) {
  const [sessions, setSessions] = useState<SessionType>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // if (
    //   cacheMap.get("sessions") && cacheMap.get("sessions").length > 0
    // ) {
    //   setSessions(cacheMap.get("sessions") || [])
    //   return;
    // }
    authClient.admin
      .listUserSessions({
        userId: currentUser.id,
      })
      .then((res) => {
        console.log(res);
        setSessions(res.data?.sessions || []);
        setError(res?.error?.message || null);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, [currentUser.id]);

  return (
    <ErrorBoundaryWithSuspense
      fallback={<div>Error fetching sessions</div>}
      loadingFallback={<div>Loading sessions...</div>}
    >
      <div className="w-full flex justify-between items-center">
        <h4 className="text-base font-semibold">User Sessions</h4>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => {
            toast.promise(
              authClient.admin.revokeUserSessions({
                userId: currentUser.id,
              }),
              {
                loading: "Revoking all sessions...",
                success: "All sessions revoked successfully",
                error: "Failed to revoke all sessions",
              }
            );
          }}
        >
          Revokes all
        </Button>
      </div>
      <Table>
        <TableCaption>A list of sessions of {currentUser.email}</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>User Agent</TableHead>
            <TableHead>Created at</TableHead>
            <TableHead>Expires In</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sessions.map((session: SessionType) => {
            return (
              <TableRow key={session.id}>
                <TableCell>{session.id}</TableCell>
                <TableCell>{session.userAgent}</TableCell>
                <TableCell>
                  {formatDistance(new Date(session.createdAt), new Date(), {
                    addSuffix: true,
                  })}
                </TableCell>
                <TableCell>
                  {formatDistance(new Date(session.expiresAt), new Date(), {
                    addSuffix: true,
                  })}
                </TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      toast.promise(
                        authClient.admin.revokeUserSession({
                          sessionToken: session.token,
                        }),
                        {
                          loading: "Revoking session...",
                          success: "Session revoked successfully",
                          error: "Failed to revoke session",
                        }
                      );
                    }}
                  >
                    Revoke
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </ErrorBoundaryWithSuspense>
  );
}

export function UserDisplay({ currentUser: user }: Props) {
  return (
    <div className="container mx-auto px-2">
      <table className="w-full">
        <thead>
          <tr className="m-0 border-t p-0 even:bg-muted">
            <th className="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">
              Attribute
            </th>
            <th className="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">
              Value
            </th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(user).map(([key, value]) => {
            return (
              <tr key={key} className="m-0 border-t p-0 even:bg-muted">
                <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                  {key}
                </td>
                <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                  {value?.toString()}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="flex gap-4 mt-5">
        <Button
          variant="destructive"
          onClick={() => {
            const confirm = window.confirm(
              "Are you sure you want to delete this user?"
            );
            if (!confirm) return;
            toast.promise(
              deleteUserResourcesById(user.id),
              {
                loading: "Deleting user resources...",
                success: "User resources deleted successfully",
                error: "Failed to delete user resources",
              }
            ).then(() => {
              toast.promise(
                authClient.admin.removeUser({
                  userId: user.id,
                }),
                {
                  loading: "Deleting user...",
                  success: "User deleted successfully",
                  error: "Failed to delete user",
                }
              )
            });
          }}
          size="sm"
        >
          Delete User
        </Button>
      </div>
    </div>
  );
}
