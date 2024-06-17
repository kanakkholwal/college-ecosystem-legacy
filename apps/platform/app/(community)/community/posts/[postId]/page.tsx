import MarkdownView from "@/components/common/markdown/view";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from 'date-fns';
import { notFound } from "next/navigation";
import { getSession } from "src/lib/auth";
import { getPostById } from "src/lib/community/actions";
import { sessionType } from "src/types/session";

interface CommunityPostProps {
    params: {
        postId: string;
    }
};

const cache = new Map<string, boolean>();

export default async function CommunityPost({ params }: CommunityPostProps) {
    const session = await getSession() as sessionType;
    const post = await getPostById(params.postId, cache.get(params.postId) || false);

    if (!post) return notFound();
    if (post) {
        cache.set(params.postId, true);
    }
    console.log(post);

    return (
        <>
            <Card variant="glass">
                <CardHeader>
                    <div className="flex gap-1">
                        <div className="flex flex-col gap-1">
                            <p className="text-sm text-gray-700 capitalize">
                                {post.category} {" • "}
                                <span className="text-sm text-gray-600 lowercase">
                                    {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                                </span>
                            </p>
                            <p className="text-xs font-semibold">
                                by @{typeof post.author !== "string" && post.author.rollNo}
                            </p>
                        </div>
                    </div>
                    <CardTitle>{post.title}</CardTitle>
                    <CardDescription>

                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <MarkdownView className="prose prose-sm dark:prose-invert">{post.content}</MarkdownView>
                </CardContent>
                <CardFooter>

                </CardFooter>
            </Card>
        </>
    );
}
