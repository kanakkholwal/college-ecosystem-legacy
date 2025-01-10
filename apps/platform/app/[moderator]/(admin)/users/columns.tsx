"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/ui/data-table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import toast from "react-hot-toast";
import type { authClient } from "~/lib/auth-client";

export type UserType = Awaited<ReturnType<typeof authClient.admin.listUsers>>["data"]["users"][number]

export const columns: ColumnDef<UserType>[] = [
    {
        id: "select",
        accessorKey: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        id: "name",
        accessorKey: "name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Name" />
        ),
        cell: ({ row }) => {
            return (
                <div className="text-left font-medium">{row.getValue("name")}</div>
            );
        },

        enableSorting: true,
        enableHiding: true,
    },
    {
        id: "username",
        accessorKey: "username",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="UserName" />
        ),
        cell: ({ row }) => {
            return (
                <div className="text-left font-medium">
                    @{row.getValue("username")}
                </div>
            );
        },
        enableSorting: true,
        enableHiding: true,
    },
    {
        id: "email",
        accessorKey: "email",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Email" />
        ),
        cell: ({ row }) => {
            return (
                <div className="text-left font-medium">{row.getValue("email")}</div>
            );
        },
        enableSorting: true,
        enableHiding: true,
    },
    {
        id: "emailVerified",
        accessorKey: "emailVerified",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Verified" />
        ),
        cell: ({ row }) => {
            return (
                <div className="text-left font-medium">
                    <Badge
                        variant={
                            row.getValue("emailVerified") ? "success_light" : "destructive_light"
                        }
                    >
                        {row.getValue("emailVerified") ? "Yes" : "No"}
                    </Badge>
                </div>
            );
        },
        enableSorting: true,
        enableHiding: true,
    },
    {
        id: "gender",
        accessorKey: "gender",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Gender" />
        ),
        cell: ({ row }) => {
            return (
                <div className="text-left font-medium">
                        {row.getValue("gender")}
                </div>
            );
        },
        enableSorting: true,
        enableHiding: true,
    },
    {
        id: "other_roles",
        accessorKey: "other_roles",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Roles" />
        ),
        cell: ({ row }) => {
            return <div className="text-left font-medium">
                {(row.original as UserType)?.other_roles?.join(", ")}
            </div>;
        },
        enableSorting: true,
        enableHiding: true,
    },
    {
        id: "createdAt",
        accessorKey: "createdAt",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Created At" />
        ),
        cell: ({ row }) => {
            const formatted = new Date(row.getValue("createdAt")).toLocaleDateString(
                "en-US",
                {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                }
            );
            return <div className="text-left font-medium">{formatted}</div>;
        },
        enableSorting: true,
        enableHiding: true,
    },
    {
        id: "actions",
        accessorKey: "actions",
        header: "Actions",
        enableSorting: false,
        enableHiding: true,
        cell: ({ row }) => {
            const user = row.original;
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem
                            onClick={() =>
                                toast.promise(navigator.clipboard.writeText(user.id), {
                                    loading: "Copying...",
                                    success: "ID copied to clipboard",
                                    error: "Failed to copy ID",
                                })
                            }
                        >
                            {" "}
                            Copy ID{" "}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => {
                                console.log("deleting user ", user);
                                
                            }}
                        >
                            <span className="text-red-600">Delete</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];