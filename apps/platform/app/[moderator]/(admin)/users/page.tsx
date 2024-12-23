import { ErrorBoundaryWithSuspense } from "@/components/utils/error-boundary";
import { listUsers } from "~/actions/dashboard.admin";
import SearchBar from "./search";
import UserList from "./userList";

interface PageProps {
  searchParams: Promise<{
    query?: string;
    offset?: number;
  }>;
}

export default async function DashboardPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const offset = Number(searchParams.offset) || 1;
  const query = searchParams.query || "";

  const usersList = await listUsers({
    sortBy: "updatedAt",
    sortOrder: "desc",
    limit: 50,
    offset: offset,
    searchQuery: query
  });

  return (
    <div className="space-y-6 my-5">
      <div className="container mx-auto py-10 px-2">
        <SearchBar />
        <ErrorBoundaryWithSuspense
          fallback={<div className="text-center">Error fetching data</div>}
          loadingFallback={<div className="text-center">Loading...</div>}
        >
          <UserList initialUsers={usersList} initialHasMore={false} />
        </ErrorBoundaryWithSuspense>
      </div>
    </div>
  );
}
