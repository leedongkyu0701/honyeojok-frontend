"use client";

import { fetchPostDetail, deletePost } from "@/lib/api/community/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { PostDetailVM } from "@/types/post";
import { useRouter } from "next/navigation";
import PostImageCarousel from "./PostImageCarousel";

import { Card, CardContent } from "@/components/common/Card";
import Badge from "@/components/common/Badge";
import Button from "@/components/common/Button";
import EmptyState from "@/components/common/EmptyState";
import Skeleton from "@/components/common/Skeleton";

import LikeButton from "./LikeButton";
import CommentsSection from "./CommentsSection";

import { ApiError } from "@/lib/apiError";
import { ErrorCode } from "@/types/error-code";
import { toast } from "sonner";

export default function PostDetail({ id }: { id: number }) {
  const {
    data: postDetail,
    isLoading,
    isError,
  } = useQuery<PostDetailVM>({
    queryKey: ["post", id],
    queryFn: () => fetchPostDetail(id),
  });

  const queryClient = useQueryClient();
  const router = useRouter();

  const deleteMutation = useMutation({
    mutationFn: () => deletePost(id),
    meta: { silent: true },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.removeQueries({ queryKey: ["post", id] });
      toast.success("게시글이 삭제되었어요.");
      router.push("/community");
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        if (error.code === ErrorCode.AUTH_FORBIDDEN) {
          toast.error("삭제 권한이 없어요.");
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

  const handleDelete = async () => {
    const ok = confirm("정말 삭제할까요?");
    if (!ok) return;
    deleteMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-24" />
        <Skeleton className="h-64" />
        <Skeleton className="h-40" />
      </div>
    );
  }

  if (isError) {
    return (
      <EmptyState
        title="게시글을 불러오지 못했어요."
        description="잠시 후 다시 시도해주세요."
      />
    );
  }

  if (!postDetail) {
    return (
      <EmptyState
        title="게시글이 없습니다."
        description="다른 게시글을 확인해보세요."
      />
    );
  }

  const created = new Date(postDetail.createdAt).toLocaleDateString();

  return (
    <div className="space-y-6">
      {/* Post */}
      <Card className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
        <CardContent className="space-y-5 p-5">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 space-y-2">
              <h1 className="text-xl font-bold leading-snug text-neutral-900 md:text-2xl">
                {postDetail.title}
              </h1>

              <div className="flex flex-wrap items-center gap-2 text-sm text-neutral-500">
                <Badge>{postDetail.region ?? "지역 미정"}</Badge>
                <span className="text-neutral-300">·</span>
                <span>{created}</span>
                <span className="text-neutral-300">·</span>
                <span className="truncate">작성자 {postDetail.nickName}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex shrink-0 items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                className="px-3 text-neutral-500 hover:text-red-600"
              >
                Delete
              </Button>

              <LikeButton
                postId={postDetail.id}
                initialLikeCount={postDetail.likeCount}
                likedByMe={postDetail.likedByMe}
              />
            </div>
          </div>

          {/* Images */}
          {postDetail.imageUrls?.length ? (
            <PostImageCarousel imageUrls={postDetail.imageUrls} />
          ) : null}

          {/* Content */}
          <article className="prose prose-neutral max-w-none">
            <p className="whitespace-pre-wrap text-sm leading-7 text-neutral-700">
              {postDetail.content}
            </p>
          </article>
        </CardContent>
      </Card>

      {/* Comments */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-neutral-900">댓글</h2>
          <p className="text-xs text-neutral-500">건전한 대화를 부탁해요</p>
        </div>
        <CommentsSection postId={postDetail.id} />
      </section>
    </div>
  );
}
