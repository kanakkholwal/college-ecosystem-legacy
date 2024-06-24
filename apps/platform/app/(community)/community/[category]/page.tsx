import EmptyArea from "@/components/common/empty-area";
import MarkdownView from "@/components/common/markdown/view";
import ConditionalRender from "@/components/utils/conditional-render";
import { ErrorBoundaryWithSuspense } from "@/components/utils/error-boundary";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { CATEGORY_IMAGES, CATEGORY_TYPES } from "src/constants/community";
import { getPostsByCategory } from "src/lib/community/actions";

interface CategoryPageProps {
  params: {
    category: (typeof CATEGORY_TYPES)[number];
  };
  searchParams: {
    page?: number;
    limit?: number;
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { category } = params;

  const page = searchParams.page || 1;
  const limit = searchParams.limit || 10;

  const posts = await getPostsByCategory(category, page, limit);

  return (
    <>
      <div className="w-full flex mb-4 py-3 border-b">
        <div>
          <Image
            src={CATEGORY_IMAGES[category]}
            alt={category}
            width={120}
            height={120}
            className="aspect-square w-auto h-full max-h-12"
          />
        </div>
      </div>
      <ErrorBoundaryWithSuspense
        fallback={<div>Failed to fetch posts</div>}
        loadingFallback={<div>Loading...</div>}
      >
        <ConditionalRender condition={posts.length === 0}>
          <EmptyArea
            title="No posts found"
            description="No posts found in this category"
          />
        </ConditionalRender>
        <ConditionalRender condition={posts.length > 0}>
          <div className="grid grid-cols-1 @md:grid-cols-2 rounded-md bg-muted text-muted-foreground w-full p-2">
            {posts.map((post) => {
              return (
                <Link
                  href={`/community/posts/${post._id}`}
                  className={cn(
                    "rounded-sm p-4 font-medium transition-all text-gray-800  text-md w-full capitalize",
                    "hover:bg-background/40 hover:shadow-sm"
                  )}
                  key={post._id}
                >
                  <h3>{post.title}</h3>
                  <MarkdownView>
                    {post.content?.split("\n")?.slice(0, 3)?.join("\n")}
                  </MarkdownView>
                </Link>
              );
            })}
          </div>
        </ConditionalRender>
      </ErrorBoundaryWithSuspense>
    </>
  );
}
