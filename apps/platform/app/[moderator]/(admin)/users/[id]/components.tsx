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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ErrorBoundaryWithSuspense } from "@/components/utils/error-boundary";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatDistance } from "date-fns";
import type { InferSelectModel } from "drizzle-orm";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { DEPARTMENTS_LIST } from "src/constants/departments";
import { ROLES } from "src/constants/user";
import * as z from "zod";
// import toast from "react-hot-toast";
import type { users } from "~/db/schema";
import { authClient } from "~/lib/auth-client";

type UserType = InferSelectModel<typeof users>;

interface Props {
  currentUser: UserType;
}

const formSchema = z.object({
  // rollNo: z.string(),
  // email: z.string().email(),
  department: z.string(),
  other_roles: z.array(z.string()),
});

export function UserUpdate({
  currentUser,
}: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // rollNo: currentUser.rollNo,
      // email: currentUser.email,
      department: currentUser.department,
      other_roles: currentUser.other_roles,
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

  //TODO: Add roles field
  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="other_roles"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel>Roles</FormLabel>
                  <FormDescription>
                    Roles define what a user can do in the system.
                  </FormDescription>
                </div>
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ">
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
                            className="flex flex-row items-start space-x-3 space-y-0"
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
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="department"
            render={({ field }) => (
              <FormItem className="flex flex-col">
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
                    {DEPARTMENTS_LIST.map((department) => {
                      return (
                        <SelectItem
                          key={department.code}
                          value={department.name}
                        >
                          {department.name}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
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

// const cacheMap = new Map<string, SessionType[]>([
//   ["sessions", []]
// ]);

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
        // .then(res => {
        //   if (res.status === "success") {
        //     setSessions([])
        //     cacheMap.set("sessions", [])
        //   }})
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
              {formatDistance(new Date(session.createdAt),new Date(), {
                addSuffix: true,
              })}
            </TableCell>
            <TableCell>
              {formatDistance(new Date(session.expiresAt),new Date(), {
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

    

  </div>
}