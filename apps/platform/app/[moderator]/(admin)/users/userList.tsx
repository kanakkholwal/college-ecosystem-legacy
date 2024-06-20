"use client";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import axios from "axios";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { UserWithId } from "src/models/user";
import { columns } from "./columns";

const USER_PER_PAGE = 50;

interface UserListProps {
  initialUsers: UserWithId[];
  initialHasMore: boolean;
}

export default function UserList({
  initialUsers,
  initialHasMore,
}: UserListProps) {
  const searchParams = useSearchParams() as URLSearchParams;
  const [offset, setOffset] = useState(USER_PER_PAGE);
  const [users, setUsers] = useState<UserWithId[]>(initialUsers);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);

  const loadMoreUsers = async () => {
    if (hasMore) {
      setLoading(true);
      await axios
        .get(
          `/api/users?query=${searchParams.get("query") || ""}&offset=${offset}`
        )
        .then((response) => response.data)
        .then((response) => {
          setHasMore(response.hasMore);
          setUsers((prevUsers) => [...prevUsers, ...response.users]);
          setOffset((prevOffset) => prevOffset + USER_PER_PAGE);
        })
        .catch((err) => {
          console.log("err", err);
        })
        .finally(() => setLoading(false));
    }
  };

  return (
    <>
      <div className="flex justify-between items-center gap-2 p-3 w-full">
        <Button className=" ml-auto" size="sm" variant="default_light" asChild>
          <Link href="/admin/users/create">Create User</Link>
        </Button>
      </div>
      <DataTable columns={columns} data={users} key={users.length} />
      <div className="flex justify-center w-full mt-4">
        {hasMore ? (
          <Button
            onClick={loadMoreUsers}
            disabled={loading}
            className="w-1/2 mx-auto"
          >
            {loading && <Loader2 className="animate-spin" />}
            {!loading && "Load More"}
          </Button>
        ) : (
          <div className="w-1/2 mx-auto">No more users</div>
        )}
      </div>
    </>
  );
}
