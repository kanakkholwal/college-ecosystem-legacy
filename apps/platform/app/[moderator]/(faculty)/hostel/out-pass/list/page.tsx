"use client";
import { DataTable } from "@/components/ui/data-table";
import { ErrorBoundary } from "@/components/utils/error-boundary";
import { LoaderCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getOutPassHistoryForHostel } from "~/actions/hostel_outpass";
import type {
  OutPassType
} from "~/models/hostel_n_outpass";
import { columns } from "./columns";
import SearchBar from "./search";


interface PageProps {
  searchParams: Promise<{
    query?:string;
    offset?: number;
    limit?: number;
    sortBy?: string;
  }>;
}

// Function to fetch outpass based on search parameters
async function fetchOutpass(searchParams: {
  query?: string;
  offset?: number;
  limit?: number;
  sortBy?: string;
}) {
  const outpass = await getOutPassHistoryForHostel({
    query: searchParams.query,
    offset: searchParams.offset,
    limit: searchParams.limit,
    sortBy: "desc",
  });
  return outpass;
}

export default function OutPassHistoryPage(props: PageProps) {
  const searchParams = useSearchParams();
  const [outpass, setOutpass] = useState<OutPassType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const query = {
      query: searchParams.get("query") || "",
      offset: Number.parseInt(searchParams.get("offset") || "0", 0),
      limit: Number.parseInt(searchParams.get("limit") || "100", 100),
      sortBy: searchParams.get("sortBy") || "createdAt",
      sortDirection:
        (searchParams.get("sortDirection") as "asc" | "desc") || "desc",
      // filterField: searchParams.get("filterField"),
      // filterOperator: (searchParams.get("filterOperator") as "eq" | "ne" | "lt" | "lte" | "gt" | "gte"),
      // filterValue: searchParams.get("filterValue"),
    };
    setLoading(true);
    fetchOutpass(query)
      .then((res) => {
        console.log(res);
        setOutpass(res.data || []);
        setError(res?.error || null);
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
            <DataTable data={outpass} columns={columns} />
          </ErrorBoundary>
        )}
      </div>
    </div>
  );
}
