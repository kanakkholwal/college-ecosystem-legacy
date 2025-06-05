import EmptyArea from '@/components/common/empty-area';
import ShareButton from '@/components/common/share-button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MDXRemote } from '@mintlify/mdx';
import { formatDistanceToNow } from "date-fns";
import { ArrowRight, Bookmark, Dot, Eye, Share } from 'lucide-react';
import Link from "next/link";
import { BiUpvote } from 'react-icons/bi';
import { GrAnnounce } from "react-icons/gr";
import type { CommunityPostTypeWithId } from "src/models/community";
import { CATEGORY_IMAGES } from '~/constants/community';
import { appConfig } from '~/project.config';
import { formatNumber } from '~/utils/number';

export default function CommunityPostList({
    posts,
}: {
    posts: CommunityPostTypeWithId[];
}) {

    if (posts.length === 0) {
        return (
            <EmptyArea
                icons={[GrAnnounce]}
                title="No community posts"
                description="There are no community posts at the moment."
            />
        );
    }
    return (
        <div className="grid grid-cols-1 gap-4 w-full">
            {posts.map((post) => {
                return (
                    <div
                        key={post._id}
                        className="w-full mx-auto rounded-lg bg-card backdrop-blur-md p-3 lg:p-5 grid grid-cols-1 space-y-4"
                    >
                        <div className='inline-flex items-center gap-2'>
                            <Avatar className="size-6 rounded-full">
                                <AvatarImage
                                    alt={post.author.username}
                                    width={20}
                                    height={20}
                                    src={CATEGORY_IMAGES[post.category] ? CATEGORY_IMAGES[post.category] : `https://api.dicebear.com/5.x/initials/svg?seed=${post.category}`}

                                />
                                <AvatarFallback>
                                    {post.category.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <p className="text-xs text-muted-foreground">
                                <Link href={`/community?c=${post.category}`} className="hover:underline hover:text-primary font-medium">
                                    c/{post.category}
                                </Link>
                                <Dot className="inline-block -mx-1" />
                                <span>
                                    {formatDistanceToNow(new Date(post.createdAt), {
                                        addSuffix: true,
                                    })}
                                </span>
                                <Dot className="inline-block -mx-1" />
                                <Link
                                    href={`/u/${post.author.username}`}
                                    className="text-primary hover:underline"
                                >
                                    @{post.author.username}
                                </Link>
                            </p>
                        </div>
                        <h3 className="text-base font-medium">{post.title}</h3>
                        <article className="border py-4  max-w-full prose prose-sm dark:prose-invert text-muted-foreground text-xs pl-2 bg-muted/50 w-full rounded-lg">
                            {/* show only 200 characters */}
                            <MDXRemote source={post.content
                                .slice(0, 200) + (post.content.length > 200 ? '...' : '')
                            } parseFrontmatter mdxOptions={{
                                format: "md"
                            }} />
                        </article>
                        <div className='flex items-center gap-3'>
                            <div className="flex items-center justify-between gap-2">
                                <Badge>
                                    <Eye />
                                    {formatNumber(post.views)}
                                </Badge>
                                <Badge>
                                    <BiUpvote />
                                    {post.likes.length}
                                </Badge>
                                <Badge>
                                    <Bookmark />
                                    {post.savedBy.length}
                                </Badge>
                                <ShareButton
                                    data={{
                                        title: post.title,
                                        text: post.content,
                                        url: appConfig.url + `/community/posts/${post._id}`,
                                    }}
                                    variant="ghost" size="xs">
                                    <Share />
                                    Share
                                </ShareButton>
                            </div>
                            <div className="ml-auto">
                                <Button
                                    variant="dark"
                                    size="xs"
                                    effect="shineHover"
                                    asChild>
                                    <Link href={`/community/posts/${post._id}`}>
                                        View Post
                                        <ArrowRight />
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
