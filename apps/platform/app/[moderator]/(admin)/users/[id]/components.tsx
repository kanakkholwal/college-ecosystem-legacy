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
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { DEPARTMENTS_LIST } from "src/constants/departments";
import { ROLES } from "src/constants/user";
import * as z from "zod";
import { authClient } from "~/lib/auth-client";

import type { InferSelectModel } from "drizzle-orm";
import type { users } from "~/db/schema";

type UserType = InferSelectModel<typeof users>;

interface Props {
  currentUser: UserType;
}

const formSchema = z.object({
  gender: z.enum(["male", "female", "not_specified"]),
  department: z.string(),
  other_roles: z.array(z.string()),
});

export function UserUpdate({
  currentUser,
}: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      department: currentUser.department,
      other_roles: currentUser.other_roles,
      gender: currentUser.gender
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log(data);
    // toast.promise(updateUser(currentUser.id), {
    //   loading: "Updating user...",
    //   success: "User updated successfully",
    //   error: "Failed to update user",
    // });
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
                    defaultValue={"not_specified"}
                    value={field.value}
                    onValueChange={(value) => field.onChange(value)}
                    className="justify-start"
                    type="single">
                    {["male", "female", "not_specified"].map((item) => (
                      <ToggleGroupItem value={item} key={item} size="sm" className="capitalize">{item.replace("_", " ")}</ToggleGroupItem>)
                    )}
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
                            <MultiSelectorItem key={role} value={role} className="capitalize">
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
          <Button type="submit" disabled={form.formState.isSubmitting}>
            Submit
          </Button>
        </form>
      </Form>
    </>
  );
}


type SessionType = Awaited<ReturnType<typeof authClient.admin.listUsers>>["data"]["sessions"][number];


export function UserSessions({
  currentUser,
}: Props) {
  const [sessions, setSessions] = useState<SessionType>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // if (
    //   cacheMap.get("sessions") && cacheMap.get("sessions").length > 0
    // ) {
    //   setSessions(cacheMap.get("sessions") || [])
    //   return;
    // }
    authClient.admin.listUserSessions({
      userId: currentUser.id
    }).then(res => {
      console.log(res)
      setSessions(res.data?.sessions || [])
      setError(res?.error?.message || null)
    }).catch(err => {
      setError(err.message)
    })

  }, [currentUser.id])

  return <ErrorBoundaryWithSuspense
    fallback={<div>Error fetching sessions</div>}
    loadingFallback={<div>Loading sessions...</div>}
  >
    <div className="w-full flex justify-between items-center mt-5">
      <h4 className="text-lg font-bold">User Sessions</h4>
      <Button variant="destructive" size="sm" onClick={() => {
        toast.promise(authClient.admin.revokeUserSessions({
          userId: currentUser.id
        }), {
          loading: "Revoking all sessions...",
          success: "All sessions revoked successfully",
          error: "Failed to revoke all sessions",
        })

      }}>
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
          return <TableRow key={session.id}>
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
                  toast.promise(authClient.admin.revokeUserSession({
                    sessionToken: session.token
                  }), {
                    loading: "Revoking session...",
                    success: "Session revoked successfully",
                    error: "Failed to revoke session",
                  });
                }}
              >
                Revoke
              </Button>
            </TableCell>
          </TableRow>
        })}
      </TableBody>
    </Table>


  </ErrorBoundaryWithSuspense>


}

export function UserDisplay({ currentUser: user }: Props) {

  return <div className="container mx-auto py-10 px-2">
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
          return <tr key={key} className="m-0 border-t p-0 even:bg-muted">
            <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
              {key}
            </td>
            <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
              {value?.toString()}
            </td>
          </tr>
        })}
      </tbody>
    </table>
    <div className="flex gap-4 mt-5">


      <Button variant="destructive" onClick={() => {
        const confirm = window.confirm("Are you sure you want to delete this user?")
        if (!confirm) return;
        toast.promise(authClient.admin.removeUser({
          userId: user.id
        }), {
          loading: "Deleting user...",
          success: "User deleted successfully",
          error: "Failed to delete user",
        })
      }} size="sm">
        Delete User
      </Button>
    </div>



  </div>
}