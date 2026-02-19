"use client";

import { useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { CommentResponse } from "@/types/community";
import { fetchComments, createComment, deleteComment } from "@/lib/api/community/api";

import Button from "@/components/common/Button";
import EmptyState from "@/components/common/EmptyState";
import Skeleton from "@/components/common/Skeleton";
import { Card, CardContent } from "@/components/common/Card";
import CommentItem from "@/components/community/CommentItem";
import CommentForm from "@/components/community/CommentForm";

function formatKoreanDate(iso: string) {
  return new Date(iso).toLocaleDateString();
}

export default function CommentsSection({ postId }: { postId: number }) {
  const qc = useQueryClient();

  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [commentValue, setCommentValue] = useState("");
  const [replyValue, setReplyValue] = useState("");
  const replyFormRef = useRef<HTMLDivElement | null>(null);

  const commentsQuery = useQuery<CommentResponse[]>({
    queryKey: ["comments", postId],
    queryFn: () => fetchComments(postId),
    staleTime: 10_000,
    refetchOnWindowFocus: false,
  });

  const createMutation = useMutation({
    mutationFn: (payload: { content: string; parentId: number | null }) =>
      createComment(postId, payload),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["comments", postId] });
      setCommentValue("");
      setReplyValue("");
      setReplyTo(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (commentId: number) => deleteComment(commentId),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["comments", postId] });
    },
  });

  const comments = useMemo(() => commentsQuery.data ?? [], [commentsQuery.data]);

  const totalCount = useMemo(() => {
    let count = 0;
    for (const c of comments) {
      count += 1;
      count += c.children?.length ?? 0;
    }
    return count;
  }, [comments]);

  const openReply = (parentId: number) => {
    setReplyTo(parentId);
    setReplyValue("");
    requestAnimationFrame(() => {
      replyFormRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  };

  const submitComment = () => {
    const content = commentValue.trim();
    if (!content) return;
    createMutation.mutate({ content, parentId: null });
  };

  const submitReply = () => {
    if (replyTo === null) return;
    const content = replyValue.trim();
    if (!content) return;
    createMutation.mutate({ content, parentId: replyTo });
  };

  const confirmDelete = (commentId: number) => {
    const ok = confirm("댓글을 삭제할까요?");
    if (!ok) return;
    deleteMutation.mutate(commentId);
  };

  if (commentsQuery.isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-10" />
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
      </div>
    );
  }

  if (commentsQuery.isError) {
    return (
      <EmptyState title="댓글을 불러오지 못했어요." description="잠시 후 다시 시도해주세요." />
    );
  }

  return (
    <div className="space-y-4">
      {/* 상단 요약 + 최상위 댓글 입력 */}
      <Card className="rounded-2xl border border-neutral-200">
        <CardContent className="space-y-3 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-neutral-900">
              댓글 <span className="text-neutral-500">({totalCount})</span>
            </p>

            {replyTo !== null ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setReplyTo(null)}
                className="px-2"
              >
                답글 취소
              </Button>
            ) : null}
          </div>

          <CommentForm
            value={commentValue}
            onChange={setCommentValue}
            onSubmit={submitComment}
            placeholder="댓글을 입력하세요"
            submitLabel="등록"
            isSubmitting={createMutation.isPending}
          />
        </CardContent>
      </Card>

      {/* 댓글 목록 */}
      {comments.length === 0 ? (
        <EmptyState title="아직 댓글이 없어요." description="첫 댓글을 남겨보세요." />
      ) : (
        <div className="space-y-3">
          {comments.map((c) => (
            <div key={c.id} className="space-y-2">
              <CommentItem
                author={c.user.nickName}
                content={c.content}
                date={formatKoreanDate(c.createdAt)}
                isDeleted={c.isDeleted}
                onReply={c.isDeleted ? undefined : () => openReply(c.id)}
                onDelete={c.isDeleted ? undefined : () => confirmDelete(c.id)}
              />

              {/* 답글 폼 */}
              {replyTo === c.id ? (
                <div
                  ref={replyFormRef}
                  className="ml-8 rounded-2xl border border-neutral-200 bg-white p-3"
                >
                  <p className="mb-2 text-xs text-neutral-600">
                    <span className="font-semibold">{c.user.nickName}</span> 님에게 답글
                  </p>

                  <CommentForm
                    value={replyValue}
                    onChange={setReplyValue}
                    onSubmit={submitReply}
                    onCancel={() => setReplyTo(null)}
                    placeholder="답글을 입력하세요"
                    submitLabel="답글"
                    isSubmitting={createMutation.isPending}
                    compact
                  />
                </div>
              ) : null}

              {/* children */}
              {c.children?.length ? (
                <div className="ml-8 space-y-2 border-l border-neutral-200 pl-4">
                  {c.children.map((child) => (
                    <CommentItem
                      key={child.id}
                      author={child.user.nickName}
                      content={child.content}
                      date={formatKoreanDate(child.createdAt)}
                      isDeleted={child.isDeleted}
                      isChild
                      onDelete={child.isDeleted ? undefined : () => confirmDelete(child.id)}
                    />
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
