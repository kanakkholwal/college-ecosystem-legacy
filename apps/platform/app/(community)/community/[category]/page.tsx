import MarkdownView from "@/components/common/markdown/view";
import { ErrorBoundaryWithSuspense } from "@/components/utils/error-boundary";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { getPostsByCategory } from "src/lib/community/actions";
import { CATEGORY_TYPES } from "src/models/community";

interface CategoryPageProps {
    params: {
        category: typeof CATEGORY_TYPES[number];
    },
    searchParams: {
        page?: number;
        limit?: number;
    }
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
    const { category } = params;

    const page = searchParams.page || 1;
    const limit = searchParams.limit || 10;

    const posts = await getPostsByCategory(category, page, limit);

    return (
        <div className="grid grid-cols-1 @md:grid-cols-2 rounded-md bg-muted text-muted-foreground w-full p-2">
            <ErrorBoundaryWithSuspense
                fallback={<div>Failed to fetch posts</div>}
                loadingFallback={<div>Loading...</div>}
            >
                {posts.map((post) => {
                    return <Link href={`/community/posts/${post._id}`}
                        className={cn(
                            "rounded-sm p-4 font-medium  transition-all text-gray-800  text-md w-full capitalize",
                            "hover:bg-background/40 hover:shadow-sm"
                        )}
                        key={post._id}>
                        <h3>{post.title}</h3>
                        <MarkdownView>
                            {post.content?.split("\n")?.slice(0, 3)?.join("\n")}
                        </MarkdownView>
                    </Link>
                })}
            </ErrorBoundaryWithSuspense>
        </div>
    );
}
