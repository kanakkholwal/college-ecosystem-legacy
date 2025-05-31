import EmptyArea from "@/components/common/empty-area";
import MarkdownView from "@/components/common/markdown/view";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import ConditionalRender from "@/components/utils/conditional-render";
import { ErrorBoundaryWithSuspense } from "@/components/utils/error-boundary";
import { cn } from "@/lib/utils";
import type { Metadata, ResolvingMetadata } from "next";
import Link from "next/link";
import { CATEGORY_IMAGES, type CATEGORY_TYPES } from "src/constants/community";
import { getPostsByCategory } from "src/lib/community/actions";
import { changeCase } from "~/utils/string";

interface Props {
  params: Promise<{
    category: (typeof CATEGORY_TYPES)[number];
  }>;
  searchParams: Promise<{
    page?: number;
    limit?: number;
  }>;
}

export async function generateMetadata(
  props: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const { category } = await props.params;
  // const searchParams = await props.searchParams;

  // const page = searchParams.page || 1;
  // const limit = searchParams.limit || 10;

  return {
    title: changeCase(category, "title"),
    keywords: [category, "community", "posts", "articles"],
    description: `Posts in ${category}`,
    openGraph: {
      images: [
        `${process.env.NEXT_PUBLIC_BASE_URL}/${CATEGORY_IMAGES[category]}`,
      ],
    },
  };
}
export default async function CategoryPage(props: Props) {
  const { category } = await props.params;
  const searchParams = await props.searchParams;
  const page = searchParams.page || 1;
  const limit = searchParams.limit || 10;

  const posts = await getPostsByCategory(category, page, limit);

  return (
    <>
      <div className="w-full flex items-center justify-between gap-3 mb-4 px-4 py-3 border-b max-w-5xl mx-auto bg-card rounded-md">
        <div className="inline-flex items-center gap-3">
          <Avatar className="size-12">
            <AvatarImage src={CATEGORY_IMAGES[category]} alt={category} />
            <AvatarFallback>{category.at(0)}</AvatarFallback>
          </Avatar>
          <h2 className="text-lg font-semibold">
            {changeCase(category, "title")}
          </h2>
        </div>
        <div>
          <Button variant="link" size="sm" asChild>
            <Link
              href={`/community/create?category=${category}`}
              className="flex items-center gap-2"
            >
              <span>Create Post</span>
            </Link>
          </Button>
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
