"use client";
import Button from "@/shared/ui/Button";
import { likePost } from "@/features/community/api/community.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Heart } from "lucide-react";

type PostCache = {
  likedByMe: boolean;
  likeCount: number;
};

export default function LikeButton({
  postId,
  initialLikeCount,
  likedByMe,
}: {
  postId: number;
  initialLikeCount: number;
  likedByMe: boolean;
}) {
  const queryClient = useQueryClient();
  const cached = queryClient.getQueryData<PostCache>(["post", postId]);
  const likedByMeCached = cached ? cached.likedByMe : likedByMe;
  const likeCountCached = cached ? cached.likeCount : initialLikeCount;

  const mutation = useMutation({
    mutationFn: () => likePost(postId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["post", postId] });

      const previousPost = queryClient.getQueryData<PostCache>([
        "post",
        postId,
      ]);

      queryClient.setQueryData<PostCache>(["post", postId], (old) => {
        const base = old ?? {
          likedByMe: likedByMeCached,
          likeCount: likeCountCached,
        };
        return {
          ...base,
          likedByMe: !base.likedByMe,
          likeCount: base.likedByMe ? base.likeCount - 1 : base.likeCount + 1,
        };
      });

      return { previousPost };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousPost) {
        queryClient.setQueryData(["post", postId], context.previousPost);
      } else {
        queryClient.removeQueries({ queryKey: ["post", postId] });
      }
    },

    onSuccess: (data) => {
      queryClient.setQueryData<PostCache>(["post", postId], (old) => {
        if (!old) return old;
        return {
          ...old,
          likedByMe: data.liked,
          likeCount: data.likeCount,
        };
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
        className={`h-4 w-4 ${likedByMeCached ? "fill-red-500 text-red-500" : "text-neutral-500"}`}
        aria-hidden
      />
      {mutation.isPending ? "처리 중..." : `좋아요 ${likeCountCached}`}
    </Button>
  );
}
