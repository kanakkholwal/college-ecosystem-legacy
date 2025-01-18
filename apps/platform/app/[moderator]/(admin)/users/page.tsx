"use client";
import { DataTable } from "@/components/ui/data-table";
import { ErrorBoundary } from "@/components/utils/error-boundary";
import { LoaderCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { authClient } from "~/lib/auth-client";
import { ORG_DOMAIN } from "~/project.config";
import { columns } from "./columns";
import SearchBar from "./search";

type UserType = Awaited<
  ReturnType<typeof authClient.admin.listUsers>
>["data"]["users"][number];

interface PageProps {
  searchParams: Promise<{
    searchField?: string;
    searchOperator?: string;
    searchValue?: string;
    offset?: number;
    limit?: number;
    sortBy?: string;
    sortDirection?: string;
    filterField?: string;
    filterOperator?: string;
    filterValue?: string;
  }>;
}

// Function to fetch users based on search parameters
async function fetchUsers(searchParams: {
  searchField?: "email" | "name" | undefined;
  searchOperator?: "contains" | "starts_with" | "ends_with" | undefined;
  searchValue?: string;
  offset?: number;
  limit?: number;
  sortBy?: string;
  sortDirection?: "asc" | "desc" | undefined;
  filterField?: string | undefined;
  filterOperator?: "eq" | "ne" | "lt" | "lte" | "gt" | "gte" | undefined;
  filterValue?: string | undefined;
}) {
  const users = await authClient.admin.listUsers({
    query: {
      searchField: searchParams.searchField || undefined,
      searchOperator: searchParams.searchOperator || undefined,
      searchValue: searchParams.searchValue || undefined,
      limit: searchParams.limit || 50,
      offset: searchParams.offset || 0,
      sortBy: searchParams.sortBy || "createdAt",
      sortDirection: searchParams.sortDirection || "desc",
      // filterField: searchParams.filterField || undefined,
      // filterOperator: searchParams.filterOperator || undefined,
      // filterValue: searchParams.filterValue || undefined,
    },
  });
  return users;
}

export default function DashboardPage(props: PageProps) {
  const searchParams = useSearchParams();
  const [users, setUsers] = useState<UserType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const query = {
      searchField:
        (searchParams.get("searchField") as "email" | "name") || "email",
      searchOperator:
        (searchParams.get("searchOperator") as
          | "contains"
          | "starts_with"
          | "ends_with") || "ends_with",
      searchValue: searchParams.get("searchValue") || `@${ORG_DOMAIN}`,
      offset: Number.parseInt(searchParams.get("offset") || "0", 0),
      limit: Number.parseInt(searchParams.get("limit") || "50", 50),
      sortBy: searchParams.get("sortBy") || "createdAt",
      sortDirection:
        (searchParams.get("sortDirection") as "asc" | "desc") || "desc",
      // filterField: searchParams.get("filterField"),
      // filterOperator: (searchParams.get("filterOperator") as "eq" | "ne" | "lt" | "lte" | "gt" | "gte"),
      // filterValue: searchParams.get("filterValue"),
    };
    setLoading(true);
    fetchUsers(query)
      .then((res) => {
        console.log(res);
        setUsers(res.data?.users || []);
        setError(res?.error?.message || null);
      })
      .catch((err) => {
        setError(err?.message || "Error fetching data");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [searchParams]);

  return (
    <div className="space-y-6 my-5">
      <div className="container mx-auto py-10 px-2">
        <SearchBar />
        {loading ? (
          <div className="glassmorphism px-2 sm:px-4 pb-2 pt-4 rounded-lg space-y-4 flex items-center justify-center w-full min-h-80 border">
            <LoaderCircle className="size-12 text-primary animate-spin mx-auto" />
          </div>
        ) : (
          <ErrorBoundary
            fallback={
                <div className="text-center">
                  {error || "Error fetching data"}
                </div>
            }
          >
            <DataTable data={users} columns={columns} />
          </ErrorBoundary>
        )}
      </div>
    </div>
  );
}
