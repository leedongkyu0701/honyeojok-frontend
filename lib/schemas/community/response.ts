import { z } from "zod";

export const POST_TYPE_VALUES = ["REVIEW", "FREE", "QUESTION"] as const;
export const CATEGORY_TYPE_VALUES = ["ALL", ...POST_TYPE_VALUES] as const;

export const postTypeSchema = z.enum(POST_TYPE_VALUES);
export const categoryTypeSchema = z.enum(CATEGORY_TYPE_VALUES);

export const postImageBlockItemSchema = z.object({
  url: z.string(),
  caption: z.string().nullable(),
});

export const postCardSchema = z.object({
  id: z.number(),
  title: z.string(),

  region: z.string().optional(),
  regionName: z.string().optional(),

  createdAt: z.string(),

  nickName: z.string(),

  likeCount: z.number(),
  viewCount: z.number(),

  thumbnailUrl: z.string().optional(),

  type: postTypeSchema,
});

export const postDetailSchema = z.object({
  id: z.number(),
  title: z.string(),

  region: z.string().optional(),
  regionName: z.string().optional(),

  createdAt: z.string(),

  nickName: z.string(),

  content: z.string(),

  type: postTypeSchema,

  rating: z.number().optional(),

  images: z.array(postImageBlockItemSchema),

  likeCount: z.number(),
  viewCount: z.number(),

  likedByMe: z.boolean(),
});

export const commentUserSchema = z.object({
  id: z.number(),
  nickName: z.string(),
});

type CommentNode = {
  id: number;
  content: string;
  isDeleted: boolean;
  createdAt: string;
  postId: number;
  userId: number;
  parentId: number | null;
  user: {
    id: number;
    nickName: string;
  };
  children: CommentNode[];
};

export const commentSchema: z.ZodType<CommentNode> = z.lazy(() =>
  z.object({
    id: z.number(),
    content: z.string(),
    isDeleted: z.boolean(),

    createdAt: z.string(),

    postId: z.number(),
    userId: z.number(),
    parentId: z.number().nullable(),

    user: commentUserSchema,

    children: z.array(commentSchema),
  }),
);

export const commentsSchema = z.array(commentSchema);
export const postCardListSchema = z.array(postCardSchema);

export const likePostResponseSchema = z.object({
  liked: z.boolean(),
  likeCount: z.number(),
});

export const postListSchema = z.object({
  posts: z.array(postCardSchema),
  totalPages: z.number(),
});

export type PostType = z.infer<typeof postTypeSchema>;
export type CategoryType = z.infer<typeof categoryTypeSchema>;
export type PostImageBlockItem = z.infer<typeof postImageBlockItemSchema>;
export type PostCardResponse = z.infer<typeof postCardSchema>;
export type PostDetailResponse = z.infer<typeof postDetailSchema>;
export type CommentUserResponse = z.infer<typeof commentUserSchema>;
export type CommentResponse = z.infer<typeof commentSchema>;
export type LikePostResponse = z.infer<typeof likePostResponseSchema>;
export type PostListResponse = z.infer<typeof postListSchema>;