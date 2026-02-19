"use client";

import {
  fetchPostDetail,
  deletePost,
  incrementPostViewCount,
} from "@/lib/api/community/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { PostDetailResponse } from "@/types/community";
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
import { cn } from "@/lib/utils";
import { timeAgoOrDate } from "@/lib/timeAgo";
import { useEffect } from "react";

function typeLabel(t: PostDetailResponse["type"]) {
  if (t === "REVIEW") return "리뷰";
  if (t === "QUESTION") return "질문";
  return "자유";
}

function typeBadgeClass(t: PostDetailResponse["type"]) {
  if (t === "REVIEW")
    return "bg-emerald-50 text-emerald-700 border-emerald-100";
  if (t === "QUESTION") return "bg-indigo-50 text-indigo-700 border-indigo-100";
  return "bg-neutral-50 text-neutral-700 border-neutral-200";
}

export default function PostDetail({ id }: { id: number }) {
  const {
    data: postDetail,
    isLoading,
    isError,
  } = useQuery<PostDetailResponse>({
    queryKey: ["post", id],
    queryFn: () => fetchPostDetail(id),
    staleTime: 10_000,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!id) return;

    const key = `viewed_post_session_${id}`;
    if (sessionStorage.getItem(key) === "1") return;

    sessionStorage.setItem(key, "1");

    incrementPostViewCount(id).catch(() => {});
  }, [id]);

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

  const handleDelete = () => {
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

  const nickName = postDetail.nickName ?? "익명";
  const createdText = timeAgoOrDate(postDetail.createdAt);


  return (
    <div className="space-y-6">
      {/* Post */}
      <Card className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
        <CardContent className="space-y-5 p-5">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 space-y-3">
              {/* 타입 + 시간 + 조회/좋아요 */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span
                  className={cn(
                    "inline-flex items-center rounded-full border px-2 py-0.5 font-medium",
                    typeBadgeClass(postDetail.type),
                  )}
                >
                  {typeLabel(postDetail.type)}
                </span>

                <span className="text-neutral-400">·</span>
                <span className="text-neutral-600">{createdText}</span>


                <span className="text-neutral-300">·</span>
                <span className="inline-flex items-center gap-1 text-neutral-500">
                  👀 {postDetail.viewCount}
                </span>
                <span className="inline-flex items-center gap-1 text-neutral-500">
                  ❤️ {postDetail.likeCount}
                </span>
              </div>

              {/* 제목 */}
              <h1 className="text-xl font-bold leading-snug text-neutral-900 md:text-2xl">
                {postDetail.title}
              </h1>

              {/* 작성자 + 지역 */}
              <div className="flex flex-wrap items-center gap-2 text-sm text-neutral-600">
                <span className="truncate">
                  <span className="text-neutral-400">by.</span> {nickName}
                </span>

                {postDetail.region ? (
                  <>
                    <span className="text-neutral-300">·</span>
                    <Badge className="rounded-full">{postDetail.region}</Badge>
                  </>
                ) : null}
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
