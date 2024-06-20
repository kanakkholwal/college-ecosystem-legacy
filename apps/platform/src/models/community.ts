import mongoose, { Document, Schema, Types } from "mongoose";
import { CATEGORY_TYPES, SUB_CATEGORY_TYPES } from "src/constants/community";
import * as z from "zod";

export const rawCommunityPostSchema = z.object({
  title: z.string().min(5, "Title must be atleast 5 characters long."),
  content: z.string().min(10, "Content must be atleast 10 characters long."), // markdown
  category: z.enum(CATEGORY_TYPES),
  subCategory: z
    .enum(
      SUB_CATEGORY_TYPES as unknown as [
        (typeof SUB_CATEGORY_TYPES)[number],
        ...(typeof SUB_CATEGORY_TYPES)[number][],
      ]
    )
    .optional()
    .nullable(),
});
export type RawCommunityPostType = z.infer<typeof rawCommunityPostSchema>;

export type CommunityPostTypeWithId = RawCommunityPostType & {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  author:
    | string
    | {
        _id: string;
        name: string;
        email: string;
        rollNo: string;
      };
  views: number;
  likes: string[];
  savedBy: string[];
};

interface ICommunityPost extends Document {
  title: string;
  content: string;
  category: (typeof CATEGORY_TYPES)[number];
  subCategory?: (typeof SUB_CATEGORY_TYPES)[number];
  author: Types.ObjectId;
  views: number;
  likes: Types.ObjectId[];
  savedBy: Types.ObjectId[];
  updatedAt: Date;
  createdAt: Date;
}

const communityPostSchema = new Schema<ICommunityPost>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String, enum: CATEGORY_TYPES, required: true },
    views: { type: Number, required: true },
    likes: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
    savedBy: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    subCategory: { type: String, enum: SUB_CATEGORY_TYPES, default: null },
  },
  {
    timestamps: true,
  }
);
export const rawCommunityCommentSchema = z.object({
  content: z.string().min(10, "Content must be atleast 10 characters long."), // markdown
  postId: z.string(),
  parent: z.string().nullable(),
  replies: z.array(z.string()),
  author: z.string(),
});
interface ICommunityComment extends Document {
  content: string;
  postId: Types.ObjectId;
  parentComment: Types.ObjectId | null;
  replies: Types.ObjectId[];
  author: Types.ObjectId;
}

const communityCommentSchema = new Schema<ICommunityComment>(
  {
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CommunityPost",
    },
    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CommunityComment",
      default: null,
    },
    replies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CommunityComment",
        default: [],
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const CommunityComment =
  mongoose.models?.CommunityComment ||
  mongoose.model<ICommunityComment>("CommunityComment", communityCommentSchema);

export default mongoose.models?.CommunityPost ||
  mongoose.model<ICommunityPost>("CommunityPost", communityPostSchema);
