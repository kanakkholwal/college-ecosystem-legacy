"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/ui/data-table";
import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import type { OutPassType } from "~/models/hostel_n_outpass";

export const columns: ColumnDef<OutPassType>[] = [
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
        <div className="text-left font-medium">{row.original.student.name}</div>
      );
    },

    enableSorting: true,
    enableHiding: true,
  },
  {
    id: "rollNumber",
    accessorKey: "rollNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Roll Number" />
    ),
    cell: ({ row }) => {
      return (
        <div className="text-left font-medium">
          {row.original.student.rollNumber}
        </div>
      );
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    id: "roomNumber",
    accessorKey: "roomNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Room Number" />
    ),
    cell: ({ row }) => {
      return (
        <div className="text-left font-medium">{row.original.roomNumber}</div>
      );
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    id: "reason",
    accessorKey: "reason",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Reason" />
    ),
    cell: ({ row }) => {
      return (
        <div className="text-left font-medium">{row.getValue("reason")}</div>
      );
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    id: "status",
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      return <div className="text-left font-medium">{row.original.status}</div>;
    },
    enableSorting: false,
    enableHiding: true,
    enableGrouping: true,
  },
  {
    id: "updatedAt",
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Updated At" />
    ),
    cell: ({ row }) => {
      const formatted = new Date(row.getValue("updatedAt")).toLocaleDateString(
        "en-IN",
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
      return (
        <div className="text-left font-medium">
          <Button variant="link" asChild>
            <Link href={`outpass-logs/${row.original.student._id}`}>
              View all outpass
            </Link>
          </Button>
        </div>
      );
    },
  },
];
