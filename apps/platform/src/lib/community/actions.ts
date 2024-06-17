"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "src/lib/auth";
import dbConnect from "src/lib/dbConnect";
import CommunityPost, {
    CommunityComment,
    CommunityPostTypeWithId,
    rawCommunityCommentSchema,
    RawCommunityPostType,
} from "src/models/community";
import { z } from "zod";

// Create a new post
export async function createPost(postData: RawCommunityPostType) {
    const session = await getSession();
    if (!session) {
        return Promise.reject("You need to be logged in to create a post");
    }

    try {
        await dbConnect();
        const post = new CommunityPost({
            ...postData,
            author: session.user._id,
            views: 0,
            likes: [],
            savedBy: [],
        });
        await post.save();
        revalidatePath(`/community`);
        return Promise.resolve("Post created successfully");
    } catch (err) {
        console.error(err);
        return Promise.reject("Failed to create post");
    }
}

// Get posts by category and pagination
export async function getPostsByCategory(
    category: string,
    page: number,
    limit: number
) :Promise<CommunityPostTypeWithId[]> {
    try {
        await dbConnect();
        const posts = await CommunityPost.find({ category })
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .populate("author", "name email rollNo");
        return Promise.resolve(JSON.parse(JSON.stringify(posts)));
    } catch (err) {
        console.error(err);
        return Promise.reject("Failed to fetch posts");
    }
}

// Get a single post by ID
export async function getPostById(id: string,cached:boolean):Promise<CommunityPostTypeWithId>  {
    try {
        await dbConnect();
        const post = await CommunityPost.findById(id)
        .populate("author", "name email rollNo");
        if(!cached){
            post.views +=1;
            await post.save();
        }
        return Promise.resolve(JSON.parse(JSON.stringify(post)));
    } catch (err) {
        console.error(err);
        return Promise.reject("Failed to fetch post");
    }
}

// Update post (likes, saves, views)
export async function updatePost(
    id: string,
    updates: Partial<CommunityPostTypeWithId>
) {
    const session = await getSession();
    if (!session) {
        return Promise.reject("You need to be logged in to update a post");
    }

    try {
        await dbConnect();
        const post = await CommunityPost.findById(id);
        if (!post) {
            return Promise.reject("Post not found");
        }

        // Check if the user is the author of the post
        if (post.author.toString() !== session.user._id.toString()) {
            return Promise.reject("You are not authorized to update this post");
        }

        Object.assign(post, updates);
        await post.save();
        revalidatePath(`/community/posts/${id}`);
        return Promise.resolve(JSON.parse(JSON.stringify(post)));
    } catch (err) {
        console.error(err);
        return Promise.reject("Failed to update post");
    }
}

// Create a new comment
export async function createComment(commentData: z.infer<typeof rawCommunityCommentSchema>) {
    const session = await getSession();
    if (!session) {
        return Promise.reject("You need to be logged in to create a comment");
    }

    try {
        await dbConnect();
        const comment = new CommunityComment({
            ...commentData,
            author: session.user._id,
        });
        await comment.save();
        revalidatePath(`/community/posts/${commentData.postId}`);
        return Promise.resolve("Comment created successfully");
    } catch (err) {
        console.error(err);
        return Promise.reject("Failed to create comment");
    }
}

// Get comments for a post (with pagination or lazy loading)
export async function getCommentsForPost(postId: string, page: number, limit: number) {
    try {
        await dbConnect();
        const comments = await CommunityComment.find({ postId })
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .populate("replies")
            .populate("author", "name email");
        return Promise.resolve(JSON.parse(JSON.stringify(comments)));
    } catch (err) {
        console.error(err);
        return Promise.reject("Failed to fetch comments");
    }
}