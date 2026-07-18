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
  region: z.string().nullish(),
  regionName: z.string().nullish(),
  createdAt: z.string(),
  nickName: z.string(),
  likeCount: z.number(),
  viewCount: z.number(),
  thumbnailUrl: z.string().nullish(),
  type: postTypeSchema,
});

export const postDetailSchema = z.object({
  id: z.number(),
  title: z.string(),
  region: z.string().nullish(),
  regionName: z.string().nullish(),
  createdAt: z.string(),
  nickName: z.string(),
  content: z.string(),
  type: postTypeSchema,
  rating: z.number().nullish(),
  images: z.array(postImageBlockItemSchema),
  likeCount: z.number(),
  viewCount: z.number(),
  likedByMe: z.boolean(),
});

export const likePostResponseSchema = z.object({
  liked: z.boolean(),
  likeCount: z.number(),
});

export const postCardListSchema = z.array(postCardSchema);
export const postListSchema = z.object({
  posts: postCardListSchema,
  totalPages: z.number(),
});

export type PostType = z.infer<typeof postTypeSchema>;
export type CategoryType = z.infer<typeof categoryTypeSchema>;
export type PostImageBlockItem = z.infer<typeof postImageBlockItemSchema>;
export type PostCardResponse = z.infer<typeof postCardSchema>;
export type PostDetailResponse = z.infer<typeof postDetailSchema>;
export type LikePostResponse = z.infer<typeof likePostResponseSchema>;
export type PostListResponse = z.infer<typeof postListSchema>;
