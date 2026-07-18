import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import {
  fetchBestPosts,
  fetchPostDetail,
  fetchPosts,
  fetchPostsByRegionSlug,
} from "@/features/community/api/post.api";
import { communityKeys } from "./community.keys";
import type { FindPostsParams } from "@/features/community/schemas/post-request.schema";

export function postListQueryOptions(params: FindPostsParams) {
  return queryOptions({
    queryKey: communityKeys.postList(params),
    queryFn: () => fetchPosts(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
    gcTime: 60_000,
  });
}

export function bestPostsQueryOptions() {
  return queryOptions({
    queryKey: communityKeys.bestPosts(),
    queryFn: fetchBestPosts,
  });
}

export function regionPostsQueryOptions(regionSlug: string) {
  return queryOptions({
    queryKey: communityKeys.regionPosts(regionSlug),
    queryFn: () => fetchPostsByRegionSlug(regionSlug),
  });
}

export function postDetailQueryOptions(postId: number) {
  return queryOptions({
    queryKey: communityKeys.postDetail(postId),
    queryFn: () => fetchPostDetail(postId),
  });
}
