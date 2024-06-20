import { ErrorBoundaryWithSuspense } from "@/components/utils/error-boundary";
import { getUsers } from "src/lib/users/actions";
import SearchBar from "./search";
import UserList from "./userList";

interface PageProps {
  searchParams: {
    query?: string;
    offset?: number;
  };
}

export default async function DashboardPage({ searchParams }: PageProps) {
  const offset = Number(searchParams.offset) || 1;
  const query = searchParams.query || "";

  const { users, hasMore } = await getUsers(query, offset, {});

  return (
    <div className="space-y-6 my-5">
      <div className="container mx-auto py-10 px-2">
        <SearchBar />
        <ErrorBoundaryWithSuspense
          fallback={<div className="text-center">Error fetching data</div>}
          loadingFallback={<div className="text-center">Loading...</div>}
        >
          <UserList initialUsers={users} initialHasMore={hasMore} />
        </ErrorBoundaryWithSuspense>
      </div>
    </div>
  );
}
