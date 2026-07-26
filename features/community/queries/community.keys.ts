import type { FindPostsParams } from "@/features/community/schemas/post-request.schema";

export const communityKeys = {
  all: ["community"] as const,

  posts: () => [...communityKeys.all, "posts"] as const,

  postLists: () => [...communityKeys.posts(), "list"] as const,

  postList: (params: FindPostsParams) =>
    [...communityKeys.postLists(), params] as const,

  bestPosts: () => [...communityKeys.postLists(), "best"] as const,

  regionPosts: (regionSlug: string) =>
    [...communityKeys.postLists(), "region", regionSlug] as const,

  postDetail: (postId: number) =>
    [...communityKeys.posts(), "detail", postId] as const,

  comments: (postId: number) =>
    [...communityKeys.all, "comments", postId] as const,
};
