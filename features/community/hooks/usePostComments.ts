"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createComment,
  deleteComment,
} from "@/features/community/api/comment.api";
import type { CreateCommentBody } from "@/features/community/schemas/comment.schema";
import { commentsQueryOptions } from "@/features/community/queries/comment.queries";
import { communityKeys } from "@/features/community/queries/community.keys";

export function usePostComments(postId: number) {
  const queryClient = useQueryClient();
  const commentsQuery = useQuery(commentsQueryOptions(postId));

  const createCommentMutation = useMutation({
    mutationFn: (body: CreateCommentBody) => createComment(postId, body),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: communityKeys.comments(postId),
      }),
  });

  const deleteCommentMutation = useMutation({
    mutationFn: deleteComment,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: communityKeys.comments(postId),
      }),
  });

  return {
    commentsQuery,
    createCommentMutation,
    deleteCommentMutation,
  };
}
