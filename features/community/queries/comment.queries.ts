import { queryOptions } from "@tanstack/react-query";
import { fetchComments } from "@/features/community/api/comment.api";
import { communityKeys } from "./community.keys";

export function commentsQueryOptions(postId: number) {
  return queryOptions({
    queryKey: communityKeys.comments(postId),
    queryFn: () => fetchComments(postId),
    staleTime: 10_000,
  });
}
