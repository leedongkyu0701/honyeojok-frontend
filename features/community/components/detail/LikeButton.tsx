"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import { likePost } from "@/features/community/api/post.api";
import { communityKeys } from "@/features/community/queries/community.keys";
import type { PostDetailResponse } from "@/features/community/schemas/post.schema";
import Button from "@/shared/ui/Button";

type LikeButtonProps = {
  post: PostDetailResponse;
};

export default function LikeButton({ post }: LikeButtonProps) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: () => likePost(post.id),
    onMutate: async () => {
      const queryKey = communityKeys.postDetail(post.id);
      await queryClient.cancelQueries({ queryKey });

      const previousPost = queryClient.getQueryData<PostDetailResponse>(queryKey);
      queryClient.setQueryData<PostDetailResponse>(queryKey, (previous) => {
        if (!previous) return previous;

        return {
          ...previous,
          likedByMe: !previous.likedByMe,
          likeCount: previous.likedByMe
            ? Math.max(previous.likeCount - 1, 0)
            : previous.likeCount + 1,
        };
      });

      return { previousPost };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousPost) {
        queryClient.setQueryData(
          communityKeys.postDetail(post.id),
          context.previousPost,
        );
      }
    },
    onSuccess: (result) => {
      queryClient.setQueryData<PostDetailResponse>(
        communityKeys.postDetail(post.id),
        (previous) => {
          if (!previous) return previous;

          return {
            ...previous,
            likedByMe: result.liked,
            likeCount: result.likeCount,
          };
        },
      );
      void queryClient.invalidateQueries({
        queryKey: communityKeys.postLists(),
      });
    },
  });

  return (
    <Button
      onClick={() => mutation.mutate()}
      disabled={mutation.isPending}
      variant="outline"
      size="sm"
    >
      <Heart
        className={`h-4 w-4 ${post.likedByMe ? "fill-red-500 text-red-500" : "text-neutral-500"}`}
        aria-hidden
      />
      {mutation.isPending ? "처리 중..." : `좋아요 ${post.likeCount}`}
    </Button>
  );
}
