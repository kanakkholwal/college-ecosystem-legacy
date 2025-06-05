import Link from "next/link";
import { CATEGORIES } from "~/constants/community";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, X } from "lucide-react";
import type { Metadata } from "next";
import { getPostsByCategory } from "~/lib/community/actions";
import CommunityPostList from "./list";

export const metadata: Metadata = {
  title: 'Communities',
  description: "Explore different communities",
};

export default async function CommunitiesPage(props: {
  searchParams: Promise<{
    c?: string,
    page?: number,
    limit?: number
  }>;
}) {
  const searchParams = await props.searchParams;
  const category = searchParams.c || 'all'; // Default to 'all' if no category is provided
  const page = searchParams.page || 1;
  const limit = searchParams.limit || 10;

  const posts = await getPostsByCategory(category, page, limit);

  const activePopularCategory = CATEGORIES.find(c => c.value === category);
  return (
    <>

      {/* Feed */}
      <main className="md:col-span-3 lg:col-span-2 space-y-4 pr-2 min-h-screen">
        <div className="md:sticky md:top-4 z-50 w-full mx-1.5 lg:mx-auto flex justify-between items-center gap-2 bg-card px-2 lg:px-4 py-1 lg:py-2 rounded-lg border">
          <h3 className="text-base font-medium">
            Community Posts
            {activePopularCategory && (
              <span className="text-sm text-muted-foreground ml-1">
                in c/{activePopularCategory.name} 
                <Link href="/community" className="ml-1 hover:text-primary cursor-pointer" shallow>
                <X className="inline-block size-3" />
                </Link>
              </span>
            )}
            <Badge size="sm" className="ml-2">
              {posts.length}
            </Badge>
          </h3>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/community/create">
              Create Post
              <ArrowRight />
            </Link>
          </Button>
        </div>
        <CommunityPostList posts={posts} />

      </main>
      {/* Active Feed Details */}
      {activePopularCategory ? (
        <aside className="hidden lg:block md:col-span-1 space-y-4 sticky top-0 h-fit">
          <div className="bg-card rounded-2xl shadow p-4">
            <h2 className="text-base font-medium mb-2">c/{activePopularCategory.name}</h2>
            <p className="text-sm text-muted-foreground">{activePopularCategory.description}
            </p>
          </div>
        </aside>
      ) : null}

    </>
  );
}
