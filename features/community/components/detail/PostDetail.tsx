"use client";

import { useEffect, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deletePost, incrementPostViewCount } from "@/features/community/api/post.api";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { communityKeys } from "@/features/community/queries/community.keys";
import { postDetailQueryOptions } from "@/features/community/queries/post.queries";
import { ApiError } from "@/shared/api/apiError";
import { ErrorCode } from "@/shared/types/error-code";
import { Card, CardContent } from "@/shared/ui/Card";
import EmptyState from "@/shared/ui/EmptyState";
import Skeleton from "@/shared/ui/Skeleton";
import CommentsSection from "./comments/CommentsSection";
import PostActions from "./PostActions";
import PostDetailHeader from "./PostDetailHeader";
import PostImageBlock from "./PostImageBlock";

export default function PostDetail({ id }: { id: number }) {
  const authInitialized = useAuthStore((state) => state.authInitialized);
  const queryClient = useQueryClient();
  const router = useRouter();
  const viewRequestInFlightRef = useRef(false);
  const shouldLoadPersonalizedDetail = authInitialized;
  const postDetailQuery = useQuery({
    ...postDetailQueryOptions(id),
    enabled: shouldLoadPersonalizedDetail,
  });

  useEffect(() => {
    if (!postDetailQuery.data) return;

    const storageKey = `viewed_post_session_${id}`;
    if (sessionStorage.getItem(storageKey) === "1") return;
    if (viewRequestInFlightRef.current) return;

    viewRequestInFlightRef.current = true;
    incrementPostViewCount(id)
      .then(() => sessionStorage.setItem(storageKey, "1"))
      .catch(() => undefined)
      .finally(() => {
        viewRequestInFlightRef.current = false;
      });
  }, [id, postDetailQuery.data]);

  const deleteMutation = useMutation({
    mutationFn: () => deletePost(id),
    meta: { silent: true },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: communityKeys.postLists(),
      });
      queryClient.removeQueries({ queryKey: communityKeys.postDetail(id) });
      toast.success("게시글이 삭제되었어요.");
      router.push("/community");
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        if (error.code === ErrorCode.AUTH_FORBIDDEN) {
          toast.error("본인의 게시글만 삭제할 수 있어요.");
          return;
        }
        if (error.code === ErrorCode.RESOURCE_NOT_FOUND) {
          toast.error("이미 삭제된 게시글이에요.");
          router.push("/community");
          return;
        }
      }
      toast.error("게시글 삭제에 실패했어요. 잠시 후 다시 시도해주세요.");
    },
  });

  if (!authInitialized || postDetailQuery.isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-24" />
        <Skeleton className="h-64" />
        <Skeleton className="h-40" />
      </div>
    );
  }

  if (postDetailQuery.isError) {
    return (
      <EmptyState
        title="게시글을 불러오지 못했어요."
        description="잠시 후 다시 시도해주세요."
      />
    );
  }

  const post = postDetailQuery.data;
  if (!post) {
    return (
      <EmptyState
        title="게시글이 없습니다."
        description="다른 게시글을 확인해보세요."
      />
    );
  }

  const handleDelete = () => {
    if (deleteMutation.isPending || !confirm("정말 삭제할까요?")) return;
    deleteMutation.mutate();
  };

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
        <CardContent className="space-y-5 p-5">
          <PostDetailHeader
            post={post}
            actions={
              <PostActions
                post={post}
                isDeleting={deleteMutation.isPending}
                onDelete={handleDelete}
              />
            }
          />
          <PostImageBlock images={post.images} />
          <article className="prose prose-neutral max-w-none">
            <p className="whitespace-pre-wrap text-sm leading-7 text-neutral-700">
              {post.content}
            </p>
          </article>
        </CardContent>
      </Card>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-neutral-900">댓글</h2>
        <CommentsSection postId={post.id} />
      </section>
    </div>
  );
}
