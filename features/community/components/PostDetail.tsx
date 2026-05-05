"use client";

import {
  fetchPostDetail,
  deletePost,
  incrementPostViewCount,
} from "@/features/community/api/community.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { PostDetailResponse } from "@/features/community/schemas/response";
import { useRouter } from "next/navigation";

import { Card, CardContent } from "@/shared/ui/Card";
import Button from "@/shared/ui/Button";
import EmptyState from "@/shared/ui/EmptyState";
import Skeleton from "@/shared/ui/Skeleton";

import LikeButton from "./LikeButton";
import CommentsSection from "./CommentsSection";

import { ApiError } from "@/shared/api/apiError";
import { ErrorCode } from "@/shared/types/error-code";
import { toast } from "sonner";
import { cn } from "@/shared/lib/utils";
import { timeAgoOrDate } from "@/shared/lib/timeAgo";
import { useEffect } from "react";
import PostImageBlock from "./PostImageBlock";
import { Eye, MapPin } from "lucide-react";
import { useAuthStore } from "@/features/auth/store/auth.store";

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
  const authInitialized = useAuthStore((s) => s.authInitialized);
  const {
    data: postDetail,
    isLoading,
    isError,
  } = useQuery<PostDetailResponse>({
    queryKey: ["post", id],
    queryFn: () => fetchPostDetail(id),
    enabled: authInitialized,
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

  const handleDelete = () => {
    const ok = confirm("정말 삭제할까요?");
    if (!ok) return;
    deleteMutation.mutate();
  };

  if (isLoading || !authInitialized) {
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
      <Card className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
        <CardContent className="space-y-5 p-5">
          <div className="space-y-3">
            <div className="flex flex-nowrap items-center gap-2 text-xs">
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
              <span className="text-neutral-400">·</span>
              <span className="inline-flex items-center gap-1 text-neutral-500">
                <Eye className="h-3 w-3" aria-hidden />
                {postDetail.viewCount}
              </span>
              {postDetail.regionName && (
                <div className="inline-flex items-center gap-1 text-xs text-neutral-500">
                  <span className="text-neutral-400">·</span>
                  <MapPin
                    className="h-3.5 w-3.5 text-neutral-400"
                    aria-hidden
                  />
                  <span>{postDetail.regionName}</span>
                </div>
              )}

              <div className="ml-auto hidden items-center gap-1 md:flex">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDelete}
                  className="px-2 py-1 text-xs text-neutral-500 hover:text-red-600"
                  disabled={deleteMutation.isPending}
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

            <div className="flex justify-end gap-1 md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                className="px-2 py-1 text-xs text-neutral-500 hover:text-red-600"
                disabled={deleteMutation.isPending}
              >
                Delete
              </Button>

              <LikeButton
                postId={postDetail.id}
                initialLikeCount={postDetail.likeCount}
                likedByMe={postDetail.likedByMe}
              />
            </div>

            <div className="space-y-1">
              <h1 className="text-xl font-bold leading-snug text-neutral-900 md:text-2xl">
                {postDetail.title}
              </h1>

              <div className="flex items-center gap-2 text-sm text-neutral-500">
                <span>by.</span>
                <span className="font-medium text-neutral-700">{nickName}</span>
              </div>
            </div>
          </div>

          {postDetail.images?.length ? (
            <PostImageBlock images={postDetail.images} />
          ) : null}

          <article className="prose prose-neutral max-w-none">
            <p className="whitespace-pre-wrap text-sm leading-7 text-neutral-700">
              {postDetail.content}
            </p>
          </article>
        </CardContent>
      </Card>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-neutral-900">댓글</h2>

        <CommentsSection postId={postDetail.id} />
      </section>
    </div>
  );
}
