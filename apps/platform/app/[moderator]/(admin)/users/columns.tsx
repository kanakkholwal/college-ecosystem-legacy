"use client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
// import { Checkbox } from "@/components/ui/checkbox"
import { DataTableColumnHeader } from "@/components/ui/data-table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import Link from "next/link"
import toast from "react-hot-toast"
import { deleteUser } from 'src/lib/users/actions'
import { UserWithId } from "src/models/user"



export type userType = Pick<UserWithId, "_id" | "firstName" | "lastName" | "email" | "roles" | "department" | "createdAt" | "rollNo">


export const columns: ColumnDef<userType>[] = [
  // {
    // id: "select",
    // accessorKey: "select",
    // header: ({ table }) => (
    //   <Checkbox
    //     checked={
    //       table.getIsAllPageRowsSelected() ||
    //       (table.getIsSomePageRowsSelected() && "indeterminate")
    //     }
    //     onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
    //     aria-label="Select all"
    //   />
    // ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    id: "firstName",
    accessorKey: "firstName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const user = row.original;

      return <div className="text-left font-medium">{user["firstName"]}{" "}{user["lastName"]}</div>
    },

    enableSorting: true,
    enableHiding: true,
  },
  {
    id: "rollNo",
    accessorKey: "rollNo",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="UserName" />
    ),
    cell: ({ row }) => {
      const user = row.original;
      return <Link className="text-left font-medium" href={`/people/${user.rollNo}`} target="_blank">@{user["rollNo"]}</Link>
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

      return <div className="text-left font-medium">{row.getValue("email")}</div>
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    id: "roles",
    accessorKey: "roles",
    header: "Roles",
    cell: ({ row }) => {
      const user = row.original;

      return <div className="text-left font-medium">
        {user.roles?.map((role: string) => {
          return <Badge key={role} variant="default_light" className="m-1">{role}</Badge>
        })}
      </div>
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    id: "department",
    accessorKey: "department",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="department" />
    ),
    cell: ({ row }) => {
      return <div className="text-left font-medium">{row.getValue("department")}</div>
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    id: "createdAt",
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Joined At" />
    ),
    cell: ({ row }) => {
      const formatted = new Date(row.getValue("createdAt")).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
      return <div className="text-left font-medium">{formatted}</div>
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
            <DropdownMenuItem onClick={() => toast.promise(navigator.clipboard.writeText(user._id),{ 
              loading: 'Copying...',
              success: 'ID copied to clipboard',
              error: 'Failed to copy ID' })}> Copy ID </DropdownMenuItem>
            <DropdownMenuItem onClick={()=>{
              console.log("deleting user ",user);
              toast.promise(deleteUser(user._id),{
                loading: 'Deleting...',
                success: 'User deleted',
                error: (error) => error.response.data.message
              })
            }}>
              <span className="text-red-600">Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
